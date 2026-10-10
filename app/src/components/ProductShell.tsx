import { useEffect, useState, type ReactNode } from 'react'
import { usePageMeta } from '../lib/pageMeta'
import { BoundaryDialog } from './BoundaryDialog'
import { Icon } from './Icon'
import { Link } from './Link'

const pages = {
  '/product': {
    title: 'Multiverse - Verified memory for agent tasks',
    description: 'Multiverse records a checked agent task and tests whether reviewed experience helps a later task under the same budget.'
  },
  '/loop': {
    title: 'Multiverse - Execution loop',
    description: 'Follow a Multiverse task from the outcome and checks through the trace, review, and a matched comparison.'
  },
  '/evidence': {
    title: 'Multiverse - Evidence contract',
    description: 'Read how Multiverse compares memory with a matched baseline, and which results are still unproven.'
  }
} as const

const nav = [
  ['/product', 'Product', 'Home', 'home'],
  ['/loop', 'Loop', 'Loop', 'grid'],
  ['/evidence', 'Evidence', 'Evidence', 'layers']
] as const

export function ProductShell({ pathname, children }: { pathname: string; children: ReactNode }) {
  const page = pages[pathname as keyof typeof pages] ?? pages['/product']
  const [menuOpen, setMenuOpen] = useState(false)
  const [boundaryOpen, setBoundaryOpen] = useState(false)
  const active = (path: string) => pathname === path
  usePageMeta(page.title, page.description, true)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return <div className="pub-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="pub-header">
      <div className="pub-header-inner">
        <Link className="wordmark pub-mark" to="/" aria-label="Multiverse home">multiverse</Link>
        <button className="menu-button pub-menu" type="button" aria-expanded={menuOpen} aria-controls="product-navigation" onClick={() => setMenuOpen(value => !value)}>
          <Icon name={menuOpen ? 'close' : 'menu'} />
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
        <nav className={menuOpen ? 'pub-nav is-open' : 'pub-nav'} id="product-navigation" aria-label="Product">
          {nav.map(([path, label]) => <Link key={path} to={path} aria-current={active(path) ? 'page' : undefined}>{label}</Link>)}
          <Link className="pub-nav-studio" to="/tasks/new">Open Studio</Link>
        </nav>
        <div className="pub-tools">
          <button className="pub-boundary" type="button" aria-label="Open product boundary" onClick={() => setBoundaryOpen(true)}>
            <Icon name="info" size={16} />
            <span>Product boundary</span>
          </button>
          <Link className="button primary pub-studio" to="/tasks/new">Open Studio</Link>
        </div>
      </div>
    </header>
    <main id="main-content" className="pub-main" tabIndex={-1}>{children}</main>
    <footer className="pub-footer">
      <div className="pub-footer-grid">
        <div>
          <Link className="wordmark" to="/" aria-label="Multiverse home">multiverse</Link>
          <p>Verified experience for bounded agent tasks.</p>
          <p className="pub-footer-meta">Core 0.3.0 · Local evaluation wedge</p>
        </div>
        <div>
          <p className="pub-footer-heading">Product</p>
          <Link to="/product">Overview</Link>
          <Link to="/loop">Execution loop</Link>
          <Link to="/evidence">Evidence contract</Link>
        </div>
        <div>
          <p className="pub-footer-heading">Studio</p>
          <Link to="/tasks/new">New task</Link>
          <Link to="/runs">Runs</Link>
          <Link to="/memory">Memory</Link>
          <Link to="/evaluations">Evaluations</Link>
        </div>
      </div>
      <p className="pub-footer-note">No product analytics are installed. Studio routes stay out of search.</p>
    </footer>
    <nav className="pub-tabs" aria-label="Phone">
      {nav.map(([path, , label, icon]) => <Link key={path} to={path} aria-current={active(path) ? 'page' : undefined}><Icon name={icon} size={16} /><span>{label}</span></Link>)}
      <Link to="/tasks/new"><Icon name="path" size={16} /><span>Studio</span></Link>
    </nav>
    <BoundaryDialog open={boundaryOpen} onClose={() => setBoundaryOpen(false)} />
  </div>
}
