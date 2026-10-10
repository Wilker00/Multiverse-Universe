---
name: multiverse-nebius
description: Build, inspect, test, or document Multiverse's Nebius/NVIDIA coding-agent integration. Use for Nebius Token Factory inference, NVIDIA Nemotron routing, OpenShell sandbox execution, NemoClaw fallback, public-repository ingestion, hackathon evidence, deployment, or submission work in this project.
---

# Multiverse Nebius

Build a bounded coding-agent workbench, not an unrestricted autonomous agent.

## Workflow

1. Read `references/multiverse-integration.md` before changing Core or Studio.
2. Read `references/nebius-stack.md` before changing inference, sandbox, or fallback behavior.
3. Read `references/hackathon-contract.md` before preparing a demo or submission.
4. Use `scripts/token_factory.py doctor --output <path>` before live integration work.
5. Preserve the evidence chain: inspect, approve, execute, record, verify, review, evaluate.
6. Apply `.cursor/skills/multiverse-agent-research/SKILL.md` to all memory and comparison claims.

## Hard Rules

- Read `NEBIUS_API_KEY` from the environment only. Never place it in arguments, files, traces, browser code, or sandbox variables.
- Pin repositories to full commit SHAs and execute only an accepted immutable plan.
- Keep dependency setup network access separate from network-denied editing and verification.
- Call a public-repository result `checks_passed`; reserve `verified` for checks hidden from the agent.
- Promote memory only after evidence review. Never describe prompt or memory updates as model-weight training.
- Keep the native Token Factory/OpenShell adapter primary.
- Use NemoClaw only for infrastructure failure before the first valid coding attempt.
- Mark fallback runs composite and exclude them from baseline-versus-treatment claims.
- Do not add Git provider credentials, commits, branches, or pull-request writes to the MVP.

## Model Routing

- Attempts 1–2: configured Lightning model.
- Attempts 3–4: configured Super model after explicit failure, no progress, or invalid tool output.
- Attempt 5: configured Ultra model when budget remains.
- Stop on approved check success.
- Discover catalog identifiers at runtime; do not claim availability from a hard-coded list.

## Diagnostics

Run:

```powershell
python .cursor/skills/multiverse-nebius/scripts/token_factory.py doctor --output doctor.json
python .cursor/skills/multiverse-nebius/scripts/token_factory.py models --output models.json
python .cursor/skills/multiverse-nebius/scripts/token_factory.py limits --model $env:NEBIUS_MODEL_LIGHTNING --output limits.json
```

Use `chat`, `responses`, and `tool-smoke` only when live inference is explicitly intended. All commands write JSON artifacts and print only a short destination message.
