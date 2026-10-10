import sqlite3, time, unittest
from dataclasses import FrozenInstanceError
from multiverse_core.store import Store
from multiverse_core.tasks import load_tasks
from multiverse_core.verifier import verify, visible_check, visible_check_source
from multiverse_core.agents import AgentResult, PatternAgent
from multiverse_core.runner import Runner
from multiverse_core.memory import MemoryBroker
from multiverse_core.sandbox import SandboxUnavailable
from multiverse_core import evaluator

TASKS = {t.id: t for t in load_tasks()}


class Core(unittest.TestCase):
    def setUp(self):
        self.store = Store(); self.runner = Runner(self.store, PatternAgent()); self.broker = MemoryBroker(self.store)

    def test_trace_is_append_only(self):
        self.store.event("r", "x", {"a": 1})
        with self.assertRaises(sqlite3.DatabaseError): self.store._q("UPDATE events SET kind='y'")
        with self.assertRaises(sqlite3.DatabaseError): self.store._q("DELETE FROM events")

    def test_memory_log_is_append_only(self):
        mid = self.store.add_memory({"scope": "s", "tags": ["a"], "text": "t", "op": "o", "source_run": "r", "source_task": "t"})
        with self.assertRaises(sqlite3.DatabaseError): self.store._q("DELETE FROM memory_log")
        self.store.set_status(mid, "rejected", "me", "why")
        self.assertEqual([x["to_status"] for x in self.store.memory_log(mid)], ["candidate", "rejected"])

    def test_buggy_fails_and_reference_passes(self):
        for t in TASKS.values():
            self.assertFalse(verify(t, t.source)["verified"], t.id)
            self.assertTrue(verify(t, t.reference)["verified"], t.id)

    def test_visible_pass_is_not_verification(self):
        """A patch can pass every visible test and still be wrong. Only held-out tests catch it."""
        t = TASKS["is_adult"]
        wrong = t.reference.replace("x >= 18", "x == 18")      # visible tests only check 18 and 13
        self.assertTrue(visible_check(t, wrong)["ok"])
        v = verify(t, wrong)
        self.assertTrue(v["visible"] and not v["verified"])

    def test_hidden_tests_never_shown_to_agent(self):
        t = TASKS["sum_to"]
        self.assertNotIn("Heldout", t.visible_tests)
        self.assertNotIn("_hidden", t.source)

    def test_unverified_run_creates_no_memory(self):
        r = self.runner.run(TASKS["sum_to"], "learn", 1)  # budget too small to fix
        self.assertFalse(r["verified"])
        self.assertIsNone(self.broker.extract(r, TASKS["sum_to"]))

    def test_candidate_needs_independent_gain_to_be_promoted(self):
        train = load_tasks("train")
        evaluator.learn(self.runner, self.broker, train, 8, 3)
        by_op = {}
        for m in self.store.memories(): by_op.setdefault(m["op"], []).append(m["status"])
        self.assertIn("promoted", by_op["lt_to_le"]); self.assertIn("promoted", by_op["gt_to_ge"])
        self.assertEqual(set(by_op["and_to_or"]), {"rejected"})   # useless lesson is not promoted
        self.assertEqual(set(by_op["len_minus1"]), {"rejected"})

    def test_cannot_promote_unverified(self):
        mid = self.store.add_memory({"scope": "repo:demo", "tags": ["a"], "text": "t", "op": "o", "source_run": "r", "source_task": "t"})
        with self.assertRaises(ValueError): self.broker.promote(mid, "human")

    def test_store_rejects_lifecycle_bypass(self):
        mid = self.store.add_memory({"scope": "repo:demo", "tags": ["a"], "text": "t", "op": "o", "source_run": "r", "source_task": "t"})
        with self.assertRaises(ValueError): self.store.set_status(mid, "promoted", "bypass", "skip verification")

    def test_agent_receives_public_task_view_only(self):
        task = TASKS["sum_to"]
        view = task.agent_view()
        self.assertFalse(hasattr(view, "hidden_tests"))
        self.assertFalse(hasattr(view, "reference"))
        self.assertFalse(hasattr(view, "dir"))
        with self.assertRaises(FrozenInstanceError): view.source = "changed"

    def test_local_runner_rejects_untrusted_fixtures(self):
        with self.assertRaises(SandboxUnavailable):
            visible_check_source("def x(): pass", "import unittest", trusted_fixture=False)

    def test_agent_cannot_overrun_attempt_budget(self):
        class OverBudgetAgent:
            name = "over-budget"
            synthetic = True

            def solve(self, task, lessons, budget, check):
                attempt = {"op": "invented", "site": "-", "visible_pass": True, "source": task.source}
                return AgentResult(task.source, attempts=[attempt, attempt])

        run = Runner(Store(), OverBudgetAgent()).run(TASKS["sum_to"], "test", 1)
        self.assertEqual(run["status"], "budget_exceeded")
        self.assertFalse(run["verified"])

    def test_validation_never_uses_source_task(self):
        train = load_tasks("train")
        r = self.runner.run(TASKS["sum_to"], "learn", 8)
        mid = self.broker.extract(r, TASKS["sum_to"])
        self.broker.validate(mid, train, self.runner, 3)
        used = {x["task"] for x in self.store.memory(mid)["evidence"]["validation_tasks"]}
        self.assertNotIn("sum_to", used)

    def test_train_eval_overlap_is_refused(self):
        train = load_tasks("train")
        with self.assertRaises(ValueError): evaluator.experiment(self.runner, self.broker, train, train[:2])

    def test_dataset_fingerprint_and_arm_order_are_reproducible(self):
        tasks = load_tasks("eval")
        self.assertEqual(evaluator.dataset_digest(tasks), evaluator.dataset_digest(list(reversed(tasks))))
        self.assertNotEqual(evaluator.dataset_digest(tasks), evaluator.dataset_digest(tasks[:-1]))

        class FakeRunner:
            def run(self, task, arm, budget, lessons=()):
                return {"verified": False, "tokens_in": 0, "tokens_out": 0, "attempts": 0, "duration_ms": 0}

        class FakeBroker:
            def retrieve(self, task):
                return []

        first = evaluator.evaluate(FakeRunner(), FakeBroker(), tasks, 1)
        second = evaluator.evaluate(FakeRunner(), FakeBroker(), tasks, 1)
        self.assertEqual([row["arm_order"] for row in first], [row["arm_order"] for row in second])
        self.assertEqual({tuple(row["arm_order"]) for row in first}, {("baseline", "treatment"), ("treatment", "baseline")})

    def test_experiment_is_reproducible_and_reports_regressions(self):
        a = evaluator.experiment(self.runner, self.broker, load_tasks("train"), load_tasks("eval"), policy="auto")
        s2 = Store(); b = evaluator.experiment(Runner(s2, PatternAgent()), MemoryBroker(s2), load_tasks("train"), load_tasks("eval"), policy="auto")
        key = lambda r: (r["baseline"]["passed"], r["treatment"]["passed"], r["paired"])
        self.assertEqual(key(a), key(b))
        self.assertEqual(a["leakage"], [])
        self.assertEqual(a["paired"]["only_baseline"], 3)          # exclusive-bound family is misled by the 'bounds' tag
        self.assertTrue(any("Negative transfer" in n for n in a["notes"]))

    def test_retrieval_is_budgeted(self):
        evaluator.learn(self.runner, self.broker, load_tasks("train"), 8, 3)
        self.assertLessEqual(len(self.broker.retrieve(TASKS["squares_below"], k=3)), 3)
        self.assertEqual(self.broker.retrieve(TASKS["is_weekend"]), [])  # no promoted lesson matches


class Api(unittest.TestCase):
    def test_health_human_gate_and_async_jobs(self):
        from fastapi.testclient import TestClient
        from multiverse_core.api import create_app
        app = create_app()
        try:
            with TestClient(app) as client:
                self.assertEqual(client.get("/api/health").json()["product"], "multiverse-core")
                self.assertEqual(len(client.get("/api/tasks").json()), len(TASKS))
                self.assertIn("Multiverse Studio", client.get("/").text)

                mid = app.state.store.add_memory({"scope": "repo:demo", "tags": ["a"], "text": "t", "op": "o", "source_run": "r", "source_task": "t"})
                self.assertEqual(client.post(f"/api/memory/{mid}/approve").status_code, 409)
                app.state.store.set_status(mid, "verified", "verifier", "independent gain", {"gains": 1, "regressions": 0})
                self.assertEqual(client.post(f"/api/memory/{mid}/approve").json()["status"], "promoted")

                job = app.state.jobs.submit("test", lambda: {"answer": 42})
                for _ in range(100):
                    current = client.get(f"/api/jobs/{job['id']}").json()
                    if current["status"] == "completed":
                        break
                    time.sleep(.01)
                self.assertEqual(current["result"], {"answer": 42})
        finally:
            app.state.jobs.shutdown()


if __name__ == "__main__":
    unittest.main()
