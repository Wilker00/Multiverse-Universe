import { useEffect } from 'react'
import { AsyncState, EvidenceLink, KeyValue, SectionHeading, StatusText, formatDate, shortId } from '../components/Common'
import { PageIntro } from '../components/PageIntro'
import { useResource } from '../hooks/useResource'
import { coreApi } from '../lib/api'
import type { CodingArtifact, CodingRun, RunRecord } from '../types'

function CodingRunView({ run, artifacts }: { run: CodingRun; artifacts: CodingArtifact[] }) {
  const successful = run.outcome === 'checks_passed' || run.outcome === 'verified'
  const usage = run.summary.usage
  return <>
    {run.composite && <div className="boundary-note warning-note" role="note"><StatusText tone="danger">Composite run</StatusText><p>Native infrastructure failed before a valid coding attempt, so NemoClaw completed this run. It is excluded from baseline-versus-memory claims.</p></div>}
    <section className="workspace-section">
      <SectionHeading eyebrow="Result" title="Repository check summary" />
      <div className="verification-panel">
        <div><StatusText tone={successful ? 'success' : run.outcome === 'failed' ? 'danger' : 'neutral'}>{run.outcome || run.status}</StatusText><h2>{successful ? 'The repository checks passed.' : run.status === 'completed' ? 'The run stopped without passing its checks.' : 'The bounded run is still in progress.'}</h2><p>{run.summary.error || 'Public repository checks are evidence, but they are not hidden independent verification.'}</p></div>
        <dl className="key-grid">
          <KeyValue label="Memory condition">{run.memory_mode}</KeyValue>
          <KeyValue label="Adapter policy">{run.adapter_policy}</KeyValue>
          <KeyValue label="Comparable">{run.comparable ? 'Yes' : 'No'}</KeyValue>
          <KeyValue label="Tokens">{usage ? `${usage.tokens_in} in / ${usage.tokens_out} out` : 'Not recorded'}</KeyValue>
          <KeyValue label="Started">{formatDate(run.started)}</KeyValue>
          <KeyValue label="Completed">{formatDate(run.completed)}</KeyValue>
        </dl>
      </div>
    </section>
    <section className="workspace-section">
      <SectionHeading eyebrow="Routing" title="Model and adapter path" />
      <div className="record-list">
        {(run.summary.routing || []).map((route, index) => <article className="record-row" key={`${route.adapter}-${index}`}><div><strong>{route.tier || route.adapter}</strong><p>{route.model || route.status || 'Configured adapter'}</p></div><StatusText>{route.reason || route.adapter}</StatusText></article>)}
        {!run.summary.routing?.length && <p className="record-note">Routing evidence appears after inference begins.</p>}
      </div>
    </section>
    <section className="workspace-section">
      <SectionHeading eyebrow="Evidence" title="Reproducible artifacts" />
      <div className="destination-list"><EvidenceLink to={`/runs/${run.id}/trace`}>Ordered repository events</EvidenceLink></div>
      <div className="artifact-list">
        {artifacts.map(artifact => <details className="artifact-record" key={artifact.name} open={artifact.name === 'diff-summary.json'}><summary><span>{artifact.name}</span><StatusText>{artifact.media_type}</StatusText></summary><pre>{artifact.content || 'No content recorded.'}</pre><small>SHA-256 {artifact.digest}</small></details>)}
        {!artifacts.length && <p className="record-note">Artifacts are written when the run reaches a terminal state.</p>}
      </div>
    </section>
  </>
}

function FixtureRunView({ run }: { run: RunRecord }) {
  return <>
    <section className="workspace-section"><SectionHeading eyebrow="Result" title="Verification summary" /><div className="verification-panel"><div><StatusText tone={run.verified ? 'success' : 'danger'}>{run.verified ? 'Verified' : 'Not verified'}</StatusText><h2>{run.verified ? 'Visible and held-out checks passed.' : 'The run did not satisfy the complete verifier.'}</h2><p>{run.error || 'Inspect the trace to see attempts and verifier output.'}</p></div><dl className="key-grid"><KeyValue label="Condition">{run.arm}</KeyValue><KeyValue label="Status">{run.status}</KeyValue><KeyValue label="Attempts">{run.attempts} / {run.budget}</KeyValue><KeyValue label="Duration">{run.duration_ms == null ? 'Not recorded' : `${run.duration_ms} ms`}</KeyValue><KeyValue label="Tokens">{run.tokens_in} in / {run.tokens_out} out</KeyValue><KeyValue label="Completed">{formatDate(run.completed)}</KeyValue></dl></div></section>
    <section className="workspace-section"><SectionHeading eyebrow="Evidence" title="Inspect the record" /><div className="destination-list"><EvidenceLink to={`/runs/${run.id}/trace`}>Ordered trace events</EvidenceLink><EvidenceLink to={`/verses/${run.id}`}>Attempt Verses</EvidenceLink>{run.memory_ids.map(memoryId => <EvidenceLink key={memoryId} to={`/memory/${memoryId}`}>Memory {shortId(memoryId)}</EvidenceLink>)}</div><dl className="technical-record"><KeyValue label="Run ID"><code>{run.id}</code></KeyValue><KeyValue label="Configuration digest"><code>{run.config_digest || 'Not recorded'}</code></KeyValue><KeyValue label="Winning operation">{run.winning_op || 'None'}</KeyValue></dl></section>
  </>
}

export function RunDetailPage({ runId }: { runId: string }) {
  const repositoryRun = runId.startsWith('repo_run_')
  const coding = useResource(() => repositoryRun ? coreApi.codingRun(runId) : Promise.resolve(null), [runId, repositoryRun])
  const artifacts = useResource(() => repositoryRun ? coreApi.codingArtifacts(runId) : Promise.resolve([]), [runId, repositoryRun])
  const fixtures = useResource(() => repositoryRun ? Promise.resolve([]) : coreApi.runs(), [runId, repositoryRun])
  const fixture = fixtures.data?.find(item => item.id === runId)

  useEffect(() => {
    if (!repositoryRun || !coding.data || coding.data.status === 'completed') return
    const timer = window.setInterval(() => { void coding.reload(); void artifacts.reload() }, 1500)
    return () => window.clearInterval(timer)
  }, [repositoryRun, coding.data?.status, coding.reload, artifacts.reload])

  const loading = repositoryRun ? coding.loading : fixtures.loading
  const error = repositoryRun ? coding.error : fixtures.error
  const found = repositoryRun ? coding.data : fixture
  return <>
    <PageIntro eyebrow="Run evidence" title={found ? found.task_id : 'Inspect one run.'} description="Status and evidence come from Core. A model answer alone never counts as completion." image="/media/painted-signal.jpg" imageAlt="Abstract painted layers" mascot={repositoryRun ? '/mascot/point.svg' : undefined} label={shortId(runId, 22)} />
    <AsyncState loading={loading} error={error} empty={!found} emptyTitle="Run not found" emptyBody="The run may belong to another database or may no longer be available." onRetry={repositoryRun ? coding.reload : fixtures.reload}>
      {repositoryRun && coding.data ? <CodingRunView run={coding.data} artifacts={artifacts.data || []} /> : fixture ? <FixtureRunView run={fixture} /> : null}
    </AsyncState>
  </>
}
