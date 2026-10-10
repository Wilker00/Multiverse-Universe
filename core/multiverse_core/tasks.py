"""Bug-fix tasks. Each task has visible tests (the agent may run these) and held-out
tests in a separate folder that only the verifier reads."""
import json
from dataclasses import dataclass
from pathlib import Path
from .contracts import AgentTaskView

ROOT = Path(__file__).parent / "tasks_data"


@dataclass
class Task:
    id: str
    family: str
    tags: list
    split: str  # "train" (memory may be learned from it) or "eval" (held out)
    dir: Path
    trusted_fixture: bool = False

    @property
    def source(self):
        return (self.dir / "solution.py").read_text(encoding="utf-8")

    @property
    def visible_tests(self):
        return (self.dir / "tests_visible.py").read_text(encoding="utf-8")

    @property
    def hidden_tests(self):  # verifier only
        return (self.dir / "_hidden" / "tests_heldout.py").read_text(encoding="utf-8")

    @property
    def reference(self):  # verifier / unit tests only
        return (self.dir / "_hidden" / "solution_correct.py").read_text(encoding="utf-8")

    def agent_view(self):
        return AgentTaskView.from_task(self)


def load_tasks(split=None, root=ROOT):
    root = Path(root).resolve()
    bundled = root == ROOT.resolve()
    out = []
    for d in sorted(root.iterdir()):
        if (d / "task.json").exists():
            j = json.loads((d / "task.json").read_text(encoding="utf-8"))
            t = Task(j["id"], j["family"], j["tags"], j["split"], d, bundled)
            if split is None or t.split == split: out.append(t)
    return out
