"""Executes one bounded attempt at a task and records the whole thing in the trace."""
import hashlib, json, time, uuid
from .contracts import BudgetExceeded, RunBudget
from .verifier import verify, visible_check_source


class Runner:
    def __init__(self, store, agent):
        self.store, self.agent = store, agent

    def run(self, task, arm, budget, lessons=()):
        run_budget = RunBudget.coerce(budget)
        rid = "run_" + uuid.uuid4().hex
        started, started_mono = time.time(), time.monotonic()
        S = self.store
        memory_ids = [lesson["id"] for lesson in lessons]
        config = {"task_id": task.id, "agent": self.agent.name, "arm": arm, "budget": run_budget.as_dict(), "memory_ids": memory_ids}
        config_digest = hashlib.sha256(json.dumps(config, sort_keys=True).encode()).hexdigest()
        S.event(rid, "task", {"task_id": task.id, "family": task.family, "tags": task.tags, "arm": arm, "budget": run_budget.as_dict(), "config_digest": config_digest})
        S.event(rid, "memory_retrieved", {"ids": memory_ids, "tokens": sum(len(l["text"]) // 4 + 1 for l in lessons)})
        checks = 0

        def checked(source):
            nonlocal checks
            if time.monotonic() - started_mono > run_budget.max_seconds:
                raise BudgetExceeded("run time budget exceeded")
            if checks >= run_budget.attempts + 1:
                raise BudgetExceeded("visible-check budget exceeded")
            if len(source.encode("utf-8")) > run_budget.max_source_bytes:
                raise BudgetExceeded("source-size budget exceeded")
            checks += 1
            return visible_check_source(source, task.visible_tests, task.trusted_fixture)

        try:
            res = self.agent.solve(task.agent_view(), list(lessons), run_budget.attempts, checked)
        except Exception as error:
            completed = time.time()
            S.event(rid, "run_error", {"type": type(error).__name__, "message": str(error)})
            rec = {"id": rid, "task_id": task.id, "agent": self.agent.name, "arm": arm, "started": started, "completed": completed,
                   "duration_ms": int((completed - started) * 1000), "verified": False, "visible_pass": False, "attempts": max(0, checks - 1),
                   "tokens_in": 0, "tokens_out": 0, "memory_ids": memory_ids, "budget": run_budget.attempts, "status": "failed",
                   "error": f"{type(error).__name__}: {error}", "config_digest": config_digest, "winning_op": None}
            S.save_run(rec)
            return rec

        for i, a in enumerate(res.attempts):  # each attempt is a branch ("verse") with its own evidence
            S.event(rid, "attempt", {"n": i + 1, "op": a["op"], "site": a["site"], "visible_pass": a["visible_pass"]})
        budget_error = None
        if len(res.attempts) > run_budget.attempts:
            budget_error = "agent exceeded attempt budget"
        elif res.tokens_in > run_budget.max_input_tokens or res.tokens_out > run_budget.max_output_tokens:
            budget_error = "agent exceeded token budget"
        elif time.monotonic() - started_mono > run_budget.max_seconds:
            budget_error = "agent exceeded time budget"
        v = {"visible": False, "heldout": None, "verified": False, "out": budget_error} if budget_error else verify(task, res.source)
        S.event(rid, "verify", {"visible": v["visible"], "heldout": v["heldout"], "verified": v["verified"]})
        completed = time.time()
        used = next((a for a in res.attempts if a["visible_pass"]), None)
        rec = {"id": rid, "task_id": task.id, "agent": self.agent.name, "arm": arm, "started": started, "verified": v["verified"],
               "visible_pass": v["visible"], "attempts": len(res.attempts), "tokens_in": res.tokens_in, "tokens_out": res.tokens_out,
               "memory_ids": memory_ids, "budget": run_budget.attempts, "completed": completed, "duration_ms": int((completed - started) * 1000),
               "status": "budget_exceeded" if budget_error else "completed", "error": budget_error, "config_digest": config_digest,
               "winning_op": used["op"] if used else None}
        S.save_run(rec)
        return rec
