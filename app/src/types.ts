export type LoadState = 'loading' | 'ready' | 'empty' | 'error'

export interface Health {
  ok: boolean
  product: string
  version: string
  agent: string
  synthetic: boolean
  capabilities: string[]
}

export interface TaskSummary {
  id: string
  family: string
  tags: string[]
  split: 'train' | 'eval'
}

export interface RunRecord {
  id: string
  task_id: string
  agent: string
  arm: string
  started: number
  completed?: number | null
  verified: boolean
  visible_pass: boolean
  attempts: number
  tokens_in: number
  tokens_out: number
  memory_ids: string[]
  budget: number
  status: string
  duration_ms?: number | null
  error?: string | null
  config_digest?: string | null
  winning_op?: string | null
}

export interface TraceEvent {
  id: number
  ts: number
  kind: string
  payload: Record<string, unknown>
}

export type MemoryStatus = 'candidate' | 'verified' | 'promoted' | 'rejected' | 'demoted'

export interface MemoryRecord {
  id: string
  status: MemoryStatus
  scope: string
  tags: string[]
  text: string
  op: string
  confidence: number
  source_run: string
  source_task: string
  created: number
  expires: number
  version: number
  evidence: Record<string, unknown>
}

export interface MemoryLogEntry {
  id: number
  memory_id: string
  ts: number
  from_status: MemoryStatus | null
  to_status: MemoryStatus
  actor: string
  reason: string
}

export interface JobRecord {
  id: string
  kind: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  created: number
  started?: number | null
  completed?: number | null
  result?: Record<string, unknown> | null
  error?: string | null
}

export interface EvaluationArm {
  passed: number
  tokens_in: number
  tokens_out: number
  attempts: number
  duration_ms: number
  cost: number
  cost_per_verified: number | null
}

export interface EvaluationReport {
  n_eval: number
  budget: number
  baseline: EvaluationArm
  treatment: EvaluationArm
  paired: {
    both: number
    only_treatment: number
    only_baseline: number
    neither: number
  }
  sign_test_p: number
  leakage: string[]
  regressions: Array<{
    task: string
    family: string
    memory_used: string[]
    ops: string[]
  }>
  dataset: {
    train_digest: string
    eval_digest: string
  }
  simulated: boolean
  notes: string[]
  promoted: number
}

export interface AttemptVerse {
  n?: number
  op?: string
  site?: string
  visible_pass?: boolean
  hidden_pass?: boolean
  error?: string
}

export interface TaskDraft {
  objective: string
  repositoryUrl: string
  commitSha: string
  acceptanceChecks: string
  allowNetwork: boolean
  allowSecrets: boolean
  maxAttempts: number
  maxMinutes: number
}

export interface ExecutionPlan {
  stack: 'python' | 'node' | 'rust'
  install_commands: string[][]
  check_commands: string[][]
  image: string
  setup_network: string[]
  run_network: 'deny'
  limits: Record<string, number>
  digest: string
}

export interface RepositoryInspection {
  id: string
  status: 'pending' | 'running' | 'ready' | 'failed'
  repo_url: string
  commit_sha: string
  created: number
  completed?: number | null
  error?: string | null
  inventory?: { files: number; bytes: number; source_bytes: number }
  execution_plan?: ExecutionPlan
  requires_review?: boolean
  job_id?: string
}

export interface CodingTask {
  id: string
  inspection_id: string
  objective: string
  acceptance_notes: string
  accepted_plan: ExecutionPlan
  budget: Record<string, number>
  permissions: { registry_network: boolean; secrets: boolean }
}

export interface CodingRun {
  id: string
  task_id: string
  job_id?: string | null
  status: 'queued' | 'running' | 'completed'
  outcome?: 'verified' | 'checks_passed' | 'failed' | 'blocked' | 'cancelled' | 'budget_exceeded' | null
  created: number
  started?: number | null
  completed?: number | null
  adapter_policy: 'auto' | 'native'
  memory_mode: 'none' | 'reviewed'
  composite: boolean
  comparable: boolean
  summary: {
    usage?: { tokens_in: number; tokens_out: number }
    routing?: Array<{ attempt?: number; tier?: string; model?: string; reason?: string; adapter: string; status?: string }>
    error?: string | null
  }
}

export interface CodingArtifact {
  run_id: string
  name: string
  media_type: string
  content: string
  digest: string
}
