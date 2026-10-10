import { useState } from 'react'
import { AsyncState, EvidenceLink, SectionHeading, StatusText, formatDate, shortId } from '../components/Common'
import { PageIntro } from '../components/PageIntro'
import { useResource } from '../hooks/useResource'
import { coreApi } from '../lib/api'

export function EvaluationsPage() {
  const resource = useResource(coreApi.jobs, [])
  const [budget, setBudget] = useState(3)
  const [busy, setBusy] = useState<'evaluation' | 'learning' | ''>('')
  const [actionError, setActionError] = useState('')
  const jobs = resource.data?.filter(job => job.kind === 'evaluation' || job.kind === 'experiment' || job.kind === 'learn') || []

  const start = async (kind: 'evaluation' | 'learning') => {
    setBusy(kind)
    setActionError('')
    try {
      await (kind === 'evaluation' ? coreApi.startEvaluation(budget) : coreApi.startLearning())
      await resource.reload()
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : 'The job could not be started.')
    } finally {
      setBusy('')
    }
  }

  return <>
    <PageIntro eyebrow="Evaluation" title="Measure whether memory actually helps." description="Compare the same held-out tasks with and without reviewed memory. Treat the current synthetic result as a harness check, not a capability claim." image="/media/green-orbit.jpg" imageAlt="Green sculptural forms circling an open center" mascot="/mascot/thinking.svg" label="Paired evidence" />

    <section className="workspace-section">
      <SectionHeading eyebrow="New work" title="Run a bounded check" />
      <div className="action-record">
        <div><h3>Held-out evaluation</h3><p>Runs baseline and memory-treated conditions with the same attempt limit.</p></div>
        <label className="compact-field"><span>Attempts per task</span><input type="number" min="1" max="20" value={budget} onChange={event => setBudget(Number(event.target.value))} /></label>
        <button className="button primary" type="button" disabled={Boolean(busy)} onClick={() => void start('evaluation')}>{busy === 'evaluation' ? 'Starting…' : 'Start evaluation'}</button>
      </div>
      <div className="action-record">
        <div><h3>Build memory candidates</h3><p>Runs the training fixtures and sends independently checked candidates to Memory for review.</p></div>
        <button className="button secondary" type="button" disabled={Boolean(busy)} onClick={() => void start('learning')}>{busy === 'learning' ? 'Starting…' : 'Start learning job'}</button>
      </div>
      {actionError && <p className="inline-error" role="alert">{actionError}</p>}
    </section>

    <section className="workspace-section" aria-labelledby="evaluation-jobs-title">
      <SectionHeading eyebrow="Core records" title="Evaluation work" action={<button className="button secondary" type="button" onClick={resource.reload}>Refresh</button>} />
      <AsyncState loading={resource.loading} error={resource.error} empty={!jobs.length} emptyTitle="No evaluation work yet" emptyBody="Start a bounded evaluation when Core is running." onRetry={resource.reload}>
        <div className="record-list" id="evaluation-jobs-title">
          {jobs.map(job => <article className="record-row job-row" key={job.id}>
            <div className="record-primary"><strong>{job.kind.replaceAll('_', ' ')}</strong><p>{formatDate(job.created)} · <code>{shortId(job.id)}</code></p></div>
            <StatusText tone={job.status === 'completed' ? 'success' : job.status === 'failed' ? 'danger' : 'neutral'}>{job.status}</StatusText>
            {job.kind !== 'learn' && job.status === 'completed' ? <EvidenceLink to={`/evaluations/${job.id}`}>Read report</EvidenceLink> : <span className="record-note">{job.error || 'No report yet'}</span>}
          </article>)}
        </div>
      </AsyncState>
    </section>
  </>
}
