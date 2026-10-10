import { useRef, useState, type KeyboardEvent } from 'react'
import { Link } from '../../components/Link'
import { StatusText } from '../../components/Common'

const tabs = [
  ['method', 'Method'],
  ['controls', 'Controls'],
  ['limits', 'Limits']
] as const

type TabId = typeof tabs[number][0]

const limits = [
  ['01', 'Language-model improvement', 'Not measured. The local stand-in agent only checks that the harness can score a run.', 'Unproven'],
  ['02', 'Hidden checks on public repositories', 'A public test suite can pass. That result is labeled checks passed, not verified.', 'Separate'],
  ['03', 'Customer demand', 'Repeated use, review burden, and willingness to pay have not been observed.', 'Unobserved'],
  ['04', 'Production authorization', 'Tenant and object permissions are not in this local wedge.', 'Not built']
] as const

export function EvidencePage() {
  const [tab, setTab] = useState<TabId>('method')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = tabs.findIndex(item => item[0] === tab)
    const nextIndex = event.key === 'ArrowRight' ? (current + 1) % tabs.length : event.key === 'ArrowLeft' ? (current - 1 + tabs.length) % tabs.length : -1
    if (nextIndex < 0) return
    event.preventDefault()
    setTab(tabs[nextIndex][0])
    tabRefs.current[nextIndex]?.focus()
  }

  return <article className="pub-research" aria-labelledby="evidence-title">
    <header className="pub-research-head">
      <div className="pub-research-meta">
        <p className="eyebrow">Local harness · Bundled fixtures</p>
        <StatusText>Synthetic evidence</StatusText>
      </div>
      <h1 id="evidence-title">Does reviewed memory help the next task?</h1>
      <p className="pub-research-source">Multiverse Core evaluation contract · <code>0.2.0</code></p>
      <p className="pub-lede">This page states the comparison. It does not report a language-model result.</p>
    </header>

    <div className="pub-research-tabs" role="tablist" aria-label="Evidence views" onKeyDown={onKey}>
      {tabs.map(([id, label], index) => <button
        key={id}
        ref={node => { tabRefs.current[index] = node }}
        id={`evidence-tab-${id}`}
        type="button"
        role="tab"
        aria-selected={tab === id}
        aria-controls={`evidence-panel-${id}`}
        tabIndex={tab === id ? 0 : -1}
        onClick={() => setTab(id)}
      >{label}</button>)}
    </div>

    <div className="pub-research-layout">
      <div className="pub-research-body">
        <div role="tabpanel" id="evidence-panel-method" aria-labelledby="evidence-tab-method" hidden={tab !== 'method'}>
          <p>Compare one run with no memory to one run that may use reviewed memory. Keep the tasks, the attempt limit, and the checks the same. The current local agent is a deterministic stand-in. Its scores test the harness.</p>
          <div className="pub-metrics" aria-label="Corpus shape">
            <div><span>21</span><small>Fixtures</small></div>
            <div><span>13</span><small>Held-out</small></div>
            <div><span>1</span><small>Approval gate</small></div>
          </div>
          <p className="pub-note">These counts describe the fixture set: 8 tasks can teach a candidate and 13 stay held out. They are not success rates.</p>
        </div>
        <div role="tabpanel" id="evidence-panel-controls" aria-labelledby="evidence-tab-controls" hidden={tab !== 'controls'}>
          <p>A fixture run counts as verified only when both kinds of checks pass. The hidden checks stay out of the agent’s view.</p>
          <div className="pub-formula">
            <p aria-label="Visible checks pass and held-out checks pass means the run is verified.">
              <span className="math-term">visible checks pass</span>
              <span className="math-operator">and</span>
              <span className="math-term">held-out checks pass</span>
              <span className="math-operator">means</span>
              <span className="math-term">the run is verified</span>
            </p>
            <span className="math-tag">(1)</span>
          </div>
          <p className="pub-note">A change can pass every visible check and still be wrong. Corpus digests, matched attempt budgets, and append-only events make the local comparison auditable.</p>
        </div>
        <div role="tabpanel" id="evidence-panel-limits" aria-labelledby="evidence-tab-limits" hidden={tab !== 'limits'}>
          <ol className="pub-limits">
            {limits.map(([index, title, copy, state]) => <li key={index}>
              <span>{index}</span>
              <div><strong>{title}</strong><p>{copy}</p></div>
              <StatusText>{state}</StatusText>
            </li>)}
          </ol>
        </div>
      </div>
      <aside className="pub-eval" aria-label="What a fair comparison must report">
        <h2>What a fair comparison must report</h2>
        <ol>
          <li><span>01</span><p>Held-out tasks that passed, with the task count beside the rate.</p></li>
          <li><span>02</span><p>Tasks that got worse after memory was added.</p></li>
          <li><span>03</span><p>The cost of each verified success, under the same budget.</p></li>
        </ol>
      </aside>
    </div>
    <p className="pub-next"><Link className="button secondary" to="/evaluations">Inspect evaluation jobs</Link></p>
  </article>
}
