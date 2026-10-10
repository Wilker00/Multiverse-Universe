# State and Data Contracts — Multiverse

The first implementation must keep execution evidence, reusable knowledge, and demonstrated capability separate.

## 1. Core Types

```typescript
type VerificationState =
  | 'pending'
  | 'passed'
  | 'failed'
  | 'needs_review';

type RunState =
  | 'queued'
  | 'running'
  | 'awaiting_approval'
  | 'verifying'
  | 'succeeded'
  | 'failed'
  | 'blocked'
  | 'cancelled'
  | 'timed_out';

interface TaskSpec {
  id: string;
  objective: string;
  contextSnapshotId: string;
  constraints: string[];
  acceptanceChecks: AcceptanceCheck[];
  permissionPolicyId: string;
  budget: RunBudget;
  schemaVersion: number;
}

interface Run {
  id: string;
  taskId: string;
  condition: 'stateless' | 'self_refine' | 'unfiltered_memory' | 'selective_memory';
  configurationSnapshotId: string;
  state: RunState;
  startedAt?: string;
  finishedAt?: string;
  resultArtifactIds: string[];
}

interface TraceEvent {
  id: string;
  runId: string;
  sequence: number;
  occurredAt: string;
  actor: 'system' | 'user' | 'agent' | 'tool' | 'verifier';
  kind: string;
  payloadRef?: string;
  artifactIds: string[];
  privacyClass: 'task_private' | 'project' | 'organization' | 'public';
  schemaVersion: number;
}
```

## 2. Memory, Skill, and Capability

```typescript
interface MemoryDNA {
  id: string;
  sourceRunId: string;
  sourceEventIds: string[];
  lesson: string;
  applicability: string[];
  exclusions: string[];
  scope: 'task' | 'project' | 'organization';
  confidence: number;
  verificationState: VerificationState;
  privacyClass: 'task_private' | 'project' | 'organization';
  version: number;
  expiresAt?: string;
  supersedesId?: string;
}

interface SkillVersion {
  id: string;
  skillId: string;
  version: number;
  procedureRef: string;
  prerequisites: string[];
  toolPermissions: string[];
  status: 'draft' | 'tested' | 'approved' | 'deprecated' | 'rolled_back';
  evaluationIds: string[];
}

interface CapabilityEvidence {
  id: string;
  capability: string;
  evaluationSetId: string;
  successfulRunIds: string[];
  failedRunIds: string[];
  metricSnapshotId: string;
  validForConfigurationId: string;
}
```

Memory records what may be useful. Skills define how to act. Capability evidence records what succeeded under independent evaluation. None implies either of the others automatically.

## 3. Evaluation and Verses

```typescript
interface Verse {
  id: string;
  parentVerseId?: string;
  taskId: string;
  purpose: string;
  runIds: string[];
  status: 'active' | 'kept' | 'rejected' | 'merge_proposed' | 'merged';
}

interface EvaluationReport {
  id: string;
  evaluationSetId: string;
  runIds: string[];
  configurationIds: string[];
  metrics: {
    successRate: number;
    regressionRate: number;
    negativeTransferRate: number;
    wallTimeMs: number;
    tokenCost: number;
    toolCost: number;
  };
  limitations: string[];
  createdAt: string;
}
```

## 4. Lifecycle Rules

- A run changes state through server-authoritative transitions.
- Trace events are append-only. Corrections append a new event rather than rewriting history.
- Memory begins as a candidate, requires a source trace, and must be rejected when privacy or provenance is incomplete.
- A skill cannot become `approved` without a recorded evaluation on relevant held-out tasks.
- A capability claim expires when its model, tool, environment, test, or configuration boundary changes materially.
- Deleting private source data must remove or invalidate derived memory that cannot remain lawful or meaningful without it.

## 5. Retrieval Contract

Filter in this order:

1. Authorization and tenant boundary.
2. Privacy class and allowed scope.
3. Verification state and expiry.
4. Task and environment applicability.
5. Relevance and novelty.
6. Context and cost budget.

Log selected and rejected memory IDs with machine-readable reasons. Retrieval scores are ranking aids, not proof that a memory applies.

## 6. Current Evaluation Wedge

The local `core/` implementation intentionally uses a smaller schema while the contracts are tested. Runs store status, budget, timing, token totals, configuration digest, retrieved memory IDs, and a winning operation. Events and memory transitions are append-only. Evaluation reports store train and evaluation corpus digests plus deterministic arm order. These records do not yet satisfy tenant privacy, artifact immutability, or production authorization requirements; `core/docs/production-boundary.md` is authoritative for those gaps.
