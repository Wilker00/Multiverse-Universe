"""One reproducible experiment:
  1. learn   run train tasks, extract candidates from VERIFIED runs, validate on other train tasks, promote
  2. eval    run held-out tasks twice with identical budgets: stateless baseline vs memory-treated
  3. report  held-out pass rate, cost per verified task, paired wins/losses, exact sign test, leakage check
Cost is token-based. With the synthetic agent it is simulated, not billed."""
import hashlib
import json
from math import comb

PRICE_IN, PRICE_OUT = 0.003 / 1000, 0.015 / 1000


def cost(r): return r["tokens_in"] * PRICE_IN + r["tokens_out"] * PRICE_OUT


def sign_test(wins, losses):
    n = wins + losses
    if n == 0: return 1.0
    k = min(wins, losses)
    return min(1.0, 2 * sum(comb(n, i) for i in range(k + 1)) / 2 ** n)


def dataset_digest(tasks):
    records = [{
        "id": task.id,
        "family": task.family,
        "tags": list(task.tags),
        "split": task.split,
        "source": task.source,
        "visible_tests": task.visible_tests,
        "hidden_tests": task.hidden_tests,
        "reference": task.reference,
    } for task in sorted(tasks, key=lambda item: item.id)]
    payload = json.dumps(records, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(payload).hexdigest()


def learn(runner, broker, train, budget_learn, budget_validate, policy="auto"):
    if policy not in {"manual", "auto"}:
        raise ValueError(f"unknown promotion policy: {policy}")
    for t in train:
        r = runner.run(t, "learn", budget_learn)
        mid = broker.extract(r, t)
        if mid:
            st = broker.validate(mid, train, runner, budget_validate)
            if st == "verified" and policy == "auto": broker.promote(mid, "policy:auto")
    return broker.store.memories()


def evaluate(runner, broker, eval_tasks, budget):
    rows = []
    for t in eval_tasks:
        lessons = broker.retrieve(t)
        treatment_first = int(hashlib.sha256(t.id.encode()).hexdigest(), 16) % 2 == 0
        if treatment_first:
            w = runner.run(t, "treatment", budget, lessons)
            b = runner.run(t, "baseline", budget)
            order = ["treatment", "baseline"]
        else:
            b = runner.run(t, "baseline", budget)
            w = runner.run(t, "treatment", budget, lessons)
            order = ["baseline", "treatment"]
        rows.append({"task": t.id, "family": t.family, "baseline": b, "treatment": w, "lessons": lessons, "arm_order": order})
    return rows


def report(rows, store, train, eval_tasks, budget, synthetic):
    n = len(rows)
    arm = lambda k: {"passed": sum(r[k]["verified"] for r in rows), "tokens_in": sum(r[k]["tokens_in"] for r in rows), "tokens_out": sum(r[k]["tokens_out"] for r in rows),
                     "attempts": sum(r[k]["attempts"] for r in rows), "duration_ms": sum(r[k].get("duration_ms", 0) for r in rows),
                     "cost": sum(cost(r[k]) for r in rows)}
    b, w = arm("baseline"), arm("treatment")
    for a in (b, w): a["cost_per_verified"] = a["cost"] / a["passed"] if a["passed"] else None
    only_t = [r for r in rows if r["treatment"]["verified"] and not r["baseline"]["verified"]]
    only_b = [r for r in rows if r["baseline"]["verified"] and not r["treatment"]["verified"]]
    both = sum(r["baseline"]["verified"] and r["treatment"]["verified"] for r in rows)
    promoted = store.memories("promoted")
    leak = {t.id for t in eval_tasks} & ({m["source_task"] for m in store.memories()} | {t.id for t in train})
    notes = []
    if synthetic: notes.append("The agent is a deterministic stand-in. These numbers test the harness, not LLM behavior.")
    if len(only_t) + len(only_b) < 10: notes.append("Fewer than 10 discordant tasks: too few to conclude anything.")
    if only_b: notes.append(f"Negative transfer on {len(only_b)} task(s): memory made the agent worse. Narrow the lesson's scope or demote it.")
    return {"n_eval": n, "budget": budget, "baseline": b, "treatment": w,
            "dataset": {"train_digest": dataset_digest(train), "eval_digest": dataset_digest(eval_tasks)},
            "paired": {"both": both, "only_treatment": len(only_t), "only_baseline": len(only_b), "neither": n - both - len(only_t) - len(only_b)},
            "sign_test_p": sign_test(len(only_t), len(only_b)), "leakage": sorted(leak),
            "regressions": [{"task": r["task"], "family": r["family"], "memory_used": [l["id"] for l in r["lessons"]], "ops": [l["op"] for l in r["lessons"]]} for r in only_b],
            "memory": [{"id": m["id"], "status": m["status"], "op": m["op"], "tags": m["tags"], "source_task": m["source_task"], "evidence": m["evidence"]} for m in store.memories()],
            "per_task": [{"task": r["task"], "family": r["family"], "baseline": r["baseline"]["verified"], "treatment": r["treatment"]["verified"],
                          "baseline_attempts": r["baseline"]["attempts"], "treatment_attempts": r["treatment"]["attempts"],
                          "arm_order": r["arm_order"]} for r in rows],
            "simulated": synthetic, "notes": notes, "promoted": len(promoted)}


def experiment(runner, broker, train, eval_tasks, budget_learn=8, budget_eval=3, policy="manual"):
    ids_t, ids_e = {t.id for t in train}, {t.id for t in eval_tasks}
    if ids_t & ids_e: raise ValueError(f"train and eval tasks overlap: {sorted(ids_t & ids_e)}")
    learn(runner, broker, train, budget_learn, budget_eval, policy)
    rows = evaluate(runner, broker, eval_tasks, budget_eval)
    return report(rows, broker.store, train, eval_tasks, budget_eval, getattr(runner.agent, "synthetic", False))


def markdown(rep):
    b, w, p = rep["baseline"], rep["treatment"], rep["paired"]
    f = lambda x: "n/a" if x is None else f"${x:.5f}"
    L = [f"# Held-out evaluation ({rep['n_eval']} tasks, budget {rep['budget']} attempts each)", ""]
    L += ["| arm | verified | cost per verified task | tokens in/out |", "|---|---|---|---|",
          f"| baseline (stateless) | {b['passed']}/{rep['n_eval']} | {f(b['cost_per_verified'])} | {b['tokens_in']}/{b['tokens_out']} |",
          f"| treatment (verified memory) | {w['passed']}/{rep['n_eval']} | {f(w['cost_per_verified'])} | {w['tokens_in']}/{w['tokens_out']} |", "",
          f"Paired: both {p['both']}, only treatment {p['only_treatment']}, only baseline {p['only_baseline']}, neither {p['neither']}. Exact sign test p = {rep['sign_test_p']:.3f}.", "",
          "## Memory DNA"]
    L += [f"- `{m['id']}` {m['status']}: {m['op']} on {', '.join(m['tags'])} (from {m['source_task']})" for m in rep["memory"]]
    if rep["regressions"]:
        L += ["", "## Regressions"] + [f"- {r['task']} ({r['family']}): retrieved {', '.join(r['ops'])}" for r in rep["regressions"]]
    if rep["notes"]: L += ["", "## Read this first"] + [f"- {n}" for n in rep["notes"]]
    return "\n".join(L)
