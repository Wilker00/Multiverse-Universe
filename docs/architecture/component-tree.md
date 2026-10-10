# Studio Information Architecture — Multiverse

Build Studio around the execution-and-learning loop. The existing static page is a visual reference, not this application shell.

## Working Implementations

The current application shell lives in `app/` and uses React, TypeScript, and Vite. It implements stable task, run, trace, evaluation, memory, skill-contract, and Verse routes with one responsive component system. `app/src/lib/api.ts` is the narrow adapter for the local evaluation Core. Connected pages use server-authoritative records; unavailable task submission and skill-registry behavior is labeled rather than simulated.

The older interaction prototype remains in `studio/index.html`, `studio/styles.css`, and `studio/app.js` as a visual and flow reference. Its scripted runs, generated memory, simulation, and model agreement remain demonstrations rather than product evidence.

## Route Model

```text
/
├── /                             Public product overview
├── /loop                         Execution loop explained
├── /evidence                     Evidence contract and limits
├── /tasks/new                    Create a task and its verification contract
├── /runs/:runId                  Observe and control one run
├── /runs/:runId/trace            Inspect ordered actions and evidence
├── /evaluations/:evaluationId    Compare baseline and treatment results
├── /memory                       Find Memory DNA within the current scope
├── /memory/:memoryId             Inspect provenance, limits, and history
├── /skills                       Review skill lifecycle and status
├── /skills/:skillId              Inspect versions, permissions, and evaluations
└── /verses/:verseId              Compare an alternative execution branch
```

Do not add a generic dashboard until repeated use shows which cross-run summary is needed.

## Application Tree

```text
<ProductShell>                  Public pages only: /, /loop, /evidence
├── <ProductHeader />
├── <ProductHome /> | <LoopPage /> | <EvidenceRecord />
├── <ProductFooter />
└── <BoundaryDialog />

<AppShell>
├── <ProductHeader />
├── <PrimaryNavigation />
├── <RouteOutlet>
│   ├── <TaskComposer>
│   │   ├── <ObjectiveField />
│   │   ├── <ContextPicker />
│   │   ├── <AcceptanceCheckBuilder />
│   │   ├── <PermissionReview />
│   │   └── <BudgetReview />
│   ├── <RunWorkspace>
│   │   ├── <RunStatus />
│   │   ├── <CurrentStep />
│   │   ├── <BudgetMeter />
│   │   ├── <ApprovalQueue />
│   │   ├── <TracePreview />
│   │   └── <VerificationSummary />
│   ├── <TraceInspector />
│   ├── <EvaluationComparison />
│   ├── <MemoryIndex />
│   ├── <MemoryDetail />
│   ├── <SkillIndex />
│   ├── <SkillDetail />
│   └── <VerseComparison />
├── <SystemStatusRegion />
└── <ApprovalDialog />
```

## Shared Component Contracts

```typescript
interface EvidenceLinkProps {
  label: string;
  sourceRunId: string;
  sourceEventIds?: string[];
  artifactId?: string;
}

interface VerificationResultProps {
  state: 'pending' | 'passed' | 'failed' | 'needs_review';
  checkName: string;
  summary: string;
  evidence: EvidenceLinkProps[];
}

interface ApprovalRequestProps {
  action: string;
  consequence: string;
  requestedPermissions: string[];
  expiresAt?: string;
  onAllowOnce: () => void;
  onDeny: () => void;
}
```

## Presentation Rules

- Put status, evidence, and next action before model names or internal metadata.
- Show technical detail on demand without hiding failures or costs.
- Use lists and ruled records for traces and metrics; do not turn every event into a card.
- Keep approval actions visible and explicit on every viewport.
- Convert wide comparisons into labeled stacked records on phone.
- Never use agent avatars, colored role cards, glowing nodes, or animated “thinking” decoration as substitutes for execution state.
