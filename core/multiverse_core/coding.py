"""Bounded repository coding runtime for OpenShell and Nebius Token Factory."""

from __future__ import annotations

import base64
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shlex
import shutil
import subprocess
import time

from .token_factory import TokenFactoryClient, TokenFactoryInfrastructureError


class InfrastructureError(RuntimeError):
    pass


class ToolError(RuntimeError):
    pass


ALLOWED_FALLBACK_STATUSES = {
    "success", "agent_failure", "process_failure", "timeout", "turn_limit",
    "cancelled", "output_limit",
}


def model_for_attempt(attempt, models):
    if attempt <= 2:
        return "lightning", models["lightning"]
    if attempt <= 4:
        return "super", models["super"]
    return "ultra", models["ultra"]


def _safe_relative_path(value):
    path = PurePosixPath(value)
    if path.is_absolute() or ".." in path.parts or not path.parts:
        raise ToolError("path must stay inside the repository")
    return str(path)


class OpenShellSandbox:
    """CLI-backed OpenShell sandbox with no implicit local execution fallback."""

    def __init__(self, run_id, worktree, plan):
        self.name = ("mv-" + run_id.replace("_", "-")[-36:]).lower()
        self.worktree = Path(worktree)
        self.plan = plan
        self.created = False
        self.timeout = int(plan["limits"].get("clone_seconds", 90))

    def __enter__(self):
        if not shutil.which("openshell"):
            raise InfrastructureError("OpenShell CLI is not installed")
        image = self.plan["image"]
        if "@sha256:" not in image:
            raise InfrastructureError("MULTIVERSE_RUNNER_IMAGE must be pinned by sha256 digest")
        stack_key = self.plan["stack"].upper()
        setup_policy = os.environ.get(f"MULTIVERSE_OPENSHELL_SETUP_POLICY_{stack_key}")
        run_policy = os.environ.get("MULTIVERSE_OPENSHELL_RUN_POLICY")
        if not setup_policy or not run_policy:
            raise InfrastructureError(f"OpenShell {self.plan['stack']} setup and run policy paths are required")
        command = [
            "openshell", "sandbox", "create", "--name", self.name, "--from", image,
            "--policy", setup_policy, "--upload", f"{self.worktree}:/sandbox/repo",
            "--no-git-ignore", "--detach",
        ]
        self._host(command, timeout=180)
        self.created = True
        for install in self.plan["install_commands"]:
            result = self.exec(list(install), timeout=300)
            if result["returncode"]:
                raise ToolError(f"dependency setup failed: {result['output']}")
        self._host(["openshell", "policy", "set", self.name, "--policy", run_policy, "--wait"], timeout=120)
        return self

    def __exit__(self, exc_type, exc, traceback):
        if self.created:
            subprocess.run(
                ["openshell", "sandbox", "delete", self.name],
                capture_output=True, text=True, timeout=60, check=False,
            )

    def _host(self, command, timeout, require_success=True):
        try:
            result = subprocess.run(command, capture_output=True, text=True, timeout=timeout)
        except (OSError, subprocess.TimeoutExpired) as error:
            raise InfrastructureError(f"OpenShell command failed: {type(error).__name__}") from error
        if require_success and result.returncode:
            raise InfrastructureError((result.stderr or result.stdout)[-1000:])
        return result

    def exec(self, command, timeout=60):
        result = self._host([
            "openshell", "sandbox", "exec", "-n", self.name,
            "--workdir", "/sandbox/repo", "--timeout", str(timeout), "--no-tty", "--", *command,
        ], timeout=timeout + 15, require_success=False)
        output = (result.stdout + result.stderr)[-20_000:]
        return {"returncode": result.returncode, "output": output}

    def list_files(self):
        return self.exec(["git", "ls-files"], 30)

    def read_file(self, path):
        path = _safe_relative_path(path)
        return self.exec(["python", "-c", "from pathlib import Path; print(Path(__import__('sys').argv[1]).read_text(errors='replace')[:20000])", path], 30)

    def search(self, query, path="."):
        path = _safe_relative_path(path) if path != "." else "."
        return self.exec(["rg", "--line-number", "--max-count", "200", "--", query, path], 30)

    def apply_patch(self, patch):
        if len(patch.encode("utf-8")) > 512_000:
            raise ToolError("patch exceeds 512 KiB")
        encoded = base64.b64encode(patch.encode("utf-8")).decode("ascii")
        script = "import base64,pathlib,sys; pathlib.Path('/tmp/mv.patch').write_bytes(base64.b64decode(sys.argv[1]))"
        written = self.exec(["python", "-c", script, encoded], 30)
        if written["returncode"]:
            return written
        return self.exec(["git", "apply", "--whitespace=nowarn", "/tmp/mv.patch"], 60)

    def run_checks(self):
        reports = []
        ok = True
        for command in self.plan["check_commands"]:
            result = self.exec(list(command), 300)
            reports.append({"command": list(command), **result})
            ok = ok and result["returncode"] == 0
        return {"ok": ok, "commands": reports}

    def diff(self):
        return self.exec(["git", "diff", "--binary", "--no-ext-diff"], 60)["output"]


TOOLS = [
    {"type": "function", "function": {"name": "list_files", "description": "List tracked repository files.", "parameters": {"type": "object", "properties": {}, "additionalProperties": False}}},
    {"type": "function", "function": {"name": "read_file", "description": "Read one text file inside the repository.", "parameters": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"], "additionalProperties": False}}},
    {"type": "function", "function": {"name": "search", "description": "Search repository text with a literal or regular-expression query.", "parameters": {"type": "object", "properties": {"query": {"type": "string"}, "path": {"type": "string"}}, "required": ["query"], "additionalProperties": False}}},
    {"type": "function", "function": {"name": "apply_patch", "description": "Apply a unified diff to the repository.", "parameters": {"type": "object", "properties": {"patch": {"type": "string"}}, "required": ["patch"], "additionalProperties": False}}},
    {"type": "function", "function": {"name": "run_checks", "description": "Run only the accepted repository checks.", "parameters": {"type": "object", "properties": {}, "additionalProperties": False}}},
    {"type": "function", "function": {"name": "inspect_diff", "description": "Inspect the current repository diff.", "parameters": {"type": "object", "properties": {}, "additionalProperties": False}}},
]


def _tool_result(sandbox, name, arguments):
    if name == "list_files":
        return sandbox.list_files()
    if name == "read_file":
        return sandbox.read_file(arguments["path"])
    if name == "search":
        return sandbox.search(arguments["query"], arguments.get("path", "."))
    if name == "apply_patch":
        return sandbox.apply_patch(arguments["patch"])
    if name == "run_checks":
        return sandbox.run_checks()
    if name == "inspect_diff":
        return {"diff": sandbox.diff()}
    raise ToolError(f"unsupported tool: {name}")


class NemoClawFallback:
    def available(self):
        if not (shutil.which("nemo-deepagents") and shutil.which("openshell") and os.environ.get("NEMOCLAW_SANDBOX_NAME")):
            return False
        version = subprocess.run(["nemo-deepagents", "--version"], capture_output=True, text=True, timeout=15)
        match = re.search(r"(\d+)\.(\d+)\.(\d+)", version.stdout + version.stderr)
        return version.returncode == 0 and bool(match) and tuple(map(int, match.groups())) >= (0, 0, 78)

    def run(self, run_id, task, inspection):
        if not self.available():
            raise InfrastructureError("NemoClaw fallback is not configured")
        name = os.environ["NEMOCLAW_SANDBOX_NAME"]
        remote = f"/sandbox/runs/{run_id}"
        status_process = subprocess.run(
            ["nemo-deepagents", "sandbox", "status", name, "--json"],
            capture_output=True, text=True, timeout=30,
        )
        try:
            status_evidence = json.loads(status_process.stdout) if status_process.returncode == 0 else {}
        except json.JSONDecodeError:
            status_evidence = {}
        upload = subprocess.run(
            ["openshell", "sandbox", "upload", name, inspection["worktree"], remote, "--no-git-ignore"],
            capture_output=True, text=True, timeout=180,
        )
        if upload.returncode:
            raise InfrastructureError((upload.stderr or upload.stdout)[-1000:])
        prompt = (
            f"Work only in {remote}. Implement this objective: {task['objective']}\n"
            "Edit files but do not execute shell commands. Return after the code change is complete."
        )
        process = subprocess.run(
            ["nemo-deepagents", name, "agent", "-n", prompt, "--json"],
            capture_output=True, text=True, timeout=int(task["budget"]["max_seconds"]),
        )
        try:
            envelope = json.loads(process.stdout)
        except json.JSONDecodeError as error:
            raise InfrastructureError("NemoClaw returned a malformed JSON envelope") from error
        schema = envelope.get("schemaVersion", envelope.get("schema_version"))
        status = envelope.get("status")
        if schema != 1 or status not in ALLOWED_FALLBACK_STATUSES:
            raise InfrastructureError("NemoClaw returned an unsupported envelope")
        reports = []
        passed = status == "success"
        for command in task["accepted_plan"]["check_commands"]:
            result = subprocess.run(
                ["nemo-deepagents", name, "exec", "--workdir", remote, "--timeout", "300", "--no-stdin", "--", *command],
                capture_output=True, text=True, timeout=315,
            )
            reports.append({"command": command, "returncode": result.returncode, "output": (result.stdout + result.stderr)[-20_000:]})
            passed = passed and result.returncode == 0
        diff_process = subprocess.run(
            ["nemo-deepagents", name, "exec", "--workdir", remote, "--timeout", "60", "--no-stdin", "--", "git", "diff", "--binary", "--no-ext-diff"],
            capture_output=True, text=True, timeout=75,
        )
        return {
            "outcome": "checks_passed" if passed else "failed",
            "patch": diff_process.stdout[-1_000_000:],
            "checks": {"ok": passed, "commands": reports},
            "usage": {"tokens_in": 0, "tokens_out": 0},
            "routing": [{"adapter": "nemoclaw", "status": status, "model": status_evidence.get("model")}],
            "composite": True,
            "comparable": False,
            "valid_attempt": True,
        }


class CodingRunService:
    def __init__(self, store, token_client=None, sandbox_factory=None, fallback=None):
        self.store = store
        self.token_client = token_client or TokenFactoryClient()
        self.sandbox_factory = sandbox_factory or OpenShellSandbox
        self.fallback = fallback or NemoClawFallback()

    def execute(self, run_id):
        run = self.store.coding_run(run_id)
        task = self.store.coding_task(run["task_id"])
        task["memory_mode"] = run["memory_mode"]
        inspection = self.store.inspection(task["inspection_id"])
        self.store.update_coding_run(run_id, "running", started=time.time())
        self.store.coding_event(run_id, "run_started", {"plan_digest": task["accepted_plan"]["digest"]})
        try:
            result = self._native(run_id, task, inspection)
        except (InfrastructureError, TokenFactoryInfrastructureError) as error:
            self.store.coding_event(run_id, "native_infrastructure_error", {"type": type(error).__name__, "message": str(error)})
            if run["adapter_policy"] != "auto":
                result = self._blocked(str(error))
            else:
                try:
                    result = self.fallback.run(run_id, task, inspection)
                    self.store.coding_event(run_id, "fallback_started", {"adapter": "nemoclaw", "reason": str(error)})
                except InfrastructureError as fallback_error:
                    result = self._blocked(f"native: {error}; fallback: {fallback_error}")
        except (ToolError, ValueError, KeyError, TypeError, json.JSONDecodeError) as error:
            self.store.coding_event(run_id, "run_error", {"type": type(error).__name__, "message": str(error)})
            result = {
                "outcome": "failed", "patch": "", "checks": {"ok": False, "commands": []},
                "usage": {"tokens_in": 0, "tokens_out": 0}, "routing": [], "composite": False,
                "comparable": True, "valid_attempt": True, "error": str(error),
            }
        return self._finish(run_id, task, inspection, result)

    def _native(self, run_id, task, inspection):
        models = {
            "lightning": os.environ.get("NEBIUS_MODEL_LIGHTNING"),
            "super": os.environ.get("NEBIUS_MODEL_SUPER"),
            "ultra": os.environ.get("NEBIUS_MODEL_ULTRA"),
        }
        if not all(models.values()):
            raise TokenFactoryInfrastructureError("all three NEBIUS_MODEL_* variables are required")
        self.token_client.validate_models(models)
        memory = []
        if task.get("memory_mode") == "reviewed":
            memory = [item["text"] for item in self.store.memories("promoted")][:5]
        system = (
            "You are a bounded coding agent. Work only through the supplied tools. "
            "Inspect before editing, make the smallest correct patch, and run approved checks. "
            "Never request credentials or network access."
        )
        user = f"Objective: {task['objective']}\nApproved checks: {task['accepted_plan']['check_commands']}"
        if memory:
            user += "\nReviewed memory:\n" + "\n".join(f"- {item}" for item in memory)
        messages = [{"role": "system", "content": system}, {"role": "user", "content": user}]
        routing = []
        tokens_in = tokens_out = 0
        valid_attempt = False
        budget_exceeded = False
        started_mono = time.monotonic()
        last_checks = {"ok": False, "commands": []}
        try:
            with self.sandbox_factory(run_id, inspection["worktree"], task["accepted_plan"]) as sandbox:
                for attempt in range(1, task["budget"]["max_attempts"] + 1):
                    if time.monotonic() - started_mono > task["budget"]["max_seconds"]:
                        budget_exceeded = True
                        break
                    tier, model = model_for_attempt(attempt, models)
                    reason = "initial" if attempt == 1 else ("retry_same_tier" if attempt in (2, 4) else "escalated_after_failure")
                    routing.append({"attempt": attempt, "tier": tier, "model": model, "reason": reason, "adapter": "native"})
                    self.store.coding_event(run_id, "model_routed", routing[-1])
                    response = self.token_client.chat(model, messages, TOOLS)
                    usage = response.get("usage", {})
                    tokens_in += int(usage.get("prompt_tokens", usage.get("input_tokens", 0)) or 0)
                    tokens_out += int(usage.get("completion_tokens", usage.get("output_tokens", 0)) or 0)
                    if tokens_in > task["budget"]["max_input_tokens"] or tokens_out > task["budget"]["max_output_tokens"]:
                        budget_exceeded = True
                        break
                    choices = response.get("choices") or []
                    if not choices:
                        raise TokenFactoryInfrastructureError("Token Factory returned no choices")
                    message = choices[0].get("message") or {}
                    calls = message.get("tool_calls") or []
                    messages.append({"role": "assistant", "content": message.get("content"), "tool_calls": calls})
                    if not calls:
                        messages.append({"role": "user", "content": "No tool was called. Inspect the repository and continue with a concrete change."})
                        continue
                    for call in calls[:24]:
                        function = call.get("function") or {}
                        try:
                            arguments = json.loads(function.get("arguments") or "{}")
                            result = _tool_result(sandbox, function.get("name"), arguments)
                            valid_attempt = True
                        except (KeyError, TypeError, json.JSONDecodeError, ToolError) as error:
                            result = {"error": str(error)}
                        self.store.coding_event(run_id, "tool_call", {
                            "attempt": attempt, "tool": function.get("name"), "ok": "error" not in result,
                        })
                        messages.append({"role": "tool", "tool_call_id": call.get("id", "unknown"), "content": json.dumps(result)[:20_000]})
                        if function.get("name") == "run_checks" and result.get("ok"):
                            last_checks = result
                            break
                    if not last_checks.get("ok"):
                        last_checks = sandbox.run_checks()
                        messages.append({"role": "user", "content": "Approved check result:\n" + json.dumps(last_checks)[:20_000]})
                    if last_checks.get("ok"):
                        break
                patch = sandbox.diff()
        except (InfrastructureError, TokenFactoryInfrastructureError):
            if valid_attempt:
                raise ToolError("infrastructure failed after a valid coding attempt; fallback is not permitted")
            raise
        return {
            "outcome": "budget_exceeded" if budget_exceeded else ("checks_passed" if last_checks.get("ok") else "failed"),
            "patch": patch,
            "checks": last_checks,
            "usage": {"tokens_in": tokens_in, "tokens_out": tokens_out},
            "routing": routing,
            "composite": False,
            "comparable": True,
            "valid_attempt": valid_attempt,
        }

    def _blocked(self, error):
        return {
            "outcome": "blocked", "patch": "", "checks": {"ok": False, "commands": []},
            "usage": {"tokens_in": 0, "tokens_out": 0}, "routing": [], "composite": False,
            "comparable": False, "valid_attempt": False, "error": error,
        }

    def _finish(self, run_id, task, inspection, result):
        completed = time.time()
        manifest = {
            "run_id": run_id,
            "repository": inspection["repo_url"],
            "commit_sha": inspection["commit_sha"],
            "plan_digest": task["accepted_plan"]["digest"],
            "image": task["accepted_plan"]["image"],
            "policy_digest": hashlib.sha256(json.dumps({
                "setup_network": task["accepted_plan"]["setup_network"],
                "run_network": task["accepted_plan"]["run_network"],
            }, sort_keys=True).encode()).hexdigest(),
            "routing": result["routing"],
            "usage": result["usage"],
            "composite": result["composite"],
            "comparable": result["comparable"],
            "outcome": result["outcome"],
        }
        diff_summary = {
            "files": sum(1 for line in result["patch"].splitlines() if line.startswith("diff --git ")),
            "additions": sum(1 for line in result["patch"].splitlines() if line.startswith("+") and not line.startswith("+++")),
            "deletions": sum(1 for line in result["patch"].splitlines() if line.startswith("-") and not line.startswith("---")),
        }
        artifacts = {
            "patch.diff": ("text/x-diff", result["patch"]),
            "diff-summary.json": ("application/json", json.dumps(diff_summary, indent=2)),
            "checks.json": ("application/json", json.dumps(result["checks"], indent=2)),
            "usage.json": ("application/json", json.dumps(result["usage"], indent=2)),
            "manifest.json": ("application/json", json.dumps(manifest, indent=2)),
        }
        for name, (media_type, content) in artifacts.items():
            self.store.save_coding_artifact(run_id, name, media_type, content)
        self.store.coding_event(run_id, "run_completed", {"outcome": result["outcome"], "composite": result["composite"]})
        self.store.save_coding_artifact(
            run_id, "trace.json", "application/json", json.dumps(self.store.coding_events(run_id), indent=2)
        )
        self.store.update_coding_run(
            run_id, "completed", outcome=result["outcome"], completed=completed,
            composite=result["composite"], comparable=result["comparable"], summary={
                "usage": result["usage"], "routing": result["routing"], "error": result.get("error"),
            },
        )
        return self.store.coding_run(run_id)
