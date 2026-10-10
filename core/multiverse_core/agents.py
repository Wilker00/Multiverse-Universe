"""Agents. All agents get the same interface and the same attempt budget.

PatternAgent is a deterministic stand-in: it searches single-site code mutations in a
priority order, checking each against the visible tests. It exists to test the
loop's mechanics offline. It says NOTHING about how real LLM agents behave.
AnthropicAgent is the real thing; it needs ANTHROPIC_API_KEY and a network."""
import json, os, re, urllib.request
from dataclasses import dataclass, field

tok = lambda s: max(1, (len(s) + 3) // 4)


def _sites(src, pat, repl):
    for m in re.finditer(pat, src):
        yield f"{m.start()}", src[:m.start()] + repl(m) + src[m.end():]


OPS = {
    "and_to_or": lambda s: _sites(s, r"\band\b", lambda m: "or"),
    "or_to_and": lambda s: _sites(s, r"\bor\b", lambda m: "and"),
    "lt_to_le": lambda s: _sites(s, r"(?<![<=\-])<(?![<=])", lambda m: "<="),
    "le_to_lt": lambda s: _sites(s, r"<=", lambda m: "<"),
    "gt_to_ge": lambda s: _sites(s, r"(?<![>=\-])>(?![>=])", lambda m: ">="),
    "ge_to_gt": lambda s: _sites(s, r">=", lambda m: ">"),
    "len_minus1": lambda s: _sites(s, r"\[len\((\w+)\)\]", lambda m: f"[len({m.group(1)}) - 1]"),
}
DEFAULT_ORDER = ["and_to_or", "le_to_lt", "ge_to_gt", "len_minus1", "lt_to_le", "gt_to_ge", "or_to_and"]


@dataclass
class AgentResult:
    source: str
    attempts: list = field(default_factory=list)
    tokens_in: int = 0
    tokens_out: int = 0
    solved_visible: bool = False


class PatternAgent:
    name = "pattern (synthetic)"
    synthetic = True

    def solve(self, task, lessons, budget, check):
        src = task.source
        base = AgentResult(src)
        if check(src)["ok"]:
            base.solved_visible = True
            return base
        pref = [l["op"] for l in lessons]
        order = [o for o in pref if o in OPS] + [o for o in DEFAULT_ORDER if o not in pref]
        mem_tokens = sum(tok(l["text"]) for l in lessons)
        for op in order:
            for site, new in OPS[op](src):
                if len(base.attempts) >= budget:
                    return base
                ok = check(new)["ok"]
                base.tokens_in += tok(src) + mem_tokens + 30
                base.tokens_out += tok(new)
                base.attempts.append({"op": op, "site": site, "visible_pass": ok, "source": new})
                if ok:
                    base.source, base.solved_visible = new, True
                    return base
        return base


class AnthropicAgent:
    """Asks a model for a corrected solution.py, feeds back failing visible tests. Untested without a key."""
    name = "anthropic"
    synthetic = False

    def __init__(self, model=None, key=None):
        self.model = model or os.environ.get("MULTIVERSE_MODEL", "claude-sonnet-5-5")
        self.key = key or os.environ.get("ANTHROPIC_API_KEY")

    def _call(self, prompt):
        if not self.key:
            raise RuntimeError("ANTHROPIC_API_KEY is required for the Anthropic agent")
        req = urllib.request.Request("https://api.anthropic.com/v1/messages", method="POST",
            headers={"x-api-key": self.key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
            data=json.dumps({"model": self.model, "max_tokens": 2000, "messages": [{"role": "user", "content": prompt}]}).encode())
        with urllib.request.urlopen(req, timeout=60) as response:
            j = json.load(response)
        return "".join(c.get("text", "") for c in j["content"]), j["usage"]["input_tokens"], j["usage"]["output_tokens"]

    def solve(self, task, lessons, budget, check):
        r = AgentResult(task.source)
        if check(r.source)["ok"]:
            r.solved_visible = True
            return r
        notes = "\n".join(f"- {l['text']}" for l in lessons)
        last = check(r.source)["out"]
        for _ in range(budget):
            prompt = (f"Fix the bug in solution.py so the tests pass.\n\nsolution.py:\n{r.source}\n\ntests:\n{task.visible_tests}\n\nlast test output:\n{last}\n"
                      + (f"\nVerified lessons from earlier tasks:\n{notes}\n" if notes else "") + "\nReply with only the full corrected contents of solution.py, no code fences.")
            text, ti, to = self._call(prompt)
            new = re.sub(r"^```\w*\n|\n```$", "", text.strip())
            res = check(new)
            r.tokens_in += ti; r.tokens_out += to
            r.attempts.append({"op": "llm", "site": "-", "visible_pass": res["ok"], "source": new})
            last = res["out"]
            if res["ok"]:
                r.source, r.solved_visible = new, True
                break
        return r
