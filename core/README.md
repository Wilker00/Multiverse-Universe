# Multiverse Core (evaluation wedge)

The loop from your PRD, end to end and runnable:

    Task -> Execute -> Record -> Verify -> Extract -> Retrieve -> Adapt -> Re-verify

It compares a **stateless baseline** against the **same agent with verified Memory DNA**
on **held-out repo bug-fix tasks**, under matched budgets, and reports held-out pass rate
and cost per verified task.

## Run it

    python -m multiverse_core eval                 # manual promotion by default
    python -m multiverse_core eval --promotion-policy auto  # harness-only policy experiment
    python -m multiverse_core serve --port 8000    # API + live Studio view at http://127.0.0.1:8000
    python -m unittest discover -s tests -v        # each fixture check spawns Python
    python -m multiverse_core eval --agent anthropic   # real model; needs ANTHROPIC_API_KEY

Python 3.10+. `pip install -r requirements.txt` for the API.

## Your invariants, as code

| Invariant | Where it is enforced |
|---|---|
| Memory is not learning | `memory.py`: a lesson is only promoted after it helps on **independent** train tasks (never its source) and breaks none. Lessons that don't help are rejected. |
| Consensus is not correctness | `verifier.py`: a run is verified only if visible **and held-out** tests pass. Nothing else counts. Tested with a patch that passes every visible test and is still wrong. |
| Skills are not capabilities | `evaluator.py`: gains are measured on held-out tasks with matched budgets; `train` and `eval` splits must not overlap (raises), and the report lists any leakage. |
| Append-only trace | `store.py`: SQLite triggers abort any UPDATE or DELETE on events and on the memory status log. |
| Verify before extract | `memory.extract` ignores unverified runs. |
| Human sign-off for consequential changes | `api.py`: `/api/learn` leaves lessons at `verified`; only `/api/memory/{id}/approve` promotes them (409 if not verified). Store transitions prevent bypassing the gate. |
| Hidden data stays verifier-only | `tasks.py` gives agents a frozen public task view. References, task paths, and held-out tests never cross that interface. |
| Local execution is bounded | `sandbox.py` refuses non-bundled fixtures. `runner.py` enforces attempt, token, source-size, and elapsed-time contracts and records overruns. |

Memory DNA states: `candidate -> verified -> promoted`, or `rejected` / `demoted`, each with
actor, reason and timestamp in `memory_log`. Each run's attempts are exposed as alternative
branches at `/api/runs/{id}/verses` for the Studio Verses view.

## IMPORTANT: what the demo numbers mean

The default agent (`PatternAgent`) is a **deterministic stand-in** that searches code
mutations in a priority order. Memory changes that order. The 21 tasks were written by me
to include a case where memory helps, cases where it doesn't, and a case where it hurts
(a lesson with an over-broad `bounds` tag misleads the agent on a different bug family).
So the result (baseline 7/13, treatment 10/13, 3 regressions, sign test p = 0.51) proves
the **harness** works and catches its own failure modes. It is **not evidence** that memory
helps LLM agents. Run `--agent anthropic` on real tasks for that, and expect the cost
and variance to matter.

Cost is token-based: simulated for the stand-in agent, measured from the API for the real one.
The memory overhead is charged to the treatment arm. Reports include task-corpus digests,
deterministic arm ordering, elapsed time, and matched attempt budgets.

## API and Studio

Evaluation requests return `202` jobs. Poll `/api/jobs/{id}` or inspect `/api/jobs` rather
than holding an HTTP request open. The workspace Studio detects `multiverse-core` separately
from the optional legacy chat runner, so Core is never treated as a provider or browser database.
Core runs and reviewable memory appear in their existing Studio sections.

Set `MULTIVERSE_API_TOKEN` to require a bearer token and `X-Multiverse-Actor` on write routes.
Without it, the server assumes a trusted local operator. See `docs/production-boundary.md`.

## Repository workbench boundary

- **Real agent**: `AnthropicAgent` follows the Messages API format but was **not run** (no key or network here).
- **Sandbox**: bundled reviewed fixtures still use the restricted local fixture runner. Public repositories use the separate versioned API and fail closed unless OpenShell, reviewed policies, and a digest-pinned runner image are configured.
- **Storage**: SQLite, not Postgres. The schema is plain SQL, so porting is mechanical.
- **Studio**: the workspace `studio/` is served at `/studio/` and uses `studio/core-client.js`; `studio_live.html` remains a package fallback.
- **Real tasks**: public repositories can be inspected and run, but their own test suites produce `checks_passed`, not independent `verified` evidence. Curated hidden-test corpora remain the verification surface.
- **Worker durability**: evaluation jobs are asynchronous but use one in-process worker. Use a durable external worker before deployment.

## Layout

    multiverse_core/  contracts, store, jobs, sandbox, tasks, verifier, agents, runner, memory, evaluator, api
    multiverse_core/make_tasks.py   regenerates tasks_data/ (expected values come from the reference solutions)
    tests/test_core.py
    docs/production-boundary.md
