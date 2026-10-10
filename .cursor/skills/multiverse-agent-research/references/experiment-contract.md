# Experiment Contract

## First Experiment

Use repeatable repository tasks with executable acceptance checks. Start with one agent and related held-out tasks so the effect of memory can be isolated.

### Conditions

| Condition | Purpose |
| --- | --- |
| Stateless | Establish the no-memory baseline |
| Self-refinement | Test a strong simple alternative to persistent memory |
| Unfiltered memory | Measure noise and negative transfer |
| Selective verified memory | Test the central Multiverse hypothesis |

Add parallel-agent conditions only after these four run reliably.

### Fixed or Reported Inputs

- task and repository snapshot;
- model and inference settings;
- system instructions and available tools;
- token, tool-call, wall-time, retry, and monetary budgets;
- sandbox image and dependency versions;
- acceptance checks and timeout behavior;
- memory corpus available before the run;
- randomization method and run count.

## Metrics

Primary:

- verified task success;
- regression or safety-violation rate;
- negative-transfer rate;
- cost per verified success.

Secondary:

- wall-clock time;
- token and tool spend;
- failed and redundant actions;
- retrieval acceptance and rejection rates;
- human interventions;
- performance on held-out task variants.

Define every metric's population, numerator, denominator, exclusions, source, and uncertainty before collecting results.

## Ablations

When the full system improves, remove one mechanism at a time:

- memory content without skills;
- skills without retrieved memory;
- relevance ranking without verification gating;
- verification gating without applicability filters;
- single candidate versus multiple candidates;
- later only: sequential versus parallel execution and restricted versus unrestricted sharing.

## Negative Transfer

Count a transfer as harmful when the treatment causes a declared degradation relative to its comparable baseline, such as:

- a previously passing acceptance check fails;
- task success changes to failure;
- safety or permission violations increase;
- cost or latency exceeds the predefined tolerance without outcome benefit.

Record the inherited memory or skill version involved and test rejection or rollback.

## Stopping Rules

Stop or narrow the experiment when:

- tasks cannot be evaluated reliably;
- baseline configurations are not reproducible;
- conditions differ materially in undeclared resources;
- the memory corpus leaks held-out answers;
- private data cannot be separated from reusable lessons;
- cost prevents enough runs to distinguish signal from noise.

## Report

Include task selection, configuration, budgets, source data, condition assignments, run-level outcomes, aggregate metrics, failures, negative transfer, limitations, and reproduction steps. Publish no performance claim without the matching report.
