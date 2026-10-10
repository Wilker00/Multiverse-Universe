import argparse, json, os
from .store import Store
from .tasks import load_tasks
from .agents import PatternAgent, AnthropicAgent
from .runner import Runner
from .memory import MemoryBroker
from . import evaluator


def main():
    ap = argparse.ArgumentParser(prog="multiverse_core")
    sub = ap.add_subparsers(dest="cmd", required=True)
    e = sub.add_parser("eval", help="run the baseline vs memory experiment")
    e.add_argument("--agent", choices=["pattern", "anthropic"], default="pattern")
    e.add_argument("--db", default=":memory:")
    e.add_argument("--json", action="store_true")
    e.add_argument("--promotion-policy", choices=["manual", "auto"], default="manual",
                   help="auto is for explicit synthetic harness experiments only")
    s = sub.add_parser("serve", help="run the API and the live Studio view")
    s.add_argument("--host", default="127.0.0.1")
    s.add_argument("--port", type=int, default=8000)
    s.add_argument("--db", default=os.environ.get("MULTIVERSE_DB", "multiverse.db"))
    a = ap.parse_args()
    if a.cmd == "eval":
        store = Store(a.db)
        agent = PatternAgent() if a.agent == "pattern" else AnthropicAgent()
        rep = evaluator.experiment(Runner(store, agent), MemoryBroker(store), load_tasks("train"), load_tasks("eval"), policy=a.promotion_policy)
        print(json.dumps(rep, indent=1) if a.json else evaluator.markdown(rep))
    else:
        import uvicorn
        from .api import create_app
        uvicorn.run(create_app(a.db), host=a.host, port=a.port)


if __name__ == "__main__":
    main()
