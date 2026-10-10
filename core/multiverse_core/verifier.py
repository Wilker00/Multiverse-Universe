"""Deterministic verification: visible tests first, then held-out tests.
A run is verified only if both pass. Neither agent opinion nor agreement counts."""
import tempfile
from pathlib import Path
from .sandbox import run_unittest


def _prepare(d, source, visible_tests):
    Path(d, "solution.py").write_text(source, encoding="utf-8")
    Path(d, "tests_visible.py").write_text(visible_tests, encoding="utf-8")


def visible_check_source(source, visible_tests, trusted_fixture=False, timeout=10):
    with tempfile.TemporaryDirectory() as d:
        _prepare(d, source, visible_tests)
        return run_unittest(d, "tests_visible", timeout, trusted_fixture=trusted_fixture)


def visible_check(task, source, timeout=10):
    return visible_check_source(source, task.visible_tests, task.trusted_fixture, timeout)


def verify(task, source, timeout=10):
    with tempfile.TemporaryDirectory() as d:
        _prepare(d, source, task.visible_tests)
        vis = run_unittest(d, "tests_visible", timeout, trusted_fixture=task.trusted_fixture)
        if not vis["ok"]:
            return {"visible": False, "heldout": None, "verified": False, "out": vis["out"]}
        Path(d, "tests_heldout.py").write_text(task.hidden_tests, encoding="utf-8")
        held = run_unittest(d, "tests_heldout", timeout, trusted_fixture=task.trusted_fixture)
        return {"visible": True, "heldout": held["ok"], "verified": held["ok"], "out": held["out"]}
