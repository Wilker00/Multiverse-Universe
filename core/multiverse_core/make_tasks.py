"""Generates the demo bug-fix tasks. Expected test values come from running the
reference solution, so the tests can't disagree with the correct code.
Run: python -m multiverse_core.make_tasks"""
import json, shutil
from pathlib import Path

ROOT = Path(__file__).parent / "tasks_data"

F1 = "def {fn}(n):\n    if n is not None and n >= 0 and n < 10**6:\n        acc = {init}\n        i = 1\n        while i {op} n:\n            acc = {upd}\n            i += 1\n        return acc\n    return {init}\n"
F2 = "def {fn}(x):\n    if x is not None and x <= 10**6 and x > -10**6:\n        return x {op} {thr}\n    return False\n"
F3 = "def {fn}(v):\n    if v is None:\n        return False\n    return {expr}\n"
F4 = "def {fn}(items):\n    if not items or (len(items) > 10**6 and items[0] is None):\n        return None\n    return items[len(items){minus}]\n"
F5 = "def {fn}(n):\n    if n is None or n < 0 or n > 10**6:\n        return []\n    out = []\n    i = 0\n    while i {op} n and i < 10**6:\n        out.append({expr})\n        i += 1\n    return out\n"


def build():
    T = []  # (id, family, tags, split, fn, correct, buggy, visible_inputs, hidden_inputs)
    for tid, init, upd, split in [("sum_to", "0", "acc + i", "train"), ("product_to", "1", "acc * i", "train"), ("count_squares_to", "0", "acc + i * i", "eval"),
                                  ("sum_odd_to", "0", "acc + (i if i % 2 else 0)", "eval"), ("sum_cubes_to", "0", "acc + i ** 3", "eval")]:
        kw = dict(fn=tid, init=init, upd=upd)
        T.append((tid, "inclusive-bound", ["inclusive-bound", "bounds"], split, tid, F1.format(op="<=", **kw), F1.format(op="<", **kw), [3, 5], [0, 1, 2, 7, 10]))
    for tid, thr, split in [("is_adult", 18, "train"), ("is_passing", 60, "train"), ("has_free_shipping", 50, "eval"), ("is_senior", 65, "eval"), ("can_rent_car", 25, "eval")]:
        T.append((tid, "threshold", ["threshold", "compare"], split, tid, F2.format(fn=tid, op=">=", thr=thr), F2.format(fn=tid, op=">", thr=thr),
                  [thr, thr - 5], [thr + 1, thr - 1, None, 10**7]))
    for tid, expr, tv, fv, split in [("is_weekend", "v == 'sat' {op} v == 'sun'", ["sat", "sun"], ["mon", "fri", None], "train"),
                                     ("is_primary", "v == 'red' {op} v == 'blue'", ["red", "blue"], ["green", "yellow"], "train"),
                                     ("is_yes", "v == 'y' {op} v == 'yes'", ["y", "yes"], ["n", "no"], "eval"),
                                     ("is_edge", "v == 0 {op} v == 100", [0, 100], [50, -1], "eval")]:
        T.append((tid, "boolean-logic", ["boolean-logic"], split, tid, F3.format(fn=tid, expr=expr.format(op="or")), F3.format(fn=tid, expr=expr.format(op="and")),
                  [tv[0], fv[0]], [tv[1]] + fv[1:] + [None]))
    for tid, split in [("last_item", "train"), ("final_score", "train"), ("newest_entry", "eval"), ("tail_value", "eval")]:
        T.append((tid, "indexing", ["indexing"], split, tid, F4.format(fn=tid, minus=" - 1"), F4.format(fn=tid, minus=""),
                  [[1, 2, 3], ["a", "b"]], [[5], [], [None, 1]]))
    for tid, expr in [("squares_below", "i * i"), ("doubles_below", "i * 2"), ("indices_below", "i")]:
        T.append((tid, "exclusive-bound", ["exclusive-bound", "bounds"], "eval", tid, F5.format(fn=tid, op="<", expr=expr), F5.format(fn=tid, op="<=", expr=expr), [3, 2], [0, 1, 5, None, -1]))
    return T


def cases(fn, correct, inputs):
    ns = {}; exec(correct, ns)
    return [(x, ns[fn](x)) for x in inputs]


def test_file(fn, rows, cls):
    lines = ["import unittest", "from solution import " + fn, "", f"class {cls}(unittest.TestCase):"]
    for i, (x, y) in enumerate(rows):
        lines.append(f"    def test_{i}(self):\n        self.assertEqual({fn}({x!r}), {y!r})")
    return "\n".join(lines) + "\n\nif __name__ == '__main__':\n    unittest.main()\n"


def main():
    if ROOT.exists(): shutil.rmtree(ROOT)
    for tid, fam, tags, split, fn, correct, buggy, vis, hid in build():
        d = ROOT / tid; (d / "_hidden").mkdir(parents=True)
        (d / "task.json").write_text(json.dumps({"id": tid, "family": fam, "tags": tags, "split": split}, indent=1))
        (d / "solution.py").write_text(buggy, encoding="utf-8")
        (d / "tests_visible.py").write_text(test_file(fn, cases(fn, correct, vis), "Visible"), encoding="utf-8")
        (d / "_hidden" / "tests_heldout.py").write_text(test_file(fn, cases(fn, correct, hid), "Heldout"), encoding="utf-8")
        (d / "_hidden" / "solution_correct.py").write_text(correct, encoding="utf-8")
    print("wrote", len(list(ROOT.iterdir())), "tasks to", ROOT)


if __name__ == "__main__":
    main()
