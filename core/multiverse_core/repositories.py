"""Safe public-repository inspection and deterministic stack planning."""

from __future__ import annotations

from dataclasses import asdict, dataclass
import hashlib
import ipaddress
import json
import os
from pathlib import Path
import re
import shutil
import socket
import subprocess
import tempfile
import time
from urllib.parse import urlsplit


FULL_SHA = re.compile(r"^[0-9a-fA-F]{40}$")
SOURCE_SUFFIXES = {
    ".c", ".cc", ".cpp", ".css", ".go", ".h", ".hpp", ".html", ".java", ".js",
    ".json", ".jsx", ".md", ".py", ".rb", ".rs", ".sh", ".toml", ".ts", ".tsx",
    ".yaml", ".yml",
}


class RepositoryRejected(ValueError):
    pass


@dataclass(frozen=True)
class InspectionLimits:
    clone_seconds: int = 90
    max_repository_bytes: int = 80 * 1024 * 1024
    max_files: int = 20_000
    max_source_bytes: int = 20 * 1024 * 1024


@dataclass(frozen=True)
class ExecutionPlan:
    stack: str
    install_commands: tuple[tuple[str, ...], ...]
    check_commands: tuple[tuple[str, ...], ...]
    image: str
    setup_network: tuple[str, ...]
    run_network: str
    limits: dict
    digest: str

    def as_dict(self):
        return asdict(self)


def validate_public_repository_url(repo_url: str, resolver=socket.getaddrinfo) -> str:
    parsed = urlsplit(repo_url)
    if parsed.scheme != "https" or not parsed.hostname:
        raise RepositoryRejected("repository URL must be public HTTPS")
    if parsed.username or parsed.password or parsed.query or parsed.fragment:
        raise RepositoryRejected("repository URL cannot contain credentials, query parameters, or fragments")
    if parsed.port not in (None, 443):
        raise RepositoryRejected("repository URL must use the standard HTTPS port")
    try:
        answers = resolver(parsed.hostname, 443, type=socket.SOCK_STREAM)
    except OSError as error:
        raise RepositoryRejected("repository host could not be resolved") from error
    addresses = {answer[4][0].split("%")[0] for answer in answers}
    if not addresses:
        raise RepositoryRejected("repository host returned no addresses")
    for address in addresses:
        try:
            if not ipaddress.ip_address(address).is_global:
                raise RepositoryRejected("repository host resolves to a non-public address")
        except ValueError as error:
            raise RepositoryRejected("repository host returned an invalid address") from error
    return repo_url


class RepositoryInspector:
    def __init__(self, root=None, limits=None, image=None):
        self.root = Path(root or os.environ.get("MULTIVERSE_WORK_ROOT") or Path(tempfile.gettempdir()) / "multiverse-work")
        self.limits = limits or InspectionLimits()
        self.image = image or os.environ.get("MULTIVERSE_RUNNER_IMAGE", "multiverse-runner:unconfigured")

    def inspect(self, inspection_id: str, repo_url: str, commit_sha: str) -> dict:
        validate_public_repository_url(repo_url)
        if not FULL_SHA.fullmatch(commit_sha):
            raise RepositoryRejected("commit_sha must be a full 40-character hexadecimal SHA")
        destination = self.root / "inspections" / inspection_id
        if destination.exists():
            shutil.rmtree(destination)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.mkdir()
        env = {
            "PATH": os.environ.get("PATH", ""),
            "SYSTEMROOT": os.environ.get("SYSTEMROOT", ""),
            "GIT_LFS_SKIP_SMUDGE": "1",
            "GIT_TERMINAL_PROMPT": "0",
            "HOME": str(destination.parent),
        }
        commands = (
            ["git", "-c", "protocol.file.allow=never", "-c", "http.followRedirects=false", "init", "--quiet", str(destination)],
            ["git", "-C", str(destination), "remote", "add", "origin", repo_url],
            ["git", "-C", str(destination), "-c", "protocol.file.allow=never", "-c", "http.followRedirects=false", "fetch", "--quiet", "--depth=1", "--no-tags", "origin", commit_sha],
            ["git", "-C", str(destination), "checkout", "--quiet", "--detach", "FETCH_HEAD"],
        )
        deadline = time.monotonic() + self.limits.clone_seconds
        for command in commands:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise RepositoryRejected("repository clone exceeded its time limit")
            try:
                completed = subprocess.run(command, env=env, capture_output=True, text=True, timeout=remaining)
            except subprocess.TimeoutExpired as error:
                raise RepositoryRejected("repository clone exceeded its time limit") from error
            if completed.returncode:
                detail = (completed.stderr or completed.stdout)[-500:]
                raise RepositoryRejected(f"repository checkout failed: {detail}")
        actual = subprocess.run(
            ["git", "-C", str(destination), "rev-parse", "HEAD"], env=env, capture_output=True, text=True, timeout=10, check=True
        ).stdout.strip()
        if actual.lower() != commit_sha.lower():
            raise RepositoryRejected("repository did not resolve to the requested commit")
        inventory = self._inventory(destination)
        plan = detect_execution_plan(destination, self.image, self.limits)
        return {
            "repo_url": repo_url,
            "commit_sha": actual,
            "worktree": str(destination),
            "inventory": inventory,
            "execution_plan": plan.as_dict(),
            "requires_review": True,
        }

    def _inventory(self, root: Path) -> dict:
        files = 0
        storage_files = 0
        total_bytes = 0
        source_bytes = 0
        for path in root.rglob("*"):
            if path.is_symlink():
                raise RepositoryRejected("symbolic links are not accepted in repository worktrees")
            if not path.is_file():
                continue
            storage_files += 1
            size = path.stat().st_size
            total_bytes += size
            if ".git" not in path.parts:
                files += 1
                if path.suffix.lower() in SOURCE_SUFFIXES:
                    source_bytes += size
            if storage_files > self.limits.max_files:
                raise RepositoryRejected("repository exceeds the file-count limit")
            if total_bytes > self.limits.max_repository_bytes:
                raise RepositoryRejected("repository exceeds the byte limit")
            if source_bytes > self.limits.max_source_bytes:
                raise RepositoryRejected("repository exceeds the source-byte limit")
        return {"files": files, "storage_files": storage_files, "bytes": total_bytes, "source_bytes": source_bytes}


def detect_execution_plan(root: Path, image: str, limits: InspectionLimits) -> ExecutionPlan:
    detected = []
    if any((root / name).exists() for name in ("pyproject.toml", "requirements.txt", "uv.lock")):
        detected.append("python")
    if (root / "package.json").exists():
        detected.append("node")
    if (root / "Cargo.toml").exists():
        detected.append("rust")
    if len(detected) != 1:
        reason = "no supported stack detected" if not detected else f"multiple stacks detected: {', '.join(detected)}"
        raise RepositoryRejected(reason)
    stack = detected[0]
    if stack == "python":
        if (root / "uv.lock").exists():
            install = (("uv", "sync", "--frozen"),)
        elif (root / "requirements.txt").exists():
            install = (("python", "-m", "pip", "install", "-r", "requirements.txt"),)
        else:
            install = (("python", "-m", "pip", "install", "-e", "."),)
        tests_present = (root / "tests").is_dir() or any(root.glob("test_*.py")) or (root / "pytest.ini").exists()
        if not tests_present:
            raise RepositoryRejected("Python repository has no detected pytest checks")
        checks = (("python", "-m", "pytest", "-q"),)
        network = ("pypi.org:443", "files.pythonhosted.org:443")
    elif stack == "node":
        package = json.loads((root / "package.json").read_text(encoding="utf-8"))
        if "test" not in package.get("scripts", {}):
            raise RepositoryRejected("Node repository must declare a test script")
        lockfiles = [name for name in ("package-lock.json", "pnpm-lock.yaml", "yarn.lock") if (root / name).exists()]
        if len(lockfiles) != 1:
            raise RepositoryRejected("Node repository must contain exactly one supported lockfile")
        if lockfiles[0] == "package-lock.json":
            install, checks = (("npm", "ci"),), (("npm", "test"),)
        elif lockfiles[0] == "pnpm-lock.yaml":
            install, checks = (("pnpm", "install", "--frozen-lockfile"),), (("pnpm", "test"),)
        else:
            install, checks = (("yarn", "install", "--immutable"),), (("yarn", "test"),)
        network = ("registry.npmjs.org:443",)
    else:
        install = ()
        checks = (("cargo", "test", "--locked"),) if (root / "Cargo.lock").exists() else (("cargo", "test"),)
        network = ("crates.io:443", "index.crates.io:443", "static.crates.io:443")
    body = {
        "stack": stack,
        "install_commands": install,
        "check_commands": checks,
        "image": image,
        "setup_network": network,
        "run_network": "deny",
        "limits": asdict(limits),
    }
    digest = hashlib.sha256(json.dumps(body, sort_keys=True).encode("utf-8")).hexdigest()
    return ExecutionPlan(digest=digest, **body)
