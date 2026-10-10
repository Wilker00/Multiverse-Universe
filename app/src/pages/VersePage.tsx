import { AsyncState, SectionHeading, StatusText } from '../components/Common'
import { Link } from '../components/Link'
import { PageIntro } from '../components/PageIntro'
import { useResource } from '../hooks/useResource'
import { coreApi } from '../lib/api'

export function VersePage({ verseId }: { verseId: string }) {
  const resource = useResource(() => coreApi.verses(verseId), [verseId])

  return <>
    <PageIntro eyebrow="Attempt Verses" title="Compare paths without calling them agents." description="Each Verse is an alternative attempt inside one run. The verifier, not the presentation, determines which path succeeded." image="/media/sky-portal.jpg" imageAlt="A sculptural doorway among soft clouds" label="Alternative paths" actions={<Link className="button secondary" to={`/runs/${verseId}`}>Back to run</Link>} />
    <section className="workspace-section" aria-labelledby="verses-title">
      <SectionHeading eyebrow="Recorded attempts" title="Verses" />
      <AsyncState loading={resource.loading} error={resource.error} empty={!resource.data?.length} emptyTitle="No attempts found" emptyBody="This run has no attempt events in the current Core database." onRetry={resource.reload}>
        <ol className="verse-list" id="verses-title">
          {resource.data?.map((attempt, index) => <li key={`${attempt.n ?? index}-${attempt.op ?? 'attempt'}`}>
            <span className="verse-number">{String(attempt.n ?? index + 1).padStart(2, '0')}</span>
            <div><h3>{attempt.op ? attempt.op.replaceAll('_', ' ') : 'Recorded attempt'}</h3><p>{attempt.site || attempt.error || 'No additional attempt note was recorded.'}</p></div>
            <StatusText tone={attempt.hidden_pass ? 'success' : attempt.visible_pass ? 'neutral' : 'danger'}>{attempt.hidden_pass ? 'verified' : attempt.visible_pass ? 'visible check passed' : 'did not pass'}</StatusText>
          </li>)}
        </ol>
      </AsyncState>
    </section>
  </>
}
