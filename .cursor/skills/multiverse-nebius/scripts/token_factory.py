#!/usr/bin/env python3
"""Small, dependency-free diagnostics client for Nebius Token Factory."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import tempfile
import time
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, urlopen


DEFAULT_BASE_URL = "https://api.tokenfactory.nebius.com/v1/"
MAX_INPUT_BYTES = 2 * 1024 * 1024


class ClientError(RuntimeError):
    pass


class FileRateLimiter:
    def __init__(self, key: str, interval: float = 1.0) -> None:
        digest = hashlib.sha256(key.encode("utf-8")).hexdigest()[:16]
        root = Path(tempfile.gettempdir()) / "multiverse-nebius"
        root.mkdir(parents=True, exist_ok=True)
        self.state = root / f"{digest}.json"
        self.lock = root / f"{digest}.lock"
        self.interval = interval

    def wait(self) -> None:
        deadline = time.monotonic() + 15
        while True:
            try:
                descriptor = os.open(self.lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
                os.close(descriptor)
                break
            except FileExistsError:
                if time.monotonic() >= deadline:
                    raise ClientError("timed out waiting for the shared rate-limit lock")
                try:
                    if time.time() - self.lock.stat().st_mtime > 30:
                        self.lock.unlink(missing_ok=True)
                except FileNotFoundError:
                    pass
                time.sleep(0.05)
        try:
            previous = 0.0
            if self.state.exists():
                try:
                    previous = float(json.loads(self.state.read_text(encoding="utf-8"))["last"])
                except (KeyError, TypeError, ValueError, json.JSONDecodeError):
                    previous = 0.0
            delay = self.interval - (time.time() - previous)
            if delay > 0:
                time.sleep(delay)
            self.state.write_text(json.dumps({"last": time.time()}), encoding="utf-8")
        finally:
            self.lock.unlink(missing_ok=True)


class TokenFactoryClient:
    def __init__(self, api_key: str, base_url: str, timeout: float = 60.0) -> None:
        if not api_key:
            raise ClientError("NEBIUS_API_KEY is not set")
        if not base_url.startswith("https://"):
            raise ClientError("Token Factory base URL must use HTTPS")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/") + "/"
        self.timeout = timeout
        self.limiter = FileRateLimiter(self.base_url)

    def request(self, method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        for attempt in range(4):
            self.limiter.wait()
            request = Request(
                urljoin(self.base_url, path.lstrip("/")),
                data=body,
                method=method,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "User-Agent": "multiverse-nebius-diagnostics/1",
                },
            )
            try:
                with urlopen(request, timeout=self.timeout) as response:
                    raw = response.read()
                    return json.loads(raw.decode("utf-8")) if raw else {}
            except HTTPError as error:
                detail = error.read(MAX_INPUT_BYTES).decode("utf-8", errors="replace")
                if error.code == 429:
                    retry_after = error.headers.get("Retry-After")
                    if attempt < 3:
                        time.sleep(_retry_delay(retry_after, attempt))
                        continue
                    raise ClientError(f"Token Factory rate limit exceeded: {detail[:300]}") from error
                if 500 <= error.code < 600 and attempt < 3:
                    time.sleep(2**attempt)
                    continue
                raise ClientError(f"Token Factory returned HTTP {error.code}: {detail[:300]}") from error
            except URLError as error:
                if attempt < 3:
                    time.sleep(2**attempt)
                    continue
                raise ClientError(f"Token Factory connection failed: {error.reason}") from error
        raise ClientError("Token Factory request failed")


def _retry_delay(value: str | None, attempt: int) -> float:
    if value:
        try:
            return min(60.0, max(0.0, float(value)))
        except ValueError:
            pass
    return float(2**attempt)


def _load_json(path: str) -> dict[str, Any]:
    source = Path(path)
    if source.stat().st_size > MAX_INPUT_BYTES:
        raise ClientError("input JSON exceeds 2 MiB")
    value = json.loads(source.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ClientError("input JSON must contain an object")
    return value


def _write_json(path: str, value: Any) -> None:
    destination = Path(path)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"wrote {destination}")


def _models(client: TokenFactoryClient) -> dict[str, Any]:
    return client.request("GET", "models")


def _command_payload(arguments: argparse.Namespace) -> dict[str, Any]:
    payload = _load_json(arguments.input)
    payload["model"] = arguments.model
    payload.setdefault("max_tokens", arguments.max_output_tokens)
    payload.setdefault("stream", False)
    return payload


def run(arguments: argparse.Namespace) -> int:
    base_url = os.environ.get("NEBIUS_TOKEN_FACTORY_BASE_URL", DEFAULT_BASE_URL)
    key_present = bool(os.environ.get("NEBIUS_API_KEY"))
    if arguments.command == "doctor" and not key_present:
        _write_json(arguments.output, {
            "ok": False,
            "base_url": base_url,
            "credential": "missing",
            "required_models": {
                name: bool(os.environ.get(name))
                for name in ("NEBIUS_MODEL_LIGHTNING", "NEBIUS_MODEL_SUPER", "NEBIUS_MODEL_ULTRA")
            },
        })
        return 2

    client = TokenFactoryClient(os.environ.get("NEBIUS_API_KEY", ""), base_url, arguments.timeout)
    if arguments.command == "models":
        result = _models(client)
    elif arguments.command == "limits":
        catalog = _models(client)
        records = catalog.get("data", [])
        match = next((item for item in records if item.get("id") == arguments.model), None)
        if match is None:
            raise ClientError(f"model not found in live catalog: {arguments.model}")
        result = {"model": arguments.model, "limits": match.get("limits"), "metadata": match}
    elif arguments.command == "chat":
        result = client.request("POST", "chat/completions", _command_payload(arguments))
    elif arguments.command == "responses":
        payload = _load_json(arguments.input)
        payload["model"] = arguments.model
        payload.setdefault("max_output_tokens", arguments.max_output_tokens)
        result = client.request("POST", "responses", payload)
    elif arguments.command == "tool-smoke":
        payload = {
            "model": arguments.model,
            "messages": [{"role": "user", "content": "Call report_status with status ready. Do not answer directly."}],
            "tools": [{
                "type": "function",
                "function": {
                    "name": "report_status",
                    "description": "Report the requested diagnostic status.",
                    "parameters": {
                        "type": "object",
                        "properties": {"status": {"type": "string", "enum": ["ready"]}},
                        "required": ["status"],
                        "additionalProperties": False,
                    },
                },
            }],
            "tool_choice": "auto",
            "max_tokens": 128,
            "stream": False,
        }
        response = client.request("POST", "chat/completions", payload)
        choices = response.get("choices", [])
        calls = choices[0].get("message", {}).get("tool_calls", []) if choices else []
        result = {"ok": bool(calls), "tool_calls": calls, "response": response}
    else:
        catalog = _models(client)
        available = {item.get("id") for item in catalog.get("data", [])}
        configured = {
            name: os.environ.get(name)
            for name in ("NEBIUS_MODEL_LIGHTNING", "NEBIUS_MODEL_SUPER", "NEBIUS_MODEL_ULTRA")
        }
        result = {
            "ok": all(configured.values()) and all(model in available for model in configured.values()),
            "base_url": base_url,
            "credential": "present",
            "configured_models": configured,
            "catalog_count": len(available),
            "missing_from_catalog": [model for model in configured.values() if model and model not in available],
        }
    _write_json(arguments.output, result)
    return 0


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(description=__doc__)
    root.add_argument("--timeout", type=float, default=60.0)
    commands = root.add_subparsers(dest="command", required=True)
    for name in ("doctor", "models"):
        command = commands.add_parser(name)
        command.add_argument("--output", required=True)
    limits = commands.add_parser("limits")
    limits.add_argument("--model", required=True)
    limits.add_argument("--output", required=True)
    for name in ("chat", "responses"):
        command = commands.add_parser(name)
        command.add_argument("--model", required=True)
        command.add_argument("--input", required=True)
        command.add_argument("--max-output-tokens", type=int, default=512)
        command.add_argument("--output", required=True)
    smoke = commands.add_parser("tool-smoke")
    smoke.add_argument("--model", required=True)
    smoke.add_argument("--output", required=True)
    return root


def main() -> int:
    try:
        return run(parser().parse_args())
    except (ClientError, OSError, json.JSONDecodeError) as error:
        print(f"error: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
