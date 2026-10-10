import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { Link } from './Link'

export function StatusText({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'danger' }) {
  return <span className={`status-text status-${tone}`}>{children}</span>
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="section-heading">
    <div>{eyebrow && <p className="section-kicker">{eyebrow}</p>}<h2>{title}</h2></div>
    {action}
  </div>
}

export function AsyncState({ loading, error, empty, emptyTitle, emptyBody, onRetry, children }: {
  loading: boolean
  error: string
  empty: boolean
  emptyTitle: string
  emptyBody: string
  onRetry?: () => void
  children: ReactNode
}) {
  if (loading) return <div className="state-panel" aria-live="polite"><span className="state-label">Loading</span><h2>Loading current records</h2><p>Studio is asking Core for the latest server-authoritative state.</p></div>
  if (error) return <div className="state-panel" role="alert"><span className="state-label">Core unavailable</span><h2>Could not load this workspace</h2><p>{error}</p>{onRetry && <button className="button secondary" type="button" onClick={onRetry}>Retry</button>}</div>
  if (empty) return <div className="empty-state"><span className="empty-mascot" aria-hidden="true"><img src="/mascot/neutral.svg" alt="" /></span><div><span className="state-label">Empty</span><h2>{emptyTitle}</h2><p>{emptyBody}</p></div></div>
  return <>{children}</>
}

export function KeyValue({ label, children }: { label: string; children: ReactNode }) {
  return <div className="key-value"><dt>{label}</dt><dd>{children}</dd></div>
}

export function EvidenceLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link className="evidence-link" to={to}>{children}<Icon name="arrow" size={15} /></Link>
}

export function formatDate(value?: number | null) {
  if (!value) return 'Not completed'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value * 1000))
}

export function shortId(value: string, size = 12) {
  return value.length > size ? `${value.slice(0, size)}…` : value
}
