import { useState } from 'react'
import { AsyncState, EvidenceLink, KeyValue, SectionHeading, StatusText, formatDate } from '../components/Common'
import { Link } from '../components/Link'
import { PageIntro } from '../components/PageIntro'
import { useResource } from '../hooks/useResource'
import { coreApi } from '../lib/api'
import type { MemoryRecord } from '../types'

export function MemoryDetailPage({ memoryId }: { memoryId: string }) {
  const memories = useResource(coreApi.memory, [memoryId])
  const history = useResource(() => coreApi.memoryLog(memoryId), [memoryId])
  const [busy, setBusy] = useState('')
  const [actionError, setActionError] = useState('')
  const memory = memories.data?.find(item => item.id === memoryId)

  const transition = async (action: 'approve' | 'reject' | 'demote') => {
    setBusy(action)
    setActionError('')
    try {
      let next: MemoryRecord
      if (action === 'approve') next = await coreApi.approveMemory(memoryId)
      else if (action === 'reject') next = await coreApi.rejectMemory(memoryId)
      else next = await coreApi.demoteMemory(memoryId)
      memories.setData((memories.data || []).map(item => item.id === memoryId ? next : item))
      await history.reload()
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : 'The review action failed.')
    } finally {
      setBusy('')
    }
  }

  return <>
    <PageIntro eyebrow="Memory review" title="Check the source, scope, and limits." description="Promote only independently verified experience that can be applied safely within its declared scope." image="/media/mascot-field.jpg" imageAlt="An abstract dark field with a pale figure" label={memoryId} actions={<Link className="button secondary" to="/memory">Back to memory</Link>} />
    <AsyncState loading={memories.loading} error={memories.error} empty={!memory} emptyTitle="Memory not found" emptyBody="This memory is not available in the current Core database." onRetry={memories.reload}>
      {memory && <>
        <section className="workspace-section">
          <SectionHeading eyebrow="Review state" title="Memory record" />
          <div className="memory-statement"><StatusText tone={memory.status === 'promoted' ? 'success' : memory.status === 'rejected' || memory.status === 'demoted' ? 'danger' : 'neutral'}>{memory.status}</StatusText><blockquote>{memory.text}</blockquote><p>Suggested operation: <code>{memory.op}</code></p></div>
          <dl className="technical-record">
            <KeyValue label="Scope"><code>{memory.scope}</code></KeyValue>
            <KeyValue label="Source task">{memory.source_task}</KeyValue>
            <KeyValue label="Version">{memory.version}</KeyValue>
            <KeyValue label="Confidence">{Math.round(memory.confidence * 100)}%</KeyValue>
            <KeyValue label="Created">{formatDate(memory.created)}</KeyValue>
            <KeyValue label="Expires">{formatDate(memory.expires)}</KeyValue>
          </dl>
          <div className="destination-list"><EvidenceLink to={`/runs/${memory.source_run}`}>Inspect source run</EvidenceLink></div>
          <div className="review-actions" aria-label="Memory review actions">
            {memory.status === 'verified' && <button className="button primary" type="button" disabled={Boolean(busy)} onClick={() => void transition('approve')}>{busy === 'approve' ? 'Approving…' : 'Approve for retrieval'}</button>}
            {(memory.status === 'candidate' || memory.status === 'verified' || memory.status === 'demoted') && <button className="button danger" type="button" disabled={Boolean(busy)} onClick={() => void transition('reject')}>{busy === 'reject' ? 'Rejecting…' : 'Reject memory'}</button>}
            {memory.status === 'promoted' && <button className="button danger" type="button" disabled={Boolean(busy)} onClick={() => void transition('demote')}>{busy === 'demote' ? 'Demoting…' : 'Remove from retrieval'}</button>}
            {!['candidate', 'verified', 'promoted', 'demoted'].includes(memory.status) && <p className="form-hint">This state has no further review action.</p>}
          </div>
          {actionError && <p className="inline-error" role="alert">{actionError}</p>}
        </section>

        <section className="workspace-section">
          <SectionHeading eyebrow="Append-only history" title="Review log" />
          <AsyncState loading={history.loading} error={history.error} empty={!history.data?.length} emptyTitle="No review history" emptyBody="Core did not return a transition log for this memory." onRetry={history.reload}>
            <ol className="history-list">{history.data?.map(entry => <li key={entry.id}><time>{formatDate(entry.ts)}</time><div><strong>{entry.from_status ? `${entry.from_status} to ${entry.to_status}` : entry.to_status}</strong><p>{entry.reason}</p><small>Actor: {entry.actor}</small></div></li>)}</ol>
          </AsyncState>
        </section>
      </>}
    </AsyncState>
  </>
}
