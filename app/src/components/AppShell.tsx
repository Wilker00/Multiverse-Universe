import { useState, type ReactNode } from 'react'
import { usePageMeta } from '../lib/pageMeta'
import type { Health } from '../types'
import { Icon } from './Icon'
import { Link } from './Link'

const primary = [
  ['/tasks/new', 'New task'],
  ['/runs', 'Runs'],
  ['/memory', 'Memory'],
  ['/evaluations', 'Evaluations']
] as const

export function AppShell({ children, pathname, health }: { children: ReactNode; pathname: string; health: Health | null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  usePageMeta('Multiverse Studio', 'Multiverse Studio for verifiable agent tasks, runs, traces, memory, skills, and evaluations.', false)
  const active = (path: string) => pathname === path || (path !== '/tasks/new' && pathname.startsWith(`${path}/`))
  const close = () => setMenuOpen(false)

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="product-header">
      <div className="header-inner">
        <Link className="wordmark" to="/tasks/new" aria-label="Multiverse Studio home">multiverse</Link>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(value => !value)}>
          <Icon name={menuOpen ? 'close' : 'menu'} />
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
        <nav className={menuOpen ? 'primary-nav is-open' : 'primary-nav'} id="primary-navigation" aria-label="Studio">
          {primary.map(([path, label]) => <Link key={path} to={path} onClick={close} aria-current={active(path) ? 'page' : undefined}>{label}</Link>)}
          <details className="nav-more">
            <summary>More</summary>
            <div className="nav-more-panel">
              <Link to="/skills" onClick={close}>Skills</Link>
            </div>
          </details>
        </nav>
        <div className="service-state" aria-live="polite">
          {health ? `${health.synthetic ? 'Synthetic Core' : 'Core'} ${health.version}` : 'Core unavailable'}
        </div>
      </div>
    </header>
    <main id="main-content" className="app-main" tabIndex={-1}>{children}</main>
    <footer className="app-footer"><span>Multiverse Studio</span><span>Evidence first. Local prototype.</span></footer>
    <nav className="mobile-nav" aria-label="Mobile Studio navigation">
      {primary.map(([path, label], index) => <Link key={path} to={path} aria-current={active(path) ? 'page' : undefined}><Icon name={(['document', 'history', 'memory', 'test'] as const)[index]} /><span>{label === 'New task' ? 'Task' : label}</span></Link>)}
    </nav>
  </>
}
