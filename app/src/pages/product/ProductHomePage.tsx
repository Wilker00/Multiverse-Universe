import { Link } from '../../components/Link'
import { Icon } from '../../components/Icon'

const capabilities = [
  ['/loop', 'document', 'Task contract', 'Name the outcome, the permissions, the budget, and the checks.', 'Required'],
  ['/loop', 'history', 'Evidence trace', 'Keep the attempts, tool results, timing, and token use.', 'Append-only'],
  ['/evidence', 'memory', 'Memory gate', 'A lesson stays unused until the checks and a person both allow it.', 'Manual approval']
] as const

const rules = [
  ['Memory is not learning', 'Reuse', 'A stored lesson matters only when a later checked task improves.'],
  ['Agreement is not truth', 'Verification', 'Tests and outside evidence outrank a model’s confidence.'],
  ['A skill is not a capability', 'Evaluation', 'A procedure earns trust on tasks it has not seen before.']
]

export function ProductHomePage() {
  return <>
    <section className="pub-spotlight" aria-labelledby="product-title-phone">
      <div className="pub-spotlight-art">
        <img src="/media/soft-companion.jpg" alt="A soft blue face with two bright eyes on a pale field" width="960" height="1200" />
        <span className="pub-spotlight-label">Verified experience for agent tasks</span>
        <span className="pub-spotlight-mascot" aria-hidden="true"><img src="/mascot/portrait.svg" alt="" /></span>
      </div>
      <p className="eyebrow">Persistent agent execution</p>
      <h1 id="product-title-phone">Agents should not start every task from zero.</h1>
      <p className="pub-lede">Keep the record of a checked task, then test whether that experience helps the next one under the same budget.</p>
      <div className="pub-actions">
        <Link className="button primary" to="/tasks/new">Open Studio</Link>
        <Link className="button secondary" to="/evidence">Read the evidence</Link>
      </div>
    </section>

    <section className="pub-hero" aria-labelledby="product-title">
      <div className="pub-hero-copy">
        <p className="eyebrow">Persistent agent execution</p>
        <h1 id="product-title">Agents should not start every task from zero.</h1>
        <p className="pub-lede">Multiverse records what a run actually proved, retrieves only reviewed experience, and tests whether reuse helps the next task under the same budget.</p>
        <div className="pub-actions">
          <Link className="button primary" to="/tasks/new">Open Studio</Link>
          <Link className="button secondary" to="/evidence">Read the evidence</Link>
        </div>
      </div>
      <div className="pub-hero-stage">
        <figure className="pub-hero-media">
          <img src="/media/soft-companion.jpg" alt="A soft blue face with two bright eyes on a pale field" width="960" height="1200" />
          <figcaption>
            <span className="pub-chip">Multiverse</span>
            <span className="pub-chip">Local evaluation wedge</span>
          </figcaption>
        </figure>
        <aside className="pub-mascot-note">
          <span className="pub-mascot-stage" aria-hidden="true"><img src="/mascot/welcome.svg" alt="" /></span>
          <p><span className="eyebrow">Boundary</span><strong>Start with a check.</strong><span>If a result cannot be checked, a person reviews it. The system does not invent proof.</span></p>
        </aside>
      </div>
    </section>

    <section className="pub-section" aria-labelledby="capability-title">
      <div className="pub-heading">
        <div>
          <p className="eyebrow">Where to look</p>
          <h2 id="capability-title">Three records, each with a job.</h2>
        </div>
        <p>Start with the task, keep the trace, and hold memory until someone reviews it.</p>
      </div>
      <div className="pub-capability-shell">
        {capabilities.map(([to, icon, title, copy, state]) => <Link className="pub-capability" to={to} key={title}>
          <span className="pub-capability-icon"><Icon name={icon} size={18} /></span>
          <span className="pub-capability-copy"><strong>{title}</strong><small>{copy}</small></span>
          <span className="pub-capability-state">{state}</span>
        </Link>)}
      </div>
    </section>

    <section className="pub-section" aria-labelledby="rules-title">
      <div className="pub-heading">
        <div>
          <p className="eyebrow">Product rules</p>
          <h2 id="rules-title">Every claim needs an evidence path.</h2>
        </div>
        <p>The interface keeps stored experience, a reusable procedure, and a demonstrated result apart.</p>
      </div>
      <ol className="pub-rules">
        {rules.map(([label, title, copy]) => <li key={title}><span>{label}</span><strong>{title}</strong><p>{copy}</p></li>)}
      </ol>
    </section>

    <section className="pub-closing" aria-labelledby="closing-title">
      <figure>
        <img src="/media/green-orbit.jpg" alt="A pale point circling through a deep green field" width="960" height="1200" loading="lazy" />
      </figure>
      <div>
        <p className="eyebrow">Start with the evidence</p>
        <h2 id="closing-title">Inspect one task before expanding the platform.</h2>
        <p className="pub-lede">Studio shows the task, the run, the memory review, and the comparison. It labels synthetic results as synthetic.</p>
        <Link className="button primary" to="/tasks/new">Open Studio</Link>
      </div>
    </section>
  </>
}
