"""HTTP API for Multiverse Studio and the local evaluation worker."""
import os
import hashlib
import json
import re
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from .store import Store
from .tasks import load_tasks
from .agents import PatternAgent
from .runner import Runner
from .memory import MemoryBroker
from .jobs import JobManager
from . import evaluator
from .coding import CodingRunService
from .repositories import RepositoryInspector, RepositoryRejected

PACKAGE_STUDIO = Path(__file__).parent / "studio_live.html"


class InspectionRequest(BaseModel):
    repo_url: str
    commit_sha: str


class CodingTaskRequest(BaseModel):
    inspection_id: str
    objective: str = Field(min_length=12, max_length=8_000)
    accepted_plan_digest: str = Field(min_length=64, max_length=64)
    acceptance_notes: str = Field(default="", max_length=4_000)
    max_attempts: int = Field(default=5, ge=1, le=5)
    max_seconds: int = Field(default=600, ge=30, le=3_600)
    max_input_tokens: int = Field(default=100_000, ge=1_000, le=1_000_000)
    max_output_tokens: int = Field(default=30_000, ge=1_000, le=250_000)
    allow_registry_network: bool = True
    allow_secrets: bool = False


class CodingRunRequest(BaseModel):
    adapter_policy: Literal["auto", "native"] = "auto"
    memory_mode: Literal["none", "reviewed"] = "none"


class CodingEvaluationRequest(BaseModel):
    task_id: str
    adapter_policy: Literal["auto", "native"] = "native"


class WaitlistRequest(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    website: str = Field(default="", max_length=200)


EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def create_app(db=":memory:", agent=None, workspace_root=None, repository_inspector=None, coding_service=None):
    store = Store(db)
    agent = agent or PatternAgent()
    runner, broker = Runner(store, agent), MemoryBroker(store)
    jobs = JobManager(store)
    repository_inspector = repository_inspector or RepositoryInspector()
    coding_service = coding_service or CodingRunService(store)

    @asynccontextmanager
    async def lifespan(app):
        yield
        jobs.shutdown()

    app = FastAPI(title="Multiverse Core", version="0.3.0", lifespan=lifespan)
    train, held = load_tasks("train"), load_tasks("eval")
    api_token = os.environ.get("MULTIVERSE_API_TOKEN")
    workspace = Path(workspace_root).resolve() if workspace_root else Path(__file__).resolve().parents[2]
    studio_dir, public_dir = workspace / "studio", workspace / "public"

    app.state.store = store
    app.state.jobs = jobs
    app.state.repository_inspector = repository_inspector
    app.state.coding_service = coding_service

    if studio_dir.is_dir():
        app.mount("/studio", StaticFiles(directory=studio_dir, html=True), name="studio")
    if public_dir.is_dir():
        app.mount("/public", StaticFiles(directory=public_dir), name="public")

    def reviewer(authorization, actor):
        if api_token:
            if authorization != f"Bearer {api_token}":
                raise HTTPException(401, "valid bearer token required")
            if not actor:
                raise HTTPException(400, "X-Multiverse-Actor is required")
            return actor
        return actor or "local-human"

    def request_digest(body):
        return hashlib.sha256(json.dumps(body.model_dump(), sort_keys=True).encode("utf-8")).hexdigest()

    def replay_idempotent(key, operation, body):
        if not key:
            return None, None
        digest = request_digest(body)
        try:
            return store.idempotency_resource(key, operation, digest), digest
        except ValueError as error:
            raise HTTPException(409, str(error)) from error

    @app.get("/")
    def home():
        if studio_dir.is_dir():
            return RedirectResponse("/studio/")
        return HTMLResponse(PACKAGE_STUDIO.read_text(encoding="utf-8"))

    @app.get("/api/health")
    def health():
        return {
            "ok": True,
            "product": "multiverse-core",
            "version": app.version,
            "agent": agent.name,
            "synthetic": bool(getattr(agent, "synthetic", False)),
            "capabilities": ["tasks", "runs", "traces", "verses", "memory-review", "evaluation-jobs", "repository-inspection", "coding-runs"],
        }

    @app.post("/api/v1/waitlist", status_code=202)
    def join_waitlist(body: WaitlistRequest):
        if body.website:
            return {"accepted": True}
        email = body.email.strip().lower()
        if not EMAIL_PATTERN.fullmatch(email):
            raise HTTPException(422, "enter a valid email address")
        store.add_waitlist_signup(email)
        return {"accepted": True}

    @app.get("/api/tasks")
    def tasks():
        return [{"id": task.id, "family": task.family, "tags": task.tags, "split": task.split} for task in train + held]

    @app.post("/api/learn", status_code=202)
    def learn(authorization: str | None = Header(default=None), x_multiverse_actor: str | None = Header(default=None)):
        actor = reviewer(authorization, x_multiverse_actor)
        return jobs.submit("learn", lambda: {
            "actor": actor,
            "memory": evaluator.learn(runner, broker, train, 8, 3, policy="manual"),
        })

    @app.get("/api/memory")
    def memory(status: str | None = None):
        return store.memories(status)

    @app.get("/api/memory/{mid}/log")
    def memory_log(mid: str):
        if not store.memory(mid):
            raise HTTPException(404, "no such memory")
        return store.memory_log(mid)

    @app.post("/api/memory/{mid}/approve")
    def approve(mid: str, authorization: str | None = Header(default=None), x_multiverse_actor: str | None = Header(default=None)):
        if not store.memory(mid):
            raise HTTPException(404, "no such memory")
        try:
            broker.promote(mid, reviewer(authorization, x_multiverse_actor))
        except ValueError as error:
            raise HTTPException(409, str(error)) from error
        return store.memory(mid)

    @app.post("/api/memory/{mid}/reject")
    def reject(mid: str, authorization: str | None = Header(default=None), x_multiverse_actor: str | None = Header(default=None)):
        if not store.memory(mid):
            raise HTTPException(404, "no such memory")
        try:
            store.set_status(mid, "rejected", reviewer(authorization, x_multiverse_actor), "rejected in Studio")
        except ValueError as error:
            raise HTTPException(409, str(error)) from error
        return store.memory(mid)

    @app.post("/api/memory/{mid}/demote")
    def demote(mid: str, authorization: str | None = Header(default=None), x_multiverse_actor: str | None = Header(default=None)):
        if not store.memory(mid):
            raise HTTPException(404, "no such memory")
        try:
            broker.demote(mid, "demoted in Studio", reviewer(authorization, x_multiverse_actor))
        except ValueError as error:
            raise HTTPException(409, str(error)) from error
        return store.memory(mid)

    @app.post("/api/eval", status_code=202)
    def run_eval(budget: int = 3, authorization: str | None = Header(default=None), x_multiverse_actor: str | None = Header(default=None)):
        actor = reviewer(authorization, x_multiverse_actor)
        if budget < 1 or budget > 20:
            raise HTTPException(400, "budget must be between 1 and 20")
        return jobs.submit("evaluation", lambda: {
            "actor": actor,
            "report": evaluator.report(evaluator.evaluate(runner, broker, held, budget), store, train, held, budget, getattr(agent, "synthetic", False)),
        })

    @app.post("/api/experiment", status_code=202)
    def experiment(authorization: str | None = Header(default=None), x_multiverse_actor: str | None = Header(default=None)):
        actor = reviewer(authorization, x_multiverse_actor)
        return jobs.submit("experiment", lambda: {
            "actor": actor,
            "report": evaluator.experiment(runner, broker, train, held, policy="manual"),
        })

    @app.get("/api/jobs")
    def list_jobs(limit: int = 50):
        return store.jobs(max(1, min(limit, 200)))

    @app.get("/api/jobs/{jid}")
    def job(jid: str):
        item = store.job(jid)
        if not item:
            raise HTTPException(404, "no such job")
        return item

    @app.get("/api/eval/latest")
    def latest():
        return next((item for item in store.jobs(200) if item["kind"] in {"evaluation", "experiment"} and item["status"] == "completed"), None)

    @app.get("/api/runs")
    def runs():
        return store.runs()

    @app.get("/api/runs/{rid}/trace")
    def trace(rid: str):
        if not store.run(rid):
            raise HTTPException(404, "no such run")
        return store.events(rid)

    @app.get("/api/runs/{rid}/verses")
    def verses(rid: str):
        if not store.run(rid):
            raise HTTPException(404, "no such run")
        return [event["payload"] for event in store.events(rid) if event["kind"] == "attempt"]

    # Versioned repository coding API. Legacy fixture APIs above remain unchanged.
    @app.post("/api/v1/repository-inspections", status_code=202)
    def create_repository_inspection(body: InspectionRequest, idempotency_key: str | None = Header(default=None),
                                     authorization: str | None = Header(default=None), x_multiverse_actor: str | None = Header(default=None)):
        reviewer(authorization, x_multiverse_actor)
        replay, digest = replay_idempotent(idempotency_key, "repository-inspection", body)
        if replay:
            return store.inspection(replay)
        inspection = store.create_inspection(body.repo_url, body.commit_sha)
        if idempotency_key:
            store.remember_idempotency(idempotency_key, "repository-inspection", digest, inspection["id"])

        def inspect_operation():
            store.update_inspection(inspection["id"], "running")
            try:
                result = repository_inspector.inspect(inspection["id"], body.repo_url, body.commit_sha)
            except (RepositoryRejected, OSError, RuntimeError) as error:
                store.update_inspection(inspection["id"], "failed", error=str(error))
                raise
            store.update_inspection(inspection["id"], "ready", result=result)
            return {"inspection_id": inspection["id"], "status": "ready"}

        job = jobs.submit("repository-inspection", inspect_operation)
        response = store.inspection(inspection["id"])
        response["job_id"] = job["id"]
        return response

    @app.get("/api/v1/repository-inspections/{inspection_id}")
    def get_repository_inspection(inspection_id: str):
        inspection = store.inspection(inspection_id)
        if not inspection:
            raise HTTPException(404, "no such repository inspection")
        return inspection

    @app.post("/api/v1/tasks", status_code=201)
    def create_coding_task(body: CodingTaskRequest, idempotency_key: str | None = Header(default=None),
                           authorization: str | None = Header(default=None), x_multiverse_actor: str | None = Header(default=None)):
        reviewer(authorization, x_multiverse_actor)
        replay, digest = replay_idempotent(idempotency_key, "coding-task", body)
        if replay:
            return store.coding_task(replay)
        inspection = store.inspection(body.inspection_id)
        if not inspection:
            raise HTTPException(404, "no such repository inspection")
        if inspection["status"] != "ready":
            raise HTTPException(409, "repository inspection is not ready")
        plan = inspection["execution_plan"]
        if plan["digest"] != body.accepted_plan_digest:
            raise HTTPException(409, "accepted execution plan does not match the inspected plan")
        if body.allow_secrets:
            raise HTTPException(400, "secret access is not supported by the MVP")
        if plan["install_commands"] and not body.allow_registry_network:
            raise HTTPException(400, "the detected dependency setup requires reviewed registry access")
        task = store.create_coding_task(body.inspection_id, {
            "objective": body.objective,
            "acceptance_notes": body.acceptance_notes,
            "accepted_plan": plan,
            "budget": {
                "max_attempts": body.max_attempts,
                "max_seconds": body.max_seconds,
                "max_input_tokens": body.max_input_tokens,
                "max_output_tokens": body.max_output_tokens,
            },
            "permissions": {"registry_network": body.allow_registry_network, "secrets": False},
        })
        if idempotency_key:
            store.remember_idempotency(idempotency_key, "coding-task", digest, task["id"])
        return task

    @app.post("/api/v1/tasks/{task_id}/runs", status_code=202)
    def create_coding_run(task_id: str, body: CodingRunRequest, idempotency_key: str | None = Header(default=None),
                          authorization: str | None = Header(default=None), x_multiverse_actor: str | None = Header(default=None)):
        reviewer(authorization, x_multiverse_actor)
        operation = f"coding-run:{task_id}"
        replay, digest = replay_idempotent(idempotency_key, operation, body)
        if replay:
            return store.coding_run(replay)
        if not store.coding_task(task_id):
            raise HTTPException(404, "no such coding task")
        run = store.create_coding_run(task_id, body.adapter_policy, body.memory_mode)
        if idempotency_key:
            store.remember_idempotency(idempotency_key, operation, digest, run["id"])
        job = jobs.submit("coding-run", lambda: coding_service.execute(run["id"]))
        store.attach_coding_job(run["id"], job["id"])
        return store.coding_run(run["id"])

    @app.get("/api/v1/runs")
    def list_coding_runs():
        return store.coding_runs()

    @app.get("/api/v1/runs/{run_id}")
    def get_coding_run(run_id: str):
        run = store.coding_run(run_id)
        if not run:
            raise HTTPException(404, "no such coding run")
        return run

    @app.get("/api/v1/runs/{run_id}/events")
    def get_coding_events(run_id: str):
        if not store.coding_run(run_id):
            raise HTTPException(404, "no such coding run")
        return store.coding_events(run_id)

    @app.get("/api/v1/runs/{run_id}/artifacts")
    def get_coding_artifacts(run_id: str):
        if not store.coding_run(run_id):
            raise HTTPException(404, "no such coding run")
        return store.coding_artifacts(run_id)

    @app.post("/api/v1/evaluations", status_code=202)
    def create_coding_evaluation(body: CodingEvaluationRequest, idempotency_key: str | None = Header(default=None),
                                 authorization: str | None = Header(default=None), x_multiverse_actor: str | None = Header(default=None)):
        reviewer(authorization, x_multiverse_actor)
        replay, digest = replay_idempotent(idempotency_key, "coding-evaluation", body)
        if replay:
            return store.coding_evaluation(replay)
        if not store.coding_task(body.task_id):
            raise HTTPException(404, "no such coding task")
        evaluation = store.create_evaluation(body.task_id)
        if idempotency_key:
            store.remember_idempotency(idempotency_key, "coding-evaluation", digest, evaluation["id"])

        def evaluation_operation():
            store.update_evaluation(evaluation["id"], "running")
            baseline = store.create_coding_run(body.task_id, body.adapter_policy, "none")
            coding_service.execute(baseline["id"])
            treatment = store.create_coding_run(body.task_id, body.adapter_policy, "reviewed")
            coding_service.execute(treatment["id"])
            baseline = store.coding_run(baseline["id"])
            treatment = store.coding_run(treatment["id"])
            comparable = baseline["comparable"] and treatment["comparable"]
            result = {
                "comparable": comparable,
                "baseline": {"run_id": baseline["id"], "outcome": baseline["outcome"]},
                "treatment": {"run_id": treatment["id"], "outcome": treatment["outcome"]},
                "claim_allowed": comparable and baseline["outcome"] != "blocked" and treatment["outcome"] != "blocked",
            }
            return store.update_evaluation(
                evaluation["id"], "completed", baseline["id"], treatment["id"], result=result
            )

        job = jobs.submit("coding-evaluation", evaluation_operation)
        response = store.coding_evaluation(evaluation["id"])
        response["job_id"] = job["id"]
        return response

    @app.get("/api/v1/evaluations/{evaluation_id}")
    def get_coding_evaluation(evaluation_id: str):
        evaluation = store.coding_evaluation(evaluation_id)
        if not evaluation:
            raise HTTPException(404, "no such coding evaluation")
        return evaluation

    return app
