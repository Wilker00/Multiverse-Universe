# Technical Architecture — Multiverse

This is a provisional architecture for the first verifiable product experiment. Prefer the smallest system that can reproduce runs, isolate execution, and compare outcomes.

## 1. System Boundaries

### Multiverse Core

- **API and orchestration service**: accepts tasks, enforces permissions and budgets, schedules runs, and records state transitions.
- **Agent runner**: invokes one configured model with scoped tools, skills, and retrieved memory.
- **Execution sandbox**: provides an ephemeral workspace with deny-by-default network and secret access.
- **Verifier**: runs deterministic tests, schemas, linters, or task-specific checks before requesting human judgment.
- **Trace store**: records append-only run events and references immutable artifacts.
- **Memory broker**: filters candidate and approved Memory DNA by scope, relevance, privacy, applicability, and expiry.
- **Skill registry**: versions procedures and records tests, permissions, promotion, deprecation, and rollback.
- **Evaluator**: runs declared baselines under comparable budgets and generates reproducible reports.

### Multiverse Studio

- Configures tasks, checks, budgets, and permissions.
- Shows run status, tool activity, evidence, and approval requests.
- Inspects source traces, Memory DNA, skill versions, and Verses.
- Compares outcomes, regressions, negative transfer, and actual cost.

Studio never acts as the source of truth for run completion, permissions, or verification results.

The `studio/` HTML, CSS, and JavaScript files are the current interaction prototype. They may use browser storage and scripted data to exercise states, but they do not replace the React/TypeScript Studio, Core API, runner, verifier, or trace store described below.

The imported `core/` package is the first runnable evaluation wedge. It provides a FastAPI adapter, bounded synthetic runner, append-only traces, enforced memory transitions, corpus fingerprints, and an asynchronous local job queue. It is evidence-harness code, not the final production architecture; its exact limits are recorded in `core/docs/production-boundary.md`.

## 2. Initial Stack

- **Studio**: React, Vite, and TypeScript with the existing Multiverse design tokens.
- **Core API**: Python with FastAPI is the default candidate because the first experiment is evaluation-heavy and Python has broad model and testing support. Confirm with a short architecture decision before implementation.
- **Database**: PostgreSQL for tasks, runs, state, provenance, permissions, and evaluation records.
- **Artifacts**: content-addressed object storage for patches, logs, reports, and repository snapshots.
- **Jobs**: one managed queue or database-backed worker mechanism; no event bus by default.
- **Sandbox**: disposable container or equivalent isolated runner with explicit CPU, memory, time, filesystem, network, and secret limits.
- **Contracts**: OpenAPI for HTTP and JSON Schema for trace events, task checks, Memory DNA, and evaluation reports.

Do not add a vector database initially. Start with structured filters and PostgreSQL text or vector support only after retrieval requirements and scale are measured.

## 3. Required Invariants

1. Every run references an immutable task specification and configuration snapshot.
2. Every trace event belongs to one run and has an ordered sequence, timestamp, actor, and schema version.
3. Every derived memory links to source trace evidence.
4. Memory retrieval never bypasses tenant, project, privacy, expiry, or permission boundaries.
5. Skills execute only through declared tools and permissions.
6. Verification results store the check definition, environment, output, and artifact digest.
7. A baseline and treatment comparison records model, token, tool, time, and retry budgets.
8. Failed, cancelled, and timed-out runs preserve partial traces without being marked successful.

## 4. Security Defaults

- Authenticate every caller and authorize the exact task, run, artifact, memory, skill, and Verse.
- Treat repositories, prompts, traces, outputs, and artifacts as private unless explicitly classified otherwise.
- Mount only the task workspace into the runner.
- Keep secrets out of prompts, traces, artifacts, analytics, and reusable memory.
- Require approval for destructive writes, publication, external communication, spending, and elevated network or secret access.
- Sign or digest immutable inputs and result artifacts used in evaluations.

## 5. Observability

Keep operational telemetry separate from agent traces.

- Operational logs: request IDs, job IDs, latency, failures, resource use, and queue delay.
- Agent traces: task-scoped actions, tool inputs and outputs, decisions, artifacts, and verification evidence.
- Product analytics: meaningful user and experiment state changes only; never raw private task content.

## 6. Deferred Complexity

Do not begin with microservices, Kubernetes, unrestricted autonomous tool use, cross-tenant memory, automated skill promotion, or parallel agents. Add each only after a measured need and a failure-safe contract exist.
