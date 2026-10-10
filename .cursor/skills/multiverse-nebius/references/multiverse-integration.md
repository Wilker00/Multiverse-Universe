# Multiverse Integration

## Boundaries

- React Studio is a presentation and review surface; it never receives provider credentials.
- FastAPI Core owns repository inspection, immutable plans, budgets, routing, traces, artifacts, and review transitions.
- OpenShell owns process, filesystem, network, and credential isolation.
- Token Factory supplies Nemotron inference.
- SQLite is acceptable for the single-instance hackathon deployment.

## Repository lifecycle

`inspect -> needs_review -> ready -> task_created -> queued -> running -> terminal`

Inspection accepts only public HTTPS Git URLs and full commit SHAs. Reject embedded credentials, private or reserved destinations, unsafe redirects, submodules, and Git LFS. Enforce clone time, byte, file-count, and source-size limits.

## Supported stacks

- Python: prefer `uv.lock`, then `requirements.txt`, then `pyproject.toml`; propose `pytest -q` when tests exist.
- Node: select npm, pnpm, or Yarn from the lockfile; require a declared test script.
- Rust: use `cargo test --locked` with `Cargo.lock`, otherwise `cargo test`.
- Multiple or unknown stacks require explicit review instead of guessing.

## Evidence

Every terminal run produces a patch, diff summary, check report, trace, usage report, and reproducibility manifest. Record repository SHA, execution-plan digest, sandbox image digest, policy digest, adapter, model, routing reason, duration, and token use.

## Comparison integrity

Paired evaluations must use the same commit, objective, accepted plan, budget, routing policy, adapter policy, and sandbox policy. The only intended difference is reviewed memory availability.
