"""Nebius Token Factory client used by the repository coding runtime."""

from __future__ import annotations

import json
import os
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, urlopen


class TokenFactoryError(RuntimeError):
    pass


class TokenFactoryInfrastructureError(TokenFactoryError):
    pass


class TokenFactoryClient:
    def __init__(self, key=None, base_url=None, timeout=90):
        self.key = key or os.environ.get("NEBIUS_API_KEY")
        self.base_url = (base_url or os.environ.get("NEBIUS_TOKEN_FACTORY_BASE_URL") or "https://api.tokenfactory.nebius.com/v1").rstrip("/") + "/"
        self.timeout = timeout
        if not self.base_url.startswith("https://"):
            raise TokenFactoryError("Token Factory requires an HTTPS base URL")

    def _request(self, method, path, payload=None):
        if not self.key:
            raise TokenFactoryInfrastructureError("NEBIUS_API_KEY is not configured")
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        for attempt in range(4):
            request = Request(urljoin(self.base_url, path), data=body, method=method, headers={
                "Authorization": f"Bearer {self.key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "multiverse-core/0.3",
            })
            try:
                with urlopen(request, timeout=self.timeout) as response:
                    return json.load(response)
            except HTTPError as error:
                detail = error.read(2048).decode("utf-8", errors="replace")
                if error.code == 429 and attempt < 3:
                    try:
                        delay = float(error.headers.get("Retry-After", 2**attempt))
                    except ValueError:
                        delay = 2**attempt
                    time.sleep(min(60, max(0, delay)))
                    continue
                if 500 <= error.code < 600 and attempt < 3:
                    time.sleep(2**attempt)
                    continue
                category = TokenFactoryInfrastructureError if error.code >= 500 or error.code == 429 else TokenFactoryError
                raise category(f"Token Factory HTTP {error.code}: {detail[:400]}") from error
            except URLError as error:
                if attempt < 3:
                    time.sleep(2**attempt)
                    continue
                raise TokenFactoryInfrastructureError(f"Token Factory connection failed: {error.reason}") from error
        raise TokenFactoryInfrastructureError("Token Factory request failed")

    def models(self):
        return self._request("GET", "models")

    def validate_models(self, configured):
        catalog = {item.get("id") for item in self.models().get("data", [])}
        missing = [model for model in configured.values() if model not in catalog]
        if missing:
            raise TokenFactoryError(f"configured models are absent from the live catalog: {', '.join(missing)}")
        return catalog

    def chat(self, model, messages, tools, max_tokens=2048):
        return self._request("POST", "chat/completions", {
            "model": model,
            "messages": messages,
            "tools": tools,
            "tool_choice": "auto",
            "max_tokens": max_tokens,
            "stream": False,
        })
