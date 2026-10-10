import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from '../components/Icon'
import { usePageMeta } from '../lib/pageMeta'

type EntryKind = 'knowledge' | 'memory' | 'context'
type EditorMode = 'about' | EntryKind

interface AgentDraft {
  name: string
  purpose: string
}

interface KnowledgeEntry {
  id: string
  kind: EntryKind
  title: string
  content: string
  source: string
  sample?: boolean
}

const storageKey = 'multiverse.agent-builder.v2'
const emptyDraft: AgentDraft = { name: '', purpose: '' }
const sampleEntries: KnowledgeEntry[] = [
  { id: 'sample-knowledge', kind: 'knowledge', title: 'Multiverse direction', content: 'Carry useful experience forward instead of starting each task from zero.', source: 'Product brief', sample: true },
  { id: 'sample-memory', kind: 'memory', title: 'Communication preference', content: 'Explain decisions in plain language before technical detail.', source: 'User correction', sample: true },
  { id: 'sample-context', kind: 'context', title: 'Current work', content: 'Prepare the first personal-agent experience and early-access page.', source: 'Active project', sample: true }
]

const kindCopy: Record<EntryKind, { title: string; description: string }> = {
  knowledge: { title: 'Knowledge', description: 'Stable information for related work.' },
  memory: { title: 'Memory', description: 'Reviewed experience and corrections.' },
  context: { title: 'Context', description: 'Current goals and constraints.' }
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
  const initialRef = useRef(readPrototype())
  const [draft, setDraft] = useState<AgentDraft>(initialRef.current.draft)
  const [entries, setEntries] = useState<KnowledgeEntry[]>(initialRef.current.entries)
  const [editorMode, setEditorMode] = useState<EditorMode>('about')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [agentName, setAgentName] = useState('')
  const [agentPurpose, setAgentPurpose] = useState('')
  const [entryTitle, setEntryTitle] = useState('')
  const [entryContent, setEntryContent] = useState('')
  const [entrySource, setEntrySource] = useState('')
  const [message, setMessage] = useState('Example records are shown until you replace them.')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dialogTriggerRef = useRef<HTMLElement | null>(null)
  usePageMeta('Build a personal agent — Multiverse', 'Create a compact foundation of purpose, knowledge, memory, and current context.', false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (dialogOpen && !dialog.open) dialog.showModal()
    if (!dialogOpen && dialog.open) dialog.close()
  }, [dialogOpen])

  const openEditor = (mode: EditorMode) => {
    dialogTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setEditorMode(mode)
    if (mode === 'about') {
      setAgentName(draft.name)
      setAgentPurpose(draft.purpose)
    } else {
      setEntryTitle('')
      setEntryContent('')
      setEntrySource('')
    }
    setDialogOpen(true)
  }

  const closeEditor = () => {
    setDialogOpen(false)
    window.setTimeout(() => dialogTriggerRef.current?.focus(), 0)
  }

  const submitEditor = (event: FormEvent) => {
    event.preventDefault()
    if (editorMode === 'about') {
      if (!agentName.trim() || !agentPurpose.trim()) return
      setDraft({ name: agentName.trim(), purpose: agentPurpose.trim() })
      setMessage('Agent name and purpose updated in this browser prototype.')
      closeEditor()
      return
    }
    if (!entryTitle.trim() || !entryContent.trim()) return
    setEntries(current => [...current, {
      id: `local-${Date.now()}`,
      kind: editorMode,
      title: entryTitle.trim(),
      content: entryContent.trim(),
      source: entrySource.trim() || 'Added in Studio'
    }])
    setMessage(`${kindCopy[editorMode].title} added to this browser prototype.`)
    closeEditor()
  }

  const removeEntry = (id: string) => {
    setEntries(current => current.filter(entry => entry.id !== id))
    setMessage('Entry removed from this browser prototype.')
  }

  const saveAgent = () => {
    localStorage.setItem(storageKey, JSON.stringify({ draft, entries }))
    setMessage('Agent draft saved in this browser. No runtime is connected yet.')
  }

  const modeTitle = editorMode === 'about' ? 'About the agent' : kindCopy[editorMode].title
  const currentEntries = editorMode === 'about' ? [] : entries.filter(entry => entry.kind === editorMode)

  return <>
    <section className="agent-compact-intro" aria-labelledby="agent-builder-title">
      <div>
        <p className="eyebrow">Personal agent</p>
        <h1 id="agent-builder-title">Build one agent, step by step.</h1>
        <p className="lede">Add only what gives the agent a clearer purpose and useful experience to carry forward.</p>
      </div>
      <figure className="agent-compact-guide">
        <div className="agent-compact-mascot" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}mascot/point.svg`} alt="" width="640" height="760" /></div>
        <figcaption><strong>Keep the foundation small.</strong><span>You can add or replace each part later.</span></figcaption>
      </figure>
    </section>

    <section className="agent-sequence" aria-labelledby="agent-sequence-title">
      <div className="agent-sequence-head">
        <div><p className="section-kicker">Agent foundation</p><h2 id="agent-sequence-title">Four short steps</h2></div>
        <button className="button primary" type="button" onClick={saveAgent}>Save draft</button>
      </div>

      <div className="agent-step-list">
        <button className="agent-step" type="button" onClick={() => openEditor('about')}>
          <span className="agent-step-number">01</span>
          <span className="agent-step-copy"><strong>About</strong><small>{draft.name ? `${draft.name} — ${draft.purpose}` : 'Name the agent and give it one clear purpose.'}</small></span>
          <span className="agent-step-state">{draft.name ? 'Added' : 'Add'}</span>
          <Icon name="plus" />
        </button>
        {(Object.keys(kindCopy) as EntryKind[]).map((kind, index) => {
          const grouped = entries.filter(entry => entry.kind === kind)
          const preview = grouped[0]
          return <button className="agent-step" type="button" key={kind} onClick={() => openEditor(kind)}>
            <span className="agent-step-number">0{index + 2}</span>
            <span className="agent-step-copy"><strong>{kindCopy[kind].title}</strong><small>{preview ? `${preview.title} — ${preview.content}` : kindCopy[kind].description}</small></span>
            <span className="agent-step-state">{grouped.length} {grouped.length === 1 ? 'entry' : 'entries'}</span>
            <Icon name="plus" />
          </button>
        })}
      </div>
      <p className="agent-sequence-status" role="status" aria-live="polite">{message}</p>
    </section>

    <dialog ref={dialogRef} className="agent-compact-dialog" aria-labelledby="agent-editor-title" onCancel={event => { event.preventDefault(); closeEditor() }} onClose={() => setDialogOpen(false)}>
      <form onSubmit={submitEditor}>
        <div className="agent-compact-dialog-head">
          <div><p className="eyebrow">{editorMode === 'about' ? 'Step 01' : `Add ${modeTitle.toLowerCase()}`}</p><h2 id="agent-editor-title">{modeTitle}</h2></div>
          <button className="agent-compact-dialog-close" type="button" onClick={closeEditor} aria-label="Close editor"><Icon name="close" /></button>
        </div>

        {editorMode === 'about' ? <>
          <label className="field"><span>Agent name</span><input autoFocus value={agentName} onChange={event => setAgentName(event.target.value)} placeholder="A short name" /></label>
          <label className="field"><span>Purpose</span><input value={agentPurpose} onChange={event => setAgentPurpose(event.target.value)} placeholder="What should it help with?" /></label>
        </> : <>
          <label className="field"><span>Title</span><input autoFocus value={entryTitle} onChange={event => setEntryTitle(event.target.value)} placeholder="Short label" /></label>
          <label className="field"><span>{editorMode === 'context' ? 'Current detail' : 'What should it carry forward?'}</span><textarea value={entryContent} onChange={event => setEntryContent(event.target.value)} rows={3} placeholder={kindCopy[editorMode].description} /></label>
          <label className="field"><span>Source <small>Optional</small></span><input value={entrySource} onChange={event => setEntrySource(event.target.value)} placeholder="Where did this come from?" /></label>
        </>}

        <div className="agent-dialog-actions">
          <button className="button primary" type="submit" disabled={editorMode === 'about' ? !agentName.trim() || !agentPurpose.trim() : !entryTitle.trim() || !entryContent.trim()}>{editorMode === 'about' ? 'Save about' : `Add ${modeTitle.toLowerCase()}`}</button>
          <button className="button secondary" type="button" onClick={closeEditor}>Cancel</button>
        </div>

        {currentEntries.length > 0 && <div className="agent-existing-entries">
          <p>{modeTitle} already added</p>
          {currentEntries.map(entry => <div key={entry.id}><span><strong>{entry.title}</strong><small>{entry.sample ? 'Example' : entry.source}</small></span><button type="button" onClick={() => removeEntry(entry.id)}>Remove</button></div>)}
        </div>}
      </form>
    </dialog>
  </>
}
