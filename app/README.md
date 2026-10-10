# Multiverse Studio React App

This is the current Multiverse Studio application shell. It uses React, TypeScript, and Vite while the older `studio/` directory remains a static interaction reference.

## Run locally

Start Core from the repository root:

```powershell
Set-Location core
python -m multiverse_core serve --port 8000 --db multiverse.db
```

Start Studio in another terminal:

```powershell
Set-Location app
npm install
npm run dev
```

Studio opens at `http://127.0.0.1:5174`. The signup page is `/`; the full product pages are `/product`, `/loop`, and `/evidence`. Task setup remains at `/tasks/new`. If Core uses another port, set `VITE_CORE_PROXY_TARGET` before starting Vite.

Copy `.env.example` to `.env.local` and set `VITE_GITHUB_URL` to the public repository URL. This value is public browser configuration, not a secret.

## Product boundaries

- Task setup saves a browser-local draft because Core does not accept real repository task packages yet.
- Runs, traces, evaluation jobs, evaluation reports, memory records, and memory review actions use the local Core API.
- Skills routes document the required registry contract because Core has no skills API yet.
- Synthetic evaluation reports check the harness and do not establish model capability.
