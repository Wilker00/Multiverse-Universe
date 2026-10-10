"""Run test files in a scrubbed subprocess with a timeout.

This local runner is permitted only for the bundled, reviewed fixture corpus.
External or model-provided repository tasks require a container sandbox with
network disabled and explicit filesystem, CPU, memory, process, and time limits.
"""
import os, subprocess, sys

KEEP = ("SYSTEMROOT", "PATH", "TEMP", "TMP", "TMPDIR")


class SandboxUnavailable(RuntimeError):
    pass


def run_unittest(workdir, module, timeout=10, trusted_fixture=False):
    if not trusted_fixture:
        raise SandboxUnavailable("external tasks require an isolated container sandbox")
    env = {k: v for k, v in os.environ.items() if k in KEEP}
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    env["HOME"] = workdir
    env["USERPROFILE"] = workdir
    try:
        p = subprocess.run([sys.executable, "-m", "unittest", module, "-q"], cwd=workdir, env=env, capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        return {"ok": False, "timeout": True, "out": "timed out"}
    return {"ok": p.returncode == 0, "timeout": False, "out": (p.stderr + p.stdout)[-1500:]}
