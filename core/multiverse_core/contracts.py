"""Shared contracts for bounded agent execution."""
from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class AgentTaskView:
    """The only task data an agent may receive."""

    id: str
    family: str
    tags: tuple[str, ...]
    split: str
    source: str
    visible_tests: str

    @classmethod
    def from_task(cls, task):
        return cls(task.id, task.family, tuple(task.tags), task.split, task.source, task.visible_tests)


@dataclass(frozen=True)
class RunBudget:
    attempts: int
    max_seconds: float
    max_input_tokens: int = 100_000
    max_output_tokens: int = 100_000
    max_source_bytes: int = 200_000

    @classmethod
    def coerce(cls, value):
        if isinstance(value, cls):
            return value
        attempts = int(value)
        if attempts < 1:
            raise ValueError("attempt budget must be at least 1")
        return cls(attempts=attempts, max_seconds=max(30.0, (attempts + 1) * 12.0))

    def as_dict(self):
        return asdict(self)


class BudgetExceeded(RuntimeError):
    pass
