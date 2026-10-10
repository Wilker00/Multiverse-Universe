# Nebius Hackathon Runtime

## Trust model

Core inspects a public repository without executing it, presents a deterministic plan, and requires the exact plan digest when the task is created. Repository code executes only through OpenShell. There is no local subprocess fallback for untrusted code.

The host owns the Token Factory credential. The sandbox receives tools and repository content, never the credential. Setup uses a reviewed package-registry policy. Core replaces it with a no-network policy before model-directed work begins.

## Native run

1. Resolve and validate a public HTTPS repository host.
2. Fetch a full commit SHA with redirects, submodules, LFS, prompts, and local protocols disabled.
3. Enforce repository byte, file-count, source-byte, and clone-time limits.
4. Detect one supported stack and produce an immutable execution plan.
5. Create a fresh OpenShell sandbox from an image pinned by digest.
6. Install dependencies under the setup policy.
7. Replace the policy with deny-by-default runtime policy.
8. Run the Token Factory tool loop with bounded repository tools.
9. Stop after approved checks pass or the attempt budget ends.
10. Save the patch, check output, usage, trace, diff summary, and manifest.

## Routing

Attempts one and two use the configured Lightning model. Attempts three and four use Super after failure or no progress. Attempt five uses Ultra. The model identifiers are operator configuration validated against the live Token Factory catalog.

## Fallback

NemoClaw fallback is allowed only when native infrastructure fails before a valid coding tool call. A failing patch or test is not an infrastructure failure. Fallback uses one schema-version-1 headless Deep Agents Code envelope, then Core runs the approved checks. The result is marked composite and non-comparable.

## Evidence labels

- `verified`: curated task passed checks hidden from the agent.
- `checks_passed`: public repository passed its declared checks.
- `failed`: execution completed but checks did not pass.
- `blocked`: required infrastructure or policy was unavailable.
- `budget_exceeded`, `cancelled`: reserved terminal outcomes for enforced limits and operator cancellation.

## Deployment boundary

The hackathon deployment uses one FastAPI process, one SQLite database on persistent storage, a static React build, and one OpenShell gateway. The in-process worker is deliberately single-threaded. Horizontal scaling requires a durable queue and shared transactional database and is outside the MVP.
