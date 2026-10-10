import { useEffect, useState } from 'react'

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

export function appHref(path: string) {
  if (/^(https?:|mailto:)/.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${normalized}` || '/'
}

function currentRoute() {
  const pathname = window.location.pathname
  if (!basePath) return pathname
  if (pathname === basePath || pathname === `${basePath}/`) return '/'
  return pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname
}

export function navigate(path: string) {
  const href = appHref(path)
  if (window.location.pathname === href) return
  window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'auto' })
}

export function usePathname() {
  const [pathname, setPathname] = useState(currentRoute)

  useEffect(() => {
    const update = () => setPathname(currentRoute())
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])

  return pathname
}

export function matchPath(pathname: string, pattern: string) {
  const keys: string[] = []
  const source = pattern
    .split('/')
    .map(part => {
      if (!part.startsWith(':')) return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      keys.push(part.slice(1))
      return '([^/]+)'
    })
    .join('/')
  const match = pathname.match(new RegExp(`^${source}/?$`))
  if (!match) return null
  return Object.fromEntries(keys.map((key, index) => [key, decodeURIComponent(match[index + 1])]))
}
