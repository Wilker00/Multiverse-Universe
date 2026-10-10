import { AsyncState, EvidenceLink, SectionHeading, StatusText, formatDate } from '../components/Common'
import { PageIntro } from '../components/PageIntro'
import { useResource } from '../hooks/useResource'
import { coreApi } from '../lib/api'

export function RunsPage() {
  const fixtures = useResource(coreApi.runs, [])
  const repositories = useResource(coreApi.codingRuns, [])
  const loading = fixtures.loading || repositories.loading
  const error = fixtures.error || repositories.error
  const empty = !fixtures.data?.length && !repositories.data?.length
  const reload = () => { void fixtures.reload(); void repositories.reload() }

  return <>
    <PageIntro eyebrow="Run history" title="Review what happened and what passed." description="Repository work and curated evaluations keep their budgets, conditions, results, and evidence together." image="/media/sky-portal.jpg" imageAlt="A sculptural doorway among soft clouds" mascot="/mascot/celebrate.svg" label="Recorded paths" />
    <section className="workspace-section" aria-labelledby="runs-list-title">
      <SectionHeading eyebrow="Core records" title="Repository runs" action={<button className="button secondary" type="button" onClick={reload}>Refresh</button>} />
      <AsyncState loading={loading} error={error} empty={empty} emptyTitle="No measured runs yet" emptyBody="Inspect a repository task or run the bundled evaluation fixtures." onRetry={reload}>
        <div className="record-list" id="runs-list-title">
          {repositories.data?.map(run => <article className="record-row run-row" key={run.id}><div className="record-primary"><strong>{run.task_id}</strong><p>{formatDate(run.created)} · repository task</p></div><div className="record-metric"><span>Memory</span><strong>{run.memory_mode}</strong></div><div className="record-metric"><span>Adapter</span><strong>{run.adapter_policy}</strong></div><StatusText tone={run.outcome === 'checks_passed' ? 'success' : run.outcome === 'failed' ? 'danger' : 'neutral'}>{run.outcome || run.status}</StatusText><EvidenceLink to={`/runs/${run.id}`}>Inspect run</EvidenceLink></article>)}
          {fixtures.data?.slice().reverse().map(run => <article className="record-row run-row" key={run.id}><div className="record-primary"><strong>{run.task_id}</strong><p>{formatDate(run.started)} · {run.agent}</p></div><div className="record-metric"><span>Condition</span><strong>{run.arm}</strong></div><div className="record-metric"><span>Attempts</span><strong>{run.attempts} / {run.budget}</strong></div><StatusText tone={run.verified ? 'success' : run.status === 'failed' ? 'danger' : 'neutral'}>{run.verified ? 'verified' : run.status}</StatusText><EvidenceLink to={`/runs/${run.id}`}>Inspect run</EvidenceLink></article>)}
        </div>
      </AsyncState>
    </section>
  </>
}
