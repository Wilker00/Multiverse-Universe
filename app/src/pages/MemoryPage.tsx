import { useMemo, useState } from 'react'
import { AsyncState, EvidenceLink, SectionHeading, StatusText, formatDate, shortId } from '../components/Common'
import { Icon } from '../components/Icon'
import { PageIntro } from '../components/PageIntro'
import { useResource } from '../hooks/useResource'
import { coreApi } from '../lib/api'
import type { MemoryStatus } from '../types'

const statuses: Array<'all' | MemoryStatus> = ['all', 'candidate', 'verified', 'promoted', 'rejected', 'demoted']

export function MemoryPage() {
  const resource = useResource(coreApi.memory, [])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | MemoryStatus>('all')
  const records = useMemo(() => {
    const search = query.trim().toLowerCase()
    return (resource.data || []).filter(record => {
      const matchesStatus = status === 'all' || record.status === status
      const matchesSearch = !search || [record.id, record.text, record.op, record.source_task, ...record.tags].some(value => value.toLowerCase().includes(search))
      return matchesStatus && matchesSearch
    }).reverse()
  }, [query, resource.data, status])

  return <>
    <PageIntro eyebrow="Memory DNA" title="Review experience before it can be reused." description="Every memory stays tied to its source run, scope, evidence, and review history. Stored text is not proof that the system learned." image="/media/mascot-field.jpg" imageAlt="An abstract dark field with a pale figure" mascot="/mascot/point.svg" label="Reviewed experience" />

    <section className="workspace-section" aria-labelledby="memory-title">
      <SectionHeading eyebrow="Core records" title="Memory" action={<button className="button secondary" type="button" onClick={resource.reload}>Refresh</button>} />
      <div className="filter-bar">
        <label className="search-field"><Icon name="search" /><span className="sr-only">Search memory</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search text, task, tag, or ID" /></label>
        <label className="select-field"><span>Status</span><select value={status} onChange={event => setStatus(event.target.value as 'all' | MemoryStatus)}>{statuses.map(item => <option key={item} value={item}>{item === 'all' ? 'All states' : item}</option>)}</select></label>
      </div>
      <AsyncState loading={resource.loading} error={resource.error} empty={!records.length} emptyTitle={resource.data?.length ? 'No memory matches' : 'No memory records yet'} emptyBody={resource.data?.length ? 'Change the search or status filter.' : 'Run the learning job, then review any independently checked candidates.'} onRetry={resource.reload}>
        <div className="record-list" id="memory-title">
          {records.map(memory => <article className="record-row memory-row" key={memory.id}>
            <div className="record-primary"><strong>{memory.text}</strong><p>{memory.source_task} · {formatDate(memory.created)}</p></div>
            <div className="tag-list">{memory.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <StatusText tone={memory.status === 'promoted' ? 'success' : memory.status === 'rejected' || memory.status === 'demoted' ? 'danger' : 'neutral'}>{memory.status}</StatusText>
            <EvidenceLink to={`/memory/${memory.id}`}>Review {shortId(memory.id)}</EvidenceLink>
          </article>)}
        </div>
      </AsyncState>
    </section>
  </>
}
