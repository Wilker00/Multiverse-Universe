# Production Boundary

The current Core is a local evaluation wedge. It is deliberately not a multi-tenant production service.

## Safe Today

- Agents receive a frozen public task view without references or held-out tests.
- The local subprocess runner accepts only the bundled, reviewed task fixtures.
- Runs record budgets, configuration digests, status, errors, timing, memory IDs, and append-only trace events.
- Memory follows enforced state transitions. Promotion requires a verified record and an identified reviewer.
- Long evaluations use one persisted, single-worker local queue instead of blocking HTTP requests.
- Evaluation reports fingerprint both task splits and alternate arm order deterministically.

## Local-Only Assumptions

- SQLite is safe for one process and one local operator, not multiple API replicas.
- The in-process worker cannot resume interrupted jobs after a process restart.
- When `MULTIVERSE_API_TOKEN` is unset, write routes trust the local machine boundary.
- The bundled subprocess runner is not a security sandbox for arbitrary repositories.

## Required Before Deployment

1. Replace SQLite with a transactional production database and tenant-scoped authorization.
2. Replace the in-process executor with a durable queue that leases, retries, and resumes jobs.
3. Run untrusted repositories in disposable containers with no network, no inherited secrets, read-only base files, and explicit CPU, memory, process, disk, and time limits.
4. Store immutable task snapshots, verifier definitions, artifacts, and environment digests.
5. Authenticate every caller and authorize every task, run, trace, memory record, and transition.
6. Add retention, deletion, audit export, backup, recovery, and operational telemetry.

Do not expose this server beyond a trusted local interface and call it production-ready.
