import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from '../components/Icon'
import { SectionHeading, StatusText } from '../components/Common'
import { usePageMeta } from '../lib/pageMeta'

type EntryKind = 'knowledge' | 'memory' | 'context'

interface AgentDraft {
  name: string
  purpose: string
  outcome: string
  boundaries: string
}

interface KnowledgeEntry {
  id: string
  kind: EntryKind
  title: string
  content: string
  source: string
  sample?: boolean
}

const storageKey = 'multiverse.agent-builder.v1'
const emptyDraft: AgentDraft = { name: '', purpose: '', outcome: '', boundaries: '' }
const sampleEntries: KnowledgeEntry[] = [
  {
    id: 'sample-knowledge',
    kind: 'knowledge',
    title: 'Multiverse direction',
    content: 'Personal agents carry useful experience forward instead of starting each task from zero.',
    source: 'Product brief',
    sample: true
  },
  {
    id: 'sample-memory',
    kind: 'memory',
    title: 'Communication preference',
    content: 'Explain decisions in plain language before introducing technical detail.',
    source: 'User correction',
    sample: true
  },
  {
    id: 'sample-context',
    kind: 'context',
    title: 'Current work',
    content: 'Prepare the first personal-agent experience and its early-access page.',
    source: 'Active project',
    sample: true
  }
]

const kindCopy: Record<EntryKind, { title: string; description: string }> = {
  knowledge: { title: 'Knowledge', description: 'Stable information the agent can use across related work.' },
  memory: { title: 'Memory', description: 'Reviewed experience, corrections, and strategies from previous work.' },
  context: { title: 'Context', description: 'Current goals, constraints, and project state that may change.' }
}

function readPrototype() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}') as { draft?: AgentDraft; entries?: KnowledgeEntry[] }
    return { draft: { ...emptyDraft, ...saved.draft }, entries: saved.entries?.length ? saved.entries : sampleEntries }
  } catch {
    return { draft: emptyDraft, entries: sampleEntries }
  }
}

export function AgentBuilderPage() {
  const initial = readPrototype()
  const [draft, setDraft] = useState<AgentDraft>(initial.draft)
  const [entries, setEntries] = useState<KnowledgeEntry[]>(initial.entries)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [entryKind, setEntryKind] = useState<EntryKind>('knowledge')
  const [entryTitle, setEntryTitle] = useState('')
  const [entryContent, setEntryContent] = useState('')
  const [entrySource, setEntrySource] = useState('')
  const [message, setMessage] = useState('Example records are shown until you replace them with your own.')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const dialogTriggerRef = useRef<HTMLElement | null>(null)
  usePageMeta('Build a personal agent — Multiverse', 'Define a personal agent and organize the knowledge, memory, and current context it can use.', false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (dialogOpen && !dialog.open) dialog.showModal()
    if (!dialogOpen && dialog.open) dialog.close()
  }, [dialogOpen])

  const updateDraft = <K extends keyof AgentDraft>(key: K, value: AgentDraft[K]) => {
    setDraft(current => ({ ...current, [key]: value }))
  }

  const openAdd = (kind: EntryKind = 'knowledge') => {
    dialogTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : addButtonRef.current
    setEntryKind(kind)
    setDialogOpen(true)
  }

  const closeAdd = () => {
    setDialogOpen(false)
    window.setTimeout(() => dialogTriggerRef.current?.focus(), 0)
  }

  const addEntry = (event: FormEvent) => {
    event.preventDefault()
    if (!entryTitle.trim() || !entryContent.trim()) return
    const entry: KnowledgeEntry = {
      id: `local-${Date.now()}`,
      kind: entryKind,
      title: entryTitle.trim(),
      content: entryContent.trim(),
      source: entrySource.trim() || 'Added in Studio'
    }
    setEntries(current => [...current, entry])
    setEntryTitle('')
    setEntryContent('')
    setEntrySource('')
    setMessage(`${kindCopy[entryKind].title} added to this browser prototype.`)
    closeAdd()
  }

  const removeEntry = (id: string) => {
    setEntries(current => current.filter(entry => entry.id !== id))
    setMessage('Entry removed from this browser prototype.')
  }

  const saveAgent = (event: FormEvent) => {
    event.preventDefault()
    localStorage.setItem(storageKey, JSON.stringify({ draft, entries }))
    setMessage('Agent draft saved in this browser. No agent runtime is connected yet.')
  }

  return <>
    <section className="agent-builder-intro" aria-labelledby="agent-builder-title">
      <div>
        <p className="eyebrow">Personal agent</p>
        <h1 id="agent-builder-title">Build the foundation it can carry forward.</h1>
        <p className="lede">Describe the agent, then organize what it knows, what it has learned, and what matters right now.</p>
      </div>
      <figure className="agent-builder-guide">
        <div className="agent-builder-mascot" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}mascot/point.svg`} alt="" width="640" height="760" />
        </div>
        <figcaption><strong>Start with a clear purpose.</strong><span>Add only the experience and context that help this agent act well.</span></figcaption>
      </figure>
    </section>

    <form className="agent-builder-form" onSubmit={saveAgent}>
      <section className="agent-about" aria-label="About this agent">
        <SectionHeading eyebrow="01" title="About this agent" />
        <div className="agent-about-fields">
          <label className="field"><span>Agent name</span><input value={draft.name} onChange={event => updateDraft('name', event.target.value)} placeholder="Give this agent a clear name" /></label>
          <label className="field"><span>Purpose</span><textarea value={draft.purpose} onChange={event => updateDraft('purpose', event.target.value)} rows={4} placeholder="What should this agent help with?" /></label>
          <label className="field"><span>Successful outcome</span><textarea value={draft.outcome} onChange={event => updateDraft('outcome', event.target.value)} rows={4} placeholder="What should improve when this agent uses experience well?" /></label>
          <label className="field"><span>Boundaries</span><textarea value={draft.boundaries} onChange={event => updateDraft('boundaries', event.target.value)} rows={4} placeholder="What must the agent avoid, confirm, or leave to you?" /></label>
        </div>
      </section>

      <section className="agent-knowledge" aria-label="Knowledge and experience">
        <SectionHeading
          eyebrow="02"
          title="Knowledge and experience"
          action={<button ref={addButtonRef} className="button primary" type="button" onClick={() => openAdd()}><Icon name="plus" />Add knowledge</button>}
        />
        <p className="agent-section-copy">Knowledge, memory, and context have different lifetimes. Keep them separate so the agent can use each one appropriately.</p>

        <div className="agent-knowledge-ledger">
          {(Object.keys(kindCopy) as EntryKind[]).map(kind => {
            const grouped = entries.filter(entry => entry.kind === kind)
            return <section className="agent-knowledge-group" key={kind} aria-labelledby={`agent-${kind}-title`}>
              <header>
                <div><h3 id={`agent-${kind}-title`}>{kindCopy[kind].title}</h3><p>{kindCopy[kind].description}</p></div>
                <button className="agent-add-kind" type="button" onClick={() => openAdd(kind)} aria-label={`Add ${kindCopy[kind].title.toLowerCase()}`}><Icon name="plus" /></button>
              </header>
              {grouped.length ? <ul>
                {grouped.map(entry => <li key={entry.id}>
                  <div className="agent-entry-copy"><span className="agent-entry-meta">{entry.sample ? 'Example' : entry.source}</span><strong>{entry.title}</strong><p>{entry.content}</p></div>
                  <button className="agent-remove-entry" type="button" onClick={() => removeEntry(entry.id)}>Remove</button>
                </li>)}
              </ul> : <button className="agent-empty-row" type="button" onClick={() => openAdd(kind)}><Icon name="plus" /><span>Add the first {kindCopy[kind].title.toLowerCase()} entry</span></button>}
            </section>
          })}
        </div>
      </section>

      <div className="form-actions agent-builder-actions">
        <button className="button primary" type="submit">Save agent draft</button>
        <span className="form-hint" role="status" aria-live="polite">{message}</span>
      </div>
    </form>

    <dialog
      ref={dialogRef}
      className="agent-knowledge-dialog"
      aria-labelledby="add-knowledge-title"
      onCancel={event => { event.preventDefault(); closeAdd() }}
      onClose={() => setDialogOpen(false)}
    >
      <form onSubmit={addEntry}>
        <div className="agent-dialog-head">
          <div><p className="eyebrow">Agent foundation</p><h2 id="add-knowledge-title">Add an entry</h2></div>
          <button className="agent-dialog-close" type="button" onClick={closeAdd} aria-label="Close add entry dialog"><Icon name="close" /></button>
        </div>
        <label className="select-field"><span>Entry type</span><select value={entryKind} onChange={event => setEntryKind(event.target.value as EntryKind)}><option value="knowledge">Knowledge</option><option value="memory">Memory</option><option value="context">Context</option></select></label>
        <label className="field"><span>Title</span><input autoFocus value={entryTitle} onChange={event => setEntryTitle(event.target.value)} placeholder="Short, specific label" /></label>
        <label className="field"><span>Content</span><textarea value={entryContent} onChange={event => setEntryContent(event.target.value)} rows={5} placeholder="What should the agent know or carry forward?" /></label>
        <label className="field"><span>Source</span><input value={entrySource} onChange={event => setEntrySource(event.target.value)} placeholder="Document, correction, project, or person" /></label>
        <div className="form-actions"><button className="button primary" type="submit" disabled={!entryTitle.trim() || !entryContent.trim()}>Add entry</button><button className="button secondary" type="button" onClick={closeAdd}>Cancel</button></div>
      </form>
    </dialog>
  </>
}
