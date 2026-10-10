---
name: multiverse-agent-research
description: "Designs and reviews Multiverse Core and Studio as a persistent LLM-agent execution system. Use for Memory DNA, trace capture, skill extraction and promotion, selective cross-task transfer, Verses, orchestration, isolated tool execution, verification, agent evaluation, negative transfer, or claims that agents improve over repeated real-world tasks."
---

# Multiverse Agent Research

Preserve the original principle that agents should not restart from zero, but implement it through LLM-agent context, tools, traces, memory, and skills rather than reinforcement-learning policy updates.

`Task → Execute → Record → Verify → Extract → Retrieve → Adapt → Re-verify`

## References

- Read [references/domain-model.md](references/domain-model.md) when defining Memory DNA, skills, capabilities, Verses, traces, or lifecycle states.
- Read [references/experiment-contract.md](references/experiment-contract.md) when planning an MVP, benchmark, evaluation, ablation, or improvement claim.
- Read [references/evidence-map.md](references/evidence-map.md) when selecting a research-backed mechanism or citing prior work.

## Workflow

1. **State the capability claim**
   - Name the task family, user-visible outcome, verification method, and configuration boundary.
   - Mark unmeasured product ideas as hypotheses.

2. **Choose the simplest baseline**
   - Begin with one stateless agent and one single-agent refinement condition.
   - Add memory, skills, Verses, or parallelism as separately measurable treatments.

3. **Define the evidence path**
   - Capture task input, configuration, actions, tool results, artifacts, failures, verification, and cost.
   - Preserve source trace references for every derived memory or skill.

4. **Gate reusable knowledge**
   - Check authorization, privacy, provenance, verification, applicability, novelty, expiry, and retrieval cost.
   - Keep memory task-local when any sharing condition is unresolved.

5. **Verify adaptation**
   - Use deterministic checks before model judgment.
   - Test candidate skills or memories on held-out related tasks before promotion.
   - Detect negative transfer and support rejection, deprecation, and rollback.

6. **Compare fairly**
   - Hold model access and declared token, tool, time, and retry budgets constant where possible.
   - Report actual cost and material configuration differences.
   - Use multiple tasks and runs before claiming general improvement.

7. **Expose the result in Studio**
   - Show status, evidence, permissions, provenance, transfer decisions, failures, and cost.
   - Keep internal orchestration detail secondary to what happened and whether it worked.

## Hard Rules

- Do not equate stored traces with learning.
- Do not equate an installed skill with demonstrated capability.
- Do not use consensus, self-critique, or model confidence as ground truth.
- Do not promote every successful trace into shared memory.
- Do not assume multi-agent execution beats a strong single-agent baseline.
- Do not add parallelism without dependency ownership, conflict handling, and budget accounting.
- Do not expose secrets, private task content, or tenant-specific preferences through shared memory.
- Do not require reinforcement-learning training for the current product.
- Do not claim continual improvement without held-out, reproducible evidence.
- Do not copy paper-reported gains into product forecasts.

## Required Output

Return only the artifacts needed for the request:

- capability hypothesis and product boundary;
- baseline and treatment matrix;
- trace, memory, skill, and verification contracts;
- permission and privacy constraints;
- metrics, budgets, ablations, and stopping rules;
- evidence links and limitations;
- implementation sequence and unresolved risks.
