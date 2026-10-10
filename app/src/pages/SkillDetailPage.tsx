import { KeyValue, SectionHeading, StatusText } from '../components/Common'
import { Link } from '../components/Link'
import { PageIntro } from '../components/PageIntro'

export function SkillDetailPage({ skillId }: { skillId: string }) {
  return <>
    <PageIntro eyebrow="Skill contract" title="No fabricated registry record." description="This route reserves the stable detail shape, but Core does not yet provide a skill manifest for this identifier." image="/media/story-ribbons.jpg" imageAlt="Layered paper forms unfolding in sequence" label={skillId} actions={<Link className="button secondary" to="/skills">Back to skills</Link>} />
    <div className="boundary-note" role="note"><StatusText>Unavailable</StatusText><p>The identifier in the URL is not evidence that a skill exists or has passed evaluation.</p></div>
    <section className="workspace-section">
      <SectionHeading eyebrow="Planned record" title="Fields the backend must supply" />
      <dl className="technical-record">
        <KeyValue label="Identity">Name, immutable version, checksum, owner, and scope</KeyValue>
        <KeyValue label="Procedure">Prerequisites, instructions, inputs, outputs, and failure behavior</KeyValue>
        <KeyValue label="Permissions">Exact tools, filesystem paths, network destinations, and secret references</KeyValue>
        <KeyValue label="Evidence">Visible tests, held-out evaluations, regressions, and measured cost</KeyValue>
        <KeyValue label="Lifecycle">Draft, approved, deprecated, retired, and rollback history</KeyValue>
      </dl>
    </section>
  </>
}
