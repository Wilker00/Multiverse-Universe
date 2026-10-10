# Nebius and NVIDIA Stack

## Token Factory

- API base: `https://api.tokenfactory.nebius.com/v1`.
- Credential: `NEBIUS_API_KEY` environment variable.
- Use `/models` to discover current identifiers and model limit metadata.
- Use `/chat/completions` for the native tool loop.
- Keep `/responses` available for compatibility diagnostics.
- Honor `Retry-After`; retry transient 5xx responses with bounded exponential backoff.

Official references:

- https://api.tokenfactory.nebius.com/docs
- https://nebius.com/services/token-factory/models/nvidia-nemotron-models-inference
- https://github.com/nebius/token-factory-cookbook

## OpenShell

Use one fresh sandbox per run. Copy only the pinned worktree. Keep the model credential on the host or in an OpenShell credential provider. Permit package registries during setup, then deny network for editing and checks.

Official references:

- https://docs.nvidia.com/openshell/latest/about/how-it-works
- https://docs.nvidia.com/openshell/dev/how-it-works/policies/overview
- https://docs.nvidia.com/openshell/dev/sdk/python

## NemoClaw fallback

Pin NemoClaw at `0.0.78` or newer. Invoke Deep Agents Code headlessly and require exactly one schema-version-1 JSON envelope. Accept only documented status values. Core runs approved checks between editing turns because headless mode does not provide an unrestricted shell to the agent.

Official references:

- https://github.com/NVIDIA/NemoClaw
- https://docs.nvidia.com/nemoclaw/latest/user-guide/deepagents/get-started/quickstart
- https://docs.nvidia.com/nemoclaw/latest/user-guide/deepagents/manage-sandboxes/operate-sandboxes/run-deep-agents-code
