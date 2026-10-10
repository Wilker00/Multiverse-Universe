# Product Readiness Audit

## Verdict

Multiverse has a coherent technical hypothesis, a polished visual system, and a legitimate local evaluation wedge. It is not yet a usable product because it cannot accept and safely execute a real repository task from Studio. The next milestone is not more orchestration or more dashboard surface; it is one end-to-end verified task on an isolated real repository snapshot.

## Capability Hypothesis

For agent engineers and applied-AI teams doing repeated repository maintenance, selective reuse of independently verified experience should increase held-out task success or reduce cost per verified success without unacceptable regressions, privacy leakage, or review burden.

This remains a hypothesis until measured with a real agent on license-compatible repository tasks.

## What Works

- Product concepts distinguish Task, Run, Trace, Memory DNA, Skill, Capability, Verification, and Verse.
- The bundled fixture runner keeps references and held-out tests outside the agent task view.
- Runs preserve attempts, budgets, token totals, timing, memory IDs, configuration digests, and append-only events.
- Memory transitions enforce candidate, verified, promoted, rejected, and demoted states.
- Evaluation reports fingerprint datasets, alternate arm order deterministically, and expose negative transfer.
- Evaluation work is asynchronous and Studio can inspect Core runs, jobs, and memory review actions.
- The public page now describes the actual product and labels synthetic evidence and local-only boundaries.

## Missing Before a Real Pilot

### P0 — Product Loop

1. **Real task package**: define an immutable repository snapshot, objective, acceptance checks, permissions, budget, and verifier configuration.
2. **Isolated execution**: run untrusted repositories in disposable containers with network and secrets denied by default plus CPU, memory, process, disk, and time limits.
3. **Studio task composer**: collect the task contract, validate it, show permission consequences, and submit it to Core.
4. **Run workspace**: show server-authoritative status, current budget, approvals, trace evidence, cancellation, and terminal verification.
5. **Evaluation comparison**: compare stateless, self-refinement, and selective-memory conditions using real model and infrastructure cost.

### P0 — Customer Evidence

1. Select one repeated repository workflow, such as small bug fixes with executable tests.
2. Interview 8–12 agent engineers or applied-AI leads about frequency, current process, failures, trust requirements, and buying authority.
3. Recruit 2–3 design partners for a bounded pilot.
4. Stop or narrow if teams do not repeat the workflow, cannot provide objective checks, or do not value the evidence and reuse layer.

### P1 — Backend Reliability

- Version the API and define typed request and response schemas.
- Add task and job idempotency keys, cancellation, bounded retry policy, and stale-job recovery.
- Add cursor pagination and stable ordering for runs, events, jobs, and memory.
- Return structured problem details with safe correlation IDs.
- Replace local SQLite and the in-process worker before multiple users or API processes.
- Add tenant, project, object, and property-level authorization.
- Persist immutable task, verifier, environment, artifact, and model-configuration snapshots.

### P1 — Knowledge Lifecycle

- Store why each memory candidate applies and when it must not be used.
- Log rejected retrieval candidates with machine-readable reasons.
- Add skill versions with prerequisites, tool permissions, tests, held-out evaluations, approval, deprecation, and rollback.
- Invalidate or delete derived memory when required source data is removed.

## Information Architecture Gaps

- The prototype demonstrates destinations but lacks stable task, run, trace, evaluation, memory-detail, and skill-detail URLs.
- Loading, partial, offline, permission-denied, expired, cancellation, and recovery states are not complete.
- Phone layouts need real run, approval, trace, and evaluation data before they can be considered validated.
- The marketing page is public and indexable; Studio and future authenticated routes must remain `noindex`.

## Measurement Gaps

- No product analytics contract is implemented.
- No recurring user, buyer, activation, retention, support-burden, or willingness-to-pay evidence exists.
- Synthetic token prices and fixture outcomes cannot support a commercial claim.
- Real tool calls, infrastructure cost, queue delay, human review time, and failure recovery are not yet measured.

## Scope Razor

Build one modular monolith, one durable database, one worker queue, one container runner, one real agent configuration, and one narrow repository-task family. Defer parallel agents, shared cross-tenant memory, a skill marketplace, generic dashboards, autonomous promotion, and broad creative-workspace features.

## Recommended Next Build

Implement the immutable real-task package and container-runner adapter first. Expose it through a versioned `POST /api/v1/tasks` and `POST /api/v1/tasks/{task_id}/runs` contract, then replace the Studio scripted task action with that single end-to-end path. The acceptance gate is one real repository task that can be submitted, executed, cancelled, verified, inspected, and reproduced without exposing hidden tests, network, or secrets.
