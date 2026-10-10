# Multiverse Domain Model

## Required Distinctions

| Concept | Meaning | Required evidence |
| --- | --- | --- |
| Task | Requested outcome, context, constraints, permissions, budget, and checks | Immutable task specification |
| Run | One bounded attempt under a configuration | Ordered trace and terminal state |
| Trace | Events, tool calls, outputs, errors, costs, and artifacts | Append-only source record |
| Memory DNA | Scoped lesson derived from one or more traces | Provenance, applicability, verification, privacy, version, expiry |
| Skill | Reusable procedure or authorized tool workflow | Prerequisites, permissions, tests, evaluation history, rollback |
| Capability | Demonstrated performance on independent tasks | Evaluation set, configuration boundary, successes and failures |
| Verse | Isolated alternative plan or execution branch | Parent state, purpose, runs, comparison, merge decision |
| Verification | Method used to judge an outcome | Check definition, environment, output, artifact digest |

## Memory DNA Minimum Fields

- stable ID and schema version;
- immutable source run and event references;
- concise lesson;
- applicable task and environment conditions;
- exclusions and known failure cases;
- scope and privacy class;
- verification state and supporting evidence;
- confidence with a defined meaning;
- creation, review, expiry, and supersession metadata.

Confidence ranks uncertain evidence. It never overrides authorization, privacy, failed checks, or incompatibility.

## Skill Lifecycle

`draft → tested → approved → deprecated`

Any active version may become `rolled_back` when it causes regressions, violates a changed permission boundary, or fails re-evaluation.

- **Draft**: proposed procedure; unavailable by default.
- **Tested**: evaluated on declared tasks; results remain visible.
- **Approved**: available within explicit scope and permissions.
- **Deprecated**: retained for history but excluded from new runs.
- **Rolled back**: removed from use because a newer or current version was harmful.

## Retrieval Gate

Evaluate in order:

1. authorization and tenant boundary;
2. privacy and sharing scope;
3. verification state, version, and expiry;
4. task, environment, tool, and dependency compatibility;
5. relevance and novelty;
6. context and cost budget.

Record selected and rejected IDs with reason codes. Permit a run to proceed with no inherited memory.

## Capability Boundary

Attach every capability claim to:

- a task family and evaluation set;
- model, instructions, tools, skills, and memory policy;
- environment and verifier versions;
- resource budget;
- observed failures and limitations;
- validity or re-evaluation trigger.

Never write “the agent can code” when the evidence only supports a narrower claim such as “this configuration passed 18 of 25 held-out dependency-update tasks.”
