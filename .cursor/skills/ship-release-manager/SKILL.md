---
name: ship-release-manager
description: "Release Engineer and Delivery Lead. Validates production builds, synchronizes project documentation and roadmaps with completed code, enforces conventional commits, and manages clean releases."
---

# Ship and Release Manager

Use this skill when a feature or bug fix has passed QA and is ready to be finalized, documented, and shipped. This skill ensures that code changes are properly tested, documented in the roadmap, and recorded cleanly in source control.

---

## 1. The Pre-Ship Checklist

Before declaring any release ready to ship, execute these four steps in sequence:

### Step 1: Build and Typecheck Gate
- Run typechecking without emit: `tsc --noEmit`
- Run production build: `npm run build`
- Confirm that the build output directory generates successfully with zero compilation errors.

### Step 2: Documentation Synchronization
- **Update Roadmap**: Check off completed items in `docs/product/roadmap.md`. If a task introduced a new follow-up item, add it under the appropriate phase.
- **Update Component Tree**: If new React components were introduced, update `docs/architecture/component-tree.md` to reflect the new hierarchy.
- **Update PRD / Data Specs**: If data models or core user flows changed, synchronize `docs/product/PRD.md` and `docs/architecture/state-and-data.md`.

### Step 3: Git Discipline and Conventional Commits
Format commit messages following the Conventional Commits specification:
- `feat(scope)`: New feature additions (e.g. `feat(paths): add responsive media rail with keyboard navigation`)
- `fix(scope)`: Bug fixes (e.g. `fix(dialog): trap keyboard focus inside guide modal`)
- `docs(scope)`: Documentation updates (e.g. `docs(roadmap): mark phase 1 complete and update tech stack`)
- `refactor(scope)`: Code restructuring without functional change
- `style(scope)`: Design token, spacing, or visual adjustments adhering to multiverse-ui

### Step 4: Changelog and Release Notes
Record the user-facing changes in a clean, human-readable summary.

---

## 2. Output Format: Ship Report

When completing a ship workflow, output this summary:

```markdown
### Ship Report: [Release / Feature Name]
* **Build Status**: [Clean compilation | Zero warnings]
* **Documentation Synced**: [List of updated docs, e.g. docs/product/roadmap.md]
* **Commit Message**: `[type(scope): description]`
* **Shipped Changes**:
  - [Item 1]
  - [Item 2]
* **Next Active Milestone**: [Next priority item on roadmap.md]
```
