# Product Measurement Plan

## Decision

**Question:** Does selective verified memory create enough repeated value to continue building Multiverse as a product?

**Decision changed by the data:** Continue, narrow, or stop after the first design-partner pilot.

**Primary actor:** Agent engineer or applied-AI engineer responsible for repeated repository tasks.

**Economic buyer hypothesis:** Engineering or applied-AI lead accountable for successful task throughput, reliability, and model or infrastructure spend.

## Outcomes

| Measure | Definition | Source | Guardrail |
| --- | --- | --- | --- |
| Held-out task success | Verified held-out tasks divided by eligible held-out tasks | Core verification records | Report task count and confidence limits |
| Cost per verified success | Model, tool, sandbox, storage, and review cost divided by verified tasks | Provider billing, worker telemetry, review records | Compare under equivalent access and budgets |
| Negative-transfer rate | Tasks where baseline passes and memory treatment fails divided by evaluated tasks | Paired evaluation report | Any severe safety regression stops promotion |
| Review burden | Human review minutes and interventions per verified task | Approval and review transitions | Do not optimize automation by hiding review cost |
| Repeated value | Teams completing another eligible verified task within 14 days | Server task and verification records | Login or page view does not count |

## Activation and Retention

- **Activation:** A team submits one eligible real repository task, receives a terminal verification result, and inspects its evidence.
- **Value event:** A real repository task finishes with objective verification and complete cost data.
- **Retention:** The same team completes another eligible value event within 14 days.
- **Reuse activation:** A later task retrieves reviewed memory and the user can inspect why it was selected.

## Minimal Event Contract

Events represent authoritative state transitions, not clicks.

| Event | Authority | Required properties |
| --- | --- | --- |
| `task_created` | Server | `event_id`, `task_id`, `project_id`, `task_family`, `verification_type`, `schema_version` |
| `run_started` | Server | `event_id`, `run_id`, `task_id`, `condition`, `configuration_digest`, `schema_version` |
| `run_finished` | Server | `event_id`, `run_id`, `terminal_state`, `verified`, `duration_ms`, `schema_version` |
| `memory_reviewed` | Server | `event_id`, `memory_id`, `from_status`, `to_status`, `reviewer_role`, `schema_version` |
| `evaluation_finished` | Server | `event_id`, `evaluation_id`, `task_count`, `regression_count`, `schema_version` |
| `evidence_viewed` | Client | `event_id`, `run_id`, `evidence_type`, `schema_version` |

Do not send raw prompts, source code, patches, test output, secrets, personal data, repository names, or memory text to product analytics.

## Pilot Gate

Proceed only if design partners repeat the workflow and selective memory shows a useful improvement in success, cost, or review burden without unacceptable negative transfer. Narrow if value exists only for one task family. Stop if objective checks are unavailable, review burden exceeds the benefit, or teams will not trust the required repository access.
