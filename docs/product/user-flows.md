# User Flows — Multiverse

These flows describe the intended product. The public pages at `/`, `/loop`, and `/evidence` explain the loop and its limits. Studio implements the working paths below. The static page does not.

The working `studio/` prototype demonstrates task entry, scripted run discussion, candidate-memory review, Verse comparison, execution planning, and evaluation presentation. It must label simulated or local behavior clearly and must not imply that agreement, generated output, or saved browser data has been verified.

## Flow 1: Create a Verifiable Task

```text
[New task]
  → Describe the required outcome
  → Attach or select the working context
  → Define acceptance checks
  → Review tool, network, secret, budget, and approval permissions
  → Start run
```

If objective acceptance checks are missing, Multiverse labels the task as judgment-based and requires an explicit human review step. It does not invent a test.

## Flow 2: Observe and Control a Run

```text
[Run starts]
  → Show plan, active step, tool activity, elapsed budget, and pending approvals
  → Allow pause, cancel, or deny a consequential action
  → Preserve completed trace events and artifacts
  → Run deterministic verification
  → Show verified, failed, blocked, or needs-review result
```

The default view prioritizes current status, evidence, and next action. Internal reasoning is not presented as proof.

## Flow 3: Review Memory DNA

```text
[Verified run ends]
  → Show candidate lesson and source trace
  → Show scope, applicability, privacy class, confidence, and expiry
  → Approve, edit, reject, or keep task-local
  → Record the decision and reviewer
```

Raw traces never become globally reusable memory automatically.

## Flow 4: Promote a Skill

```text
[Repeated procedure identified]
  → Create draft skill version
  → Declare prerequisites, tools, permissions, and tests
  → Evaluate on held-out relevant tasks
  → Approve, revise, reject, or deprecate
```

A promoted skill remains distinct from capability evidence. Capability is earned through successful independent evaluations.

## Flow 5: Compare Transfer Conditions

```text
[Evaluation set selected]
  → Run stateless baseline
  → Run unfiltered-memory condition
  → Run selective verified-memory condition
  → Compare success, regressions, negative transfer, time, tokens, tools, and cost
  → Inspect evidence and export report
```

The comparison must expose configuration or budget differences that would make results unfair.

## Flow 6: Explore a Verse

```text
[Alternative approach needed]
  → Branch from a defined task or run state
  → Execute in an isolated Verse
  → Compare artifacts and objective evidence
  → Keep separately, reject, or propose a reviewed merge
```

Verses are not decorative scenarios. Each Verse exists because an alternative can change the result or teach the system something testable.

## Responsive Behavior

- Phone preserves task status, approvals, evidence, and cancel or recovery actions.
- Dense trace inspection may use progressive disclosure, but no required action is desktop-only.
- Tables become labeled records rather than horizontal-scroll traps.
- Live updates announce meaningful state changes without narrating every tool event.

## Critical State Matrix

| State | Visible explanation | Available action | Preserved data | Recovery |
| --- | --- | --- | --- | --- |
| Loading | Which task, run, or evidence is loading | Cancel only when useful | Existing form and loaded records | Retry the failed request |
| Empty | Why no tasks, runs, memory, or evaluations exist | Create the first eligible task | Not applicable | Clear first step |
| Validation error | Which contract field is invalid and how to correct it | Correct and resubmit | Every valid field | Focus the first invalid field |
| Partial | Which evidence loaded and which source failed | Continue with labeled partial data or retry | Loaded evidence | Targeted retry |
| Permission denied | Which permission is required without exposing protected data | Request access or return | User input only | Safe destination |
| Offline | Which read-only data remains available | Retry or preserve local draft | Unsaved task draft | Reconcile after reconnect |
| Cancel requested | Cancellation is pending while the worker reaches a safe stop | Continue inspecting trace | All completed events and artifacts | Terminal cancelled or completed state |
| Failed | Plain-language impact, failed check, and correlation ID | Inspect evidence, retry eligible work, or revise task | Full partial trace | New bounded run |
| Success | What passed, under which configuration, and what remains unproven | Inspect evidence or review memory | Run, trace, artifacts, and report | Demote harmful memory later |
