import { SectionHeading, StatusText } from '../components/Common'
import { Link } from '../components/Link'
import { PageIntro } from '../components/PageIntro'

const lifecycle = [
  ['Draft', 'Define prerequisites, scoped tools, permissions, and a versioned procedure.'],
  ['Test', 'Run visible and held-out checks without changing production behavior.'],
  ['Review', 'Inspect evidence, regressions, costs, and the exact skill version.'],
  ['Approve', 'Allow retrieval only within its declared scope and permission contract.'],
  ['Retire', 'Stop new use while keeping prior runs and provenance inspectable.']
]

export function SkillsPage() {
  return <>
    <PageIntro eyebrow="Skills" title="Version procedures separately from capability." description="A skill packages a repeatable method and its permissions. It becomes trustworthy only after independent evaluation; installation alone proves nothing." image="/media/story-ribbons.jpg" imageAlt="Layered paper forms unfolding in sequence" mascot="/mascot/point.svg" label="Versioned procedures" />
    <div className="boundary-note" role="note"><StatusText>Registry not connected</StatusText><p>Core has no skills API yet. This page documents the product contract without inventing installed skills or evaluation results.</p></div>
    <section className="workspace-section">
      <SectionHeading eyebrow="Lifecycle" title="What a skill must preserve" />
      <ol className="lifecycle-list">{lifecycle.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
    </section>
    <section className="workspace-section">
      <SectionHeading eyebrow="Backend contract" title="Required before connection" />
      <div className="requirement-record"><p>Versioned manifests, immutable checksums, scoped tool permissions, evaluation links, approval history, rollback, and tenant-aware authorization.</p><Link className="evidence-link" to="/skills/registry-contract">Inspect the planned record</Link></div>
    </section>
  </>
}
