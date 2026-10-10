import { AsyncState, SectionHeading, formatDate } from '../components/Common'
import { Link } from '../components/Link'
import { PageIntro } from '../components/PageIntro'
import { useResource } from '../hooks/useResource'
import { coreApi } from '../lib/api'

export function TracePage({ runId }: { runId: string }) {
  const repositoryRun = runId.startsWith('repo_run_')
  const resource = useResource(() => repositoryRun ? coreApi.codingEvents(runId) : coreApi.trace(runId), [runId, repositoryRun])
  return <>
    <PageIntro eyebrow="Ordered evidence" title="Trace" description="Read the task, retrieval, attempts, failures, and verifier result in the order Core recorded them." image="/media/story-ribbons.jpg" imageAlt="Layered paper forms unfolding in sequence" label="Append-only events" actions={<Link className="button secondary" to={`/runs/${runId}`}>Back to run</Link>} />
    <section className="workspace-section" aria-labelledby="trace-title">
      <SectionHeading eyebrow="Run trace" title="Recorded events" />
      <AsyncState loading={resource.loading} error={resource.error} empty={!resource.data?.length} emptyTitle="No events recorded" emptyBody="This run has no trace events in the current Core database." onRetry={resource.reload}>
        <ol className="trace-list" id="trace-title">
          {resource.data?.map(event => <li key={event.id}><div className="trace-sequence">{String(event.id).padStart(2, '0')}</div><div><div className="trace-head"><strong>{event.kind.replaceAll('_', ' ')}</strong><time>{formatDate(event.ts)}</time></div><pre>{JSON.stringify(event.payload, null, 2)}</pre></div></li>)}
        </ol>
      </AsyncState>
    </section>
  </>
}
