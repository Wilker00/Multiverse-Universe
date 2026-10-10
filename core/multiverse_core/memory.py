"""Memory DNA lifecycle:  candidate -> verified -> promoted   (or rejected / demoted)

  extract   only from runs that passed held-out verification (verify before extract)
  validate  re-run INDEPENDENT tasks that share a tag, baseline vs with-lesson, same budget.
            Promote only if it helps and breaks nothing. A stored note is not learning.
  promote   a policy (auto) or a human. Consequential changes need a person.
  retrieve  selective: tag overlap x confidence, capped by count and tokens.
"""
from .agents import DEFAULT_ORDER

TOKEN_CAP = 120


class MemoryBroker:
    def __init__(self, store, scope="repo:demo"):
        self.store, self.scope = store, scope

    def extract(self, run, task):
        """Return a new candidate id, or None. Unverified runs never produce memory."""
        if not run["verified"] or not run.get("winning_op"):
            return None
        for m in self.store.memories():
            if m["op"] == run["winning_op"] and set(m["tags"]) == set(task.tags) and m["status"] != "rejected":
                return None  # duplicate lesson
        text = f"On {task.family} bugs in this repo, try the '{run['winning_op']}' change first."
        return self.store.add_memory({"scope": self.scope, "tags": task.tags, "text": text, "op": run["winning_op"], "source_run": run["id"], "source_task": task.id})

    def validate(self, mid, train_tasks, runner, budget):
        """Independent validation: other train tasks sharing a tag, never the source task."""
        m = self.store.memory(mid)
        pool = [t for t in train_tasks if t.id != m["source_task"] and set(t.tags) & set(m["tags"])]
        lesson = [{"id": mid, "op": m["op"], "text": m["text"]}]
        gains = regress = 0
        rows = []
        for t in pool:
            b = runner.run(t, "validate-baseline", budget)
            w = runner.run(t, "validate-with-lesson", budget, lesson)
            gains += (not b["verified"]) and w["verified"]
            regress += b["verified"] and (not w["verified"])
            rows.append({"task": t.id, "baseline": b["verified"], "with_lesson": w["verified"]})
        ev = {"validation_tasks": rows, "gains": int(gains), "regressions": int(regress)}
        if not pool:
            self.store.set_status(mid, "rejected", "verifier", "no independent task to validate on", ev)
        elif gains > 0 and regress == 0:
            self.store.set_status(mid, "verified", "verifier", f"helped on {gains} independent task(s), broke none", ev)
        else:
            self.store.set_status(mid, "rejected", "verifier", "no measurable gain on independent tasks", ev)
        return self.store.memory(mid)["status"]

    def promote(self, mid, actor):
        m = self.store.memory(mid)
        if m["status"] != "verified":
            raise ValueError(f"only verified memory can be promoted (status is {m['status']})")
        self.store.set_status(mid, "promoted", actor, "approved for retrieval")

    def demote(self, mid, reason, actor="system"):
        self.store.set_status(mid, "demoted", actor, reason)

    def retrieve(self, task, k=3):
        import time
        now, out, used = time.time(), [], 0
        scored = []
        for m in self.store.memories("promoted"):
            if m["scope"] != self.scope or m["expires"] < now: continue
            overlap = len(set(m["tags"]) & set(task.tags))
            if overlap: scored.append((overlap * m["confidence"], m))
        for _, m in sorted(scored, key=lambda x: -x[0])[:k]:
            cost = len(m["text"]) // 4 + 1
            if used + cost > TOKEN_CAP: break
            used += cost
            out.append({"id": m["id"], "op": m["op"], "text": m["text"], "tags": m["tags"]})
        return out
