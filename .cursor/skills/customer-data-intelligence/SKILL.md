---
name: customer-data-intelligence
description: "Evaluates product proposals using customer evidence, repeated workflow value, willingness to pay, retention, trust, support burden, and compute economics. Use for market selection, pricing hypotheses, product metrics, interview plans, pilot design, monetization, or diagnosing whether an AI-agent feature solves a recurring problem."
---

# Customer and Market Intelligence

Separate product evidence from plausible stories. Multiverse has a technical hypothesis, but its recurring buyer and paid workflow are not yet validated.

## Workflow

1. **Name the user and recurring job**
   - Identify who experiences the problem, how often, what they do today, and what failure costs them.
   - Reject categories such as "anyone using AI agents."

2. **Name the economic buyer**
   - Distinguish the daily user, approver, security owner, and budget owner.
   - Record willingness to pay as an interview or pilot hypothesis until observed.

3. **Define the valuable outcome**
   - Prefer verified tasks completed, regressions prevented, review time reduced, or cost per successful task over runs, messages, agents, or stored memories.

4. **Audit the product loop**
   - Check whether the feature improves `Task → Execute → Verify → Learn → Reuse`.
   - Cut features that add visibility or novelty without changing a user decision or verified outcome.

5. **Model full cost**
   - Include model tokens, tool calls, sandbox compute, storage, retries, verification, support, and human review.
   - Compare cost per verified success, not cost per agent run.

6. **Design the smallest validation**
   - Use interviews to understand the workflow and a narrow pilot to observe repeated use.
   - Define pass, fail, and stop conditions before collecting data.

## Failure Modes

- **Demo novelty**: impressive parallel activity without a recurring task.
- **Memory theater**: a growing archive that does not improve held-out outcomes.
- **Coordination tax**: more agents increase cost, latency, conflicts, or supervision.
- **Trust gap**: users cannot inspect evidence, permissions, or rollback harmful reuse.
- **Evaluation leakage**: held-out answers enter memory and create false improvement.
- **Compute margin trap**: retries and parallel runs cost more than the outcome is worth.
- **Non-paying audience**: enthusiastic users lack authority or budget to adopt the system.
- **Platform-first scope**: broad infrastructure is built before one repeated workflow is validated.

## Measurement Rules

- Define activation around a verified completed task, not account creation.
- Define retention around a repeated valuable workflow in a product-appropriate time window.
- Segment results by task type, team, model, memory condition, and verification method.
- Treat industry benchmarks as context, never as universal targets.
- Do not collect raw prompts, source code, secrets, or private artifacts in product analytics.
- Track human intervention and trust failures alongside automation rate.

## Required Output

- user, buyer, recurring job, and current alternative;
- evidence and assumptions;
- valuable outcome and guardrail metrics;
- full cost model;
- failure-mode assessment;
- smallest interview or pilot plan;
- proceed, narrow, defer, or reject recommendation.
