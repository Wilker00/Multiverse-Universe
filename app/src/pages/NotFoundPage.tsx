import { Link } from '../components/Link'
import { PageIntro } from '../components/PageIntro'

export function NotFoundPage() {
  return <PageIntro eyebrow="Not found" title="This path is outside the current Studio." description="Return to task setup or use the primary navigation to inspect a connected Core record." image="/media/soft-companion.jpg" imageAlt="Soft abstract forms arranged on a pale field" mascot="/mascot/neutral.svg" label="Unknown path" actions={<Link className="button primary" to="/tasks/new">Go to task setup</Link>} />
}
