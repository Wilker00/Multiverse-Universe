# Hackathon Contract

## Product claim

Multiverse is a verified coding-agent workbench. It uses NVIDIA Nemotron through Nebius Token Factory, executes repository work inside NVIDIA OpenShell, records reproducible evidence, and turns only reviewed evidence into reusable memory.

## Submission requirements

- Target Coding and Agentic Engineering.
- Show material use of a Nebius service and an NVIDIA model or open-source technology.
- Keep the source repository public with an Apache-2.0 license.
- Document setup, architecture, security boundaries, limitations, and the contribution made during the event.
- Provide a working demo URL and a video shorter than three minutes.

## Demo sequence

1. Inspect a public repository at a full commit SHA.
2. Review and accept the detected execution plan.
3. Run the bounded agent and show model routing and sandbox policy.
4. Inspect the patch, checks, trace, usage, and reproducibility manifest.
5. Review a memory candidate.
6. Run a paired no-memory versus reviewed-memory evaluation.

## Required honesty

- Public repository tests yield `checks_passed`, not independent verification.
- Only curated tasks with hidden checks yield `verified`.
- Composite fallback runs are demonstrations, not comparison evidence.
- Memory is reviewed context, not model-weight reinforcement learning.
