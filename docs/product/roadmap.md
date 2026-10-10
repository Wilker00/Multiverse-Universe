# Product Roadmap — Multiverse

The roadmap advances from a falsifiable execution experiment to a usable agent platform. Dates and commercial commitments remain unset until the first experiment produces evidence.

## Phase 0: Product Contract

- [x] Separate Multiverse Core from Multiverse Studio.
- [x] Define Memory DNA, skills, capabilities, and Verses as different entities.
- [x] Choose LLM-agent system improvement rather than model-weight training for the first version.
- [x] Define objective verification and equal-budget baselines.
- [x] Record the current static page as a visual prototype only.
- [x] Align the public page with the verified-memory product and remove unsupported research claims.
- [x] Publish React product pages for the overview, execution loop, and evidence contract. Studio routes stay out of search.

## Phase 1: Evaluation Harness

- [ ] Select a small, license-compatible set of repository tasks with executable tests.
- [ ] Pin repository snapshots, task inputs, model configuration, tools, and budgets.
- [x] Implement one bounded fixture runner with structured trace capture; container isolation remains required for real repositories.
- [ ] Run stateless and self-refinement baselines across multiple task instances.
- [x] Produce reproducible local reports with corpus digests, success, regressions, elapsed time, tokens, and simulated cost; real tool and billing data remain pending.

**Exit gate:** Baselines can be rerun from configuration and produce auditable results.

## Phase 2: Verified Memory and Skills

- [x] Implement the local Memory DNA lifecycle, provenance, scope, expiry, and transition log; tenant privacy classes remain pending.
- [ ] Add candidate extraction from successful and failed traces.
- [ ] Add relevance and applicability filters before retrieval.
- [ ] Implement draft, tested, approved, deprecated, and rolled-back skill states.
- [ ] Compare stateless, unfiltered-memory, and selective-memory conditions on held-out tasks.

**Exit gate:** Selective reuse improves at least one declared outcome without unacceptable regression or cost under equivalent budgets.

## Phase 3: Core Service and Studio

- [ ] Expose runs, traces, memories, evaluations, and approvals through versioned APIs. A local unversioned adapter exists; skills and production versioning remain pending.
- [x] Build the React Studio shell and views for task drafting, run history, trace evidence, memory provenance and review, skill contracts, Verses, and evaluation comparison. Real task submission, live run control, and the skills registry remain pending.
- [ ] Add human approval gates for consequential actions.
- [ ] Add Verse branching only where alternative runs need comparison or merge review.
- [ ] Add parallel execution only after dependency, ownership, conflict, and budget controls exist.

**Exit gate:** A user can inspect why knowledge was used, verify the outcome, and reject or roll back a harmful change.

**Next implementation:** Build the immutable real-task package and disposable container-runner adapter described in `docs/product/readiness-audit.md` and `docs/architecture/api-contract.md`.

## Phase 4: Product Validation

- [ ] Recruit a narrow cohort of agent engineers or applied-AI teams.
- [ ] Measure repeated use, successful task throughput, trust, and intervention burden.
- [ ] Identify a recurring workflow and economic buyer before setting pricing.
- [ ] Validate tenant isolation, retention, deletion, and operational recovery.
- [x] Define the first product measurement and privacy contract; instrumentation remains pending.

**Exit gate:** Repeated use and willingness to pay are observed, not assumed.
