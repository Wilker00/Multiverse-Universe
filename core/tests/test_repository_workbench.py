import json
from pathlib import Path
import tempfile
import time
import unittest

from multiverse_core.api import create_app
from multiverse_core.coding import CodingRunService, model_for_attempt
from multiverse_core.repositories import (
    InspectionLimits,
    RepositoryRejected,
    detect_execution_plan,
    validate_public_repository_url,
)
from multiverse_core.store import Store


PUBLIC_ANSWER = [(None, None, None, None, ("93.184.216.34", 443))]
PRIVATE_ANSWER = [(None, None, None, None, ("127.0.0.1", 443))]


def plan(stack="python"):
    value = {
        "stack": stack,
        "install_commands": [["python", "-m", "pip", "install", "-e", "."]],
        "check_commands": [["python", "-m", "pytest", "-q"]],
        "image": "registry.example/runner@sha256:" + "a" * 64,
        "setup_network": ["pypi.org:443"],
        "run_network": "deny",
        "limits": {"clone_seconds": 90},
        "digest": "d" * 64,
    }
    return value


class RepositorySafety(unittest.TestCase):
    def test_public_https_is_required(self):
        self.assertEqual(
            validate_public_repository_url("https://example.com/repo.git", resolver=lambda *args, **kwargs: PUBLIC_ANSWER),
            "https://example.com/repo.git",
        )
        for url in ("http://example.com/repo.git", "file:///tmp/repo", "https://user:pass@example.com/repo.git"):
            with self.assertRaises(RepositoryRejected):
                validate_public_repository_url(url, resolver=lambda *args, **kwargs: PUBLIC_ANSWER)
        with self.assertRaises(RepositoryRejected):
            validate_public_repository_url("https://localhost/repo.git", resolver=lambda *args, **kwargs: PRIVATE_ANSWER)

    def test_python_node_and_rust_plans_are_deterministic(self):
        limits = InspectionLimits()
        image = "registry.example/runner@sha256:" + "a" * 64
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "pyproject.toml").write_text("[project]\nname='demo'\n", encoding="utf-8")
            (root / "tests").mkdir()
            python = detect_execution_plan(root, image, limits)
            self.assertEqual(python.stack, "python")
            self.assertEqual(python.check_commands[0], ("python", "-m", "pytest", "-q"))
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "package.json").write_text(json.dumps({"scripts": {"test": "node --test"}}), encoding="utf-8")
            (root / "package-lock.json").write_text("{}", encoding="utf-8")
            node = detect_execution_plan(root, image, limits)
            self.assertEqual(node.install_commands[0], ("npm", "ci"))
            self.assertEqual(node.check_commands[0], ("npm", "test"))
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "Cargo.toml").write_text("[package]\nname='demo'\nversion='0.1.0'\n", encoding="utf-8")
            (root / "Cargo.lock").write_text("", encoding="utf-8")
            rust = detect_execution_plan(root, image, limits)
            self.assertEqual(rust.check_commands[0], ("cargo", "test", "--locked"))

    def test_mixed_stack_requires_review_instead_of_guessing(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "pyproject.toml").write_text("", encoding="utf-8")
            (root / "package.json").write_text("{}", encoding="utf-8")
            with self.assertRaisesRegex(RepositoryRejected, "multiple stacks"):
                detect_execution_plan(root, "image@sha256:" + "a" * 64, InspectionLimits())


class FakeTokenClient:
    def validate_models(self, configured):
        return set(configured.values())

    def chat(self, model, messages, tools):
        return {
            "choices": [{"message": {"content": None, "tool_calls": [{
                "id": "call_1",
                "function": {"name": "run_checks", "arguments": "{}"},
            }]}}],
            "usage": {"prompt_tokens": 20, "completion_tokens": 5},
        }


class FakeSandbox:
    def __init__(self, run_id, worktree, accepted_plan):
        self.accepted_plan = accepted_plan

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def run_checks(self):
        return {"ok": True, "commands": [{"command": self.accepted_plan["check_commands"][0], "returncode": 0, "output": "passed"}]}

    def diff(self):
        return "diff --git a/demo.py b/demo.py\n--- a/demo.py\n+++ b/demo.py\n-old\n+new\n"


class CodingRuntime(unittest.TestCase):
    def setUp(self):
        self.previous = {
            name: __import__("os").environ.get(name)
            for name in ("NEBIUS_MODEL_LIGHTNING", "NEBIUS_MODEL_SUPER", "NEBIUS_MODEL_ULTRA")
        }
        __import__("os").environ.update({
            "NEBIUS_MODEL_LIGHTNING": "lightning",
            "NEBIUS_MODEL_SUPER": "super",
            "NEBIUS_MODEL_ULTRA": "ultra",
        })

    def tearDown(self):
        environment = __import__("os").environ
        for name, value in self.previous.items():
            if value is None:
                environment.pop(name, None)
            else:
                environment[name] = value

    def test_model_routing_is_deterministic(self):
        models = {"lightning": "l", "super": "s", "ultra": "u"}
        self.assertEqual([model_for_attempt(i, models)[0] for i in range(1, 6)], ["lightning", "lightning", "super", "super", "ultra"])

    def test_native_run_records_evidence(self):
        store = Store()
        inspection = store.create_inspection("https://example.com/repo.git", "a" * 40)
        store.update_inspection(inspection["id"], "ready", {
            "repo_url": "https://example.com/repo.git", "commit_sha": "a" * 40,
            "worktree": "C:/staged/repo", "execution_plan": plan(), "inventory": {}, "requires_review": True,
        })
        task = store.create_coding_task(inspection["id"], {
            "objective": "Make the declared repository checks pass.", "acceptance_notes": "",
            "accepted_plan": plan(), "budget": {"max_attempts": 5, "max_seconds": 300, "max_input_tokens": 100_000, "max_output_tokens": 30_000},
            "permissions": {"registry_network": True, "secrets": False},
        })
        run = store.create_coding_run(task["id"], "native", "none")
        result = CodingRunService(store, FakeTokenClient(), FakeSandbox).execute(run["id"])
        self.assertEqual(result["outcome"], "checks_passed")
        self.assertTrue(result["comparable"])
        names = {artifact["name"] for artifact in store.coding_artifacts(run["id"])}
        self.assertEqual(names, {"checks.json", "diff-summary.json", "manifest.json", "patch.diff", "trace.json", "usage.json"})


class FakeInspector:
    def inspect(self, inspection_id, repo_url, commit_sha):
        return {
            "repo_url": repo_url, "commit_sha": commit_sha, "worktree": "C:/staged/repo",
            "inventory": {"files": 3, "bytes": 40, "source_bytes": 20},
            "execution_plan": plan(), "requires_review": True,
        }


class FakeCodingService:
    def __init__(self):
        self.store = None

    def execute(self, run_id):
        self.store.update_coding_run(run_id, "running", started=time.time())
        self.store.coding_event(run_id, "run_started", {"fake": True})
        self.store.save_coding_artifact(run_id, "manifest.json", "application/json", "{}")
        return self.store.update_coding_run(run_id, "completed", outcome="checks_passed", completed=time.time())


class VersionedApi(unittest.TestCase):
    def test_waitlist_signup_is_public_validated_and_idempotent(self):
        from fastapi.testclient import TestClient

        app = create_app()
        try:
            with TestClient(app) as client:
                first = client.post("/api/v1/waitlist", json={"email": "Builder@Example.com"})
                duplicate = client.post("/api/v1/waitlist", json={"email": "builder@example.com"})
                invalid = client.post("/api/v1/waitlist", json={"email": "not-an-email"})
                honeypot = client.post("/api/v1/waitlist", json={"email": "bot@example.com", "website": "spam"})

                self.assertEqual(first.status_code, 202)
                self.assertEqual(first.json(), {"accepted": True})
                self.assertEqual(duplicate.status_code, 202)
                self.assertEqual(invalid.status_code, 422)
                self.assertEqual(honeypot.status_code, 202)
                row = app.state.store._one("SELECT COUNT(*) AS count FROM waitlist_signups")
                self.assertEqual(row["count"], 1)
        finally:
            app.state.jobs.shutdown()

    def test_inspect_create_run_and_idempotency(self):
        from fastapi.testclient import TestClient

        service = FakeCodingService()
        app = create_app(repository_inspector=FakeInspector(), coding_service=service)
        service.store = app.state.store
        try:
            with TestClient(app) as client:
                response = client.post("/api/v1/repository-inspections", json={
                    "repo_url": "https://example.com/repo.git", "commit_sha": "a" * 40,
                }, headers={"Idempotency-Key": "inspection-one"})
                self.assertEqual(response.status_code, 202)
                inspection_id = response.json()["id"]
                for _ in range(100):
                    inspection = client.get(f"/api/v1/repository-inspections/{inspection_id}").json()
                    if inspection["status"] == "ready":
                        break
                    time.sleep(0.01)
                self.assertEqual(inspection["status"], "ready")
                task_body = {
                    "inspection_id": inspection_id,
                    "objective": "Make the declared repository checks pass.",
                    "acceptance_notes": "Keep the public API stable.",
                    "accepted_plan_digest": "d" * 64,
                    "max_attempts": 5,
                    "max_seconds": 300,
                    "allow_registry_network": True,
                    "allow_secrets": False,
                }
                first = client.post("/api/v1/tasks", json=task_body, headers={"Idempotency-Key": "task-one"})
                second = client.post("/api/v1/tasks", json=task_body, headers={"Idempotency-Key": "task-one"})
                self.assertEqual(first.status_code, 201)
                self.assertEqual(first.json()["id"], second.json()["id"])
                run = client.post(f"/api/v1/tasks/{first.json()['id']}/runs", json={"adapter_policy": "native", "memory_mode": "none"})
                self.assertEqual(run.status_code, 202)
                run_id = run.json()["id"]
                for _ in range(300):
                    current = client.get(f"/api/v1/runs/{run_id}").json()
                    if current["status"] == "completed":
                        break
                    time.sleep(0.02)
                self.assertEqual(current["status"], "completed")
                self.assertEqual(current["outcome"], "checks_passed")
                self.assertEqual(client.get(f"/api/v1/runs/{run_id}/events").status_code, 200)
                self.assertEqual(client.get(f"/api/v1/runs/{run_id}/artifacts").json()[0]["name"], "manifest.json")
        finally:
            app.state.jobs.shutdown()


if __name__ == "__main__":
    unittest.main()
