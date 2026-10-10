import type {
  AttemptVerse,
  CodingArtifact,
  CodingRun,
  CodingTask,
  Health,
  JobRecord,
  MemoryLogEntry,
  MemoryRecord,
  RunRecord,
  RepositoryInspection,
  TaskSummary,
  TraceEvent
} from '../types'

const base = (import.meta.env.VITE_CORE_API_BASE || '').replace(/\/$/, '')

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, options)
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const detail = body && typeof body.detail === 'string' ? body.detail : `Request failed (${response.status})`
    throw new Error(detail)
  }
  return body as T
}

const write = <T>(path: string) => request<T>(path, {
  method: 'POST',
  headers: { 'X-Multiverse-Actor': 'react-studio-local' }
})

const writeBody = <T>(path: string, body: unknown) => request<T>(path, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Multiverse-Actor': 'react-studio-local' },
  body: JSON.stringify(body)
})

export const coreApi = {
  health: () => request<Health>('/api/health'),
  tasks: () => request<TaskSummary[]>('/api/tasks'),
  runs: () => request<RunRecord[]>('/api/runs'),
  trace: (runId: string) => request<TraceEvent[]>(`/api/runs/${encodeURIComponent(runId)}/trace`),
  verses: (runId: string) => request<AttemptVerse[]>(`/api/runs/${encodeURIComponent(runId)}/verses`),
  memory: () => request<MemoryRecord[]>('/api/memory'),
  memoryLog: (memoryId: string) => request<MemoryLogEntry[]>(`/api/memory/${encodeURIComponent(memoryId)}/log`),
  approveMemory: (memoryId: string) => write<MemoryRecord>(`/api/memory/${encodeURIComponent(memoryId)}/approve`),
  rejectMemory: (memoryId: string) => write<MemoryRecord>(`/api/memory/${encodeURIComponent(memoryId)}/reject`),
  demoteMemory: (memoryId: string) => write<MemoryRecord>(`/api/memory/${encodeURIComponent(memoryId)}/demote`),
  jobs: () => request<JobRecord[]>('/api/jobs'),
  job: (jobId: string) => request<JobRecord>(`/api/jobs/${encodeURIComponent(jobId)}`),
  latestEvaluation: () => request<JobRecord | null>('/api/eval/latest'),
  startEvaluation: (budget = 3) => write<JobRecord>(`/api/eval?budget=${budget}`),
  startLearning: () => write<JobRecord>('/api/learn'),
  joinWaitlist: (email: string, website = '') => writeBody<{ accepted: boolean }>('/api/v1/waitlist', { email, website }),
  inspectRepository: (repoUrl: string, commitSha: string) => writeBody<RepositoryInspection>('/api/v1/repository-inspections', { repo_url: repoUrl, commit_sha: commitSha }),
  inspection: (inspectionId: string) => request<RepositoryInspection>(`/api/v1/repository-inspections/${encodeURIComponent(inspectionId)}`),
  createCodingTask: (body: {
    inspection_id: string
    objective: string
    acceptance_notes: string
    accepted_plan_digest: string
    max_attempts: number
    max_seconds: number
    allow_registry_network: boolean
    allow_secrets: boolean
  }) => writeBody<CodingTask>('/api/v1/tasks', body),
  startCodingRun: (taskId: string, memoryMode: 'none' | 'reviewed' = 'none') => writeBody<CodingRun>(`/api/v1/tasks/${encodeURIComponent(taskId)}/runs`, { adapter_policy: 'auto', memory_mode: memoryMode }),
  codingRuns: () => request<CodingRun[]>('/api/v1/runs'),
  codingRun: (runId: string) => request<CodingRun>(`/api/v1/runs/${encodeURIComponent(runId)}`),
  codingEvents: (runId: string) => request<TraceEvent[]>(`/api/v1/runs/${encodeURIComponent(runId)}/events`),
  codingArtifacts: (runId: string) => request<CodingArtifact[]>(`/api/v1/runs/${encodeURIComponent(runId)}/artifacts`)
}
