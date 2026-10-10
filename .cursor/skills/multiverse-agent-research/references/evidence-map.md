# Research Evidence Map

Use primary sources to inform mechanisms, not to guarantee product outcomes. Verify metadata again before public citation. This map was reviewed on 2026-10-09.

## Experience and Memory

- [ExpeL: LLM Agents Are Experiential Learners](https://arxiv.org/abs/2308.10144): experience-derived natural-language insights reused across tasks without model-weight updates.
- [Agent Workflow Memory](https://arxiv.org/abs/2409.07429): extracts reusable workflows from trajectories; relevant to candidate skill extraction.
- [Reflexion](https://arxiv.org/abs/2303.11366): uses feedback and verbal reflection across attempts; treat as a single-agent baseline, not objective proof by itself.
- [From Storage to Experience](https://aclanthology.org/2026.findings-acl.2069/): frames memory evolution through storage, reflection, and experience abstraction.
- [MemEvolve](https://proceedings.mlr.press/v306/zhang26fa.html): studies evolving both experiential knowledge and memory architecture; relevant after a fixed memory baseline exists.
- [ShareMem](https://arxiv.org/abs/2609.32511): studies cross-user memory with local preference grounding; relevant to future sharing boundaries, not permission to pool private data.

## Skills and Agent-System Adaptation

- [Voyager](https://arxiv.org/abs/2305.16291): executable skill library with iterative refinement in an embodied environment.
- [Automated Design of Agentic Systems](https://arxiv.org/abs/2408.08435): searches over agent-system designs; relevant to versioned orchestration experiments and overfitting risk.

## Parallelism and Coordination

- [Learning to Share](https://proceedings.mlr.press/v306/fioresi26a.html): selective shared memory for parallel agent teams; its controller uses reinforcement learning, which is evidence for selective admission rather than a requirement for Multiverse.
- [Agentic Aggregation](https://arxiv.org/abs/2604.11753): supports inspecting and aggregating long parallel trajectories without concatenating all context.
- [ParallelPilot](https://arxiv.org/abs/2609.33113): studies planning, isolation, logging, observation, and triage for supervising parallel coding agents.
- [MultiAgentBench](https://aclanthology.org/2025.acl-long.421/): compares collaboration and coordination topologies.

## Critical Baselines

- [Self-Refine](https://arxiv.org/abs/2303.17651): iterative single-agent refinement.
- [Should We Be Going MAD?](https://proceedings.mlr.press/v235/smit24a.html): cautions that multi-agent debate does not consistently beat simpler approaches.
- [Agentless](https://arxiv.org/abs/2407.01489): a deliberately simple software-engineering workflow baseline.
- [SWE-bench](https://proceedings.iclr.cc/paper_files/paper/2024/hash/edac78c3e300629acfe6cbe9ca88fb84-Abstract-Conference.html): repository issues with executable evaluation; task contamination and benchmark design still require care.

## Application Rules

- Separate a paper's measured result from the product mechanism it inspires.
- Reproduce a mechanism under Multiverse's task, model, tool, and budget conditions.
- Prefer deterministic evidence over model ratings.
- Include strong single-agent baselines before multi-agent comparisons.
- Treat recent preprints as provisional evidence and state their review status accurately.
