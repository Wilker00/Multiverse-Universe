# Product Requirements Document — Multiverse

## 1. Product Status

Multiverse is currently a product hypothesis, a visual Studio prototype, public React product pages, and a runnable local evaluation wedge. Core can execute bundled synthetic fixtures, preserve traces, enforce a reviewed memory lifecycle, and compare baseline and memory-treated runs. It cannot yet accept or safely execute arbitrary real repositories and is not a production agent-learning platform.

## 2. Core Idea

**AI agents should not start every task from zero.**

Multiverse tests whether agents can complete new tasks more accurately, efficiently, and reliably by retrieving verified experience from previous executions, adapting it to the current context, and proving the result with objective checks.

`Task → Execute → Record → Verify → Extract → Retrieve → Adapt → Re-verify`

This is system-level learning through context, tools, memory, and skills. The first product does not require reinforcement-learning training or model-weight updates.

## 3. Product Definition

Multiverse is a persistent agent execution and learning platform with two layers:

- **Multiverse Core** runs tasks, tools, traces, verification, memory retrieval, skill lifecycles, permissions, and evaluations.
- **Multiverse Studio** lets people configure work, observe runs, inspect evidence, compare Verses, approve consequential actions, and review whether reuse helped.

The initial user hypothesis is agent engineers and applied-AI teams running repeated repository tasks with objective completion criteria. The economic-buyer hypothesis is the engineering or applied-AI lead accountable for reliability and compute spend. Both remain unvalidated.

## 4. Domain Model

- **Task**: A requested outcome with inputs, constraints, permissions, budget, and acceptance checks.
- **Run**: One bounded attempt to complete a task.
- **Trace**: The structured record of decisions, tool calls, outputs, errors, costs, and artifacts from a run.
- **Memory DNA**: A versioned, scoped lesson derived from a trace, with provenance, evidence, applicability, confidence, verification state, and expiry.
- **Skill**: A reusable procedure or authorized tool workflow with prerequisites, permissions, tests, versions, and rollback.
- **Capability**: A result demonstrated on independently evaluated tasks. Stored memory or an installed skill is not capability evidence by itself.
- **Verse**: An isolated alternative plan, run, or implementation branch retained for comparison.
- **Verification**: Deterministic tests or external evidence first; human approval when judgment or consequential action is required.

## 5. First Product Version

Build one reproducible evaluation loop for repository tasks such as small bug fixes:

1. Accept a task with a repository snapshot and executable acceptance tests.
2. Run a stateless single-agent baseline under a fixed model, token, tool, and time budget.
3. Record a structured trace and objective result.
4. Derive candidate Memory DNA and, when justified, a candidate skill.
5. Run a related held-out task with selective verified retrieval.
6. Compare the result against equivalent-budget baselines.
7. Reject or roll back memory or skill changes that cause negative transfer.
8. Produce an evidence-backed report with configuration, provenance, results, regressions, and actual cost.

Start with a single agent. Add parallel agents and competing Verses only after the single-agent memory loop works and only where task decomposition can be measured.

## 6. Required Baselines

- Stateless single agent.
- Single agent with self-refinement or multiple candidates.
- Single agent with unfiltered memory.
- Single agent with selectively retrieved, verified memory.
- Later only: parallel agents without sharing, unrestricted sharing, and selective sharing.

Compare systems under equal model access and declared token, tool, time, and retry budgets. Report actual cost separately.

## 7. Success Measures

Primary:

- Held-out task success rate.
- Regression and safety-violation rate.
- Negative-transfer rate.
- Cost per verified successful task.

Secondary:

- Wall-clock time.
- Token and tool spend.
- Redundant actions and failed tool calls.
- Retrieval precision and memory rejection rate.
- Skill promotion, rollback, and deprecation outcomes.

Do not claim learning from stored traces, agent agreement, self-evaluation, or performance on training tasks alone.

## 8. Safety and Privacy Requirements

- Run untrusted work in isolated, ephemeral execution environments.
- Deny network, secrets, and destructive tools by default.
- Scope every permission to a task and record each consequential action.
- Never promote secrets, personal data, private repository content, or tenant-specific preferences into shared memory.
- Require provenance and deletion behavior for every memory record.
- Preserve immutable source traces while versioning derived memories and skills.

## 9. Non-Goals for the First Version

- General autonomous work across every domain.
- Reinforcement-learning policy training.
- A marketplace of agents or skills.
- Autonomous cross-user memory sharing.
- Multi-agent debate as a substitute for tests.
- A broad dashboard before the execution loop exists.
- Claims of continual learning without held-out evidence.

## 10. Product Principle

**Memory is not learning. Consensus is not correctness. A skill is not a capability until it succeeds again under independent verification.**
