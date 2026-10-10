import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { appHref, navigate } from '../lib/router'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
}

export function Link({ to, onClick, ...props }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (/^(https?:|mailto:)/.test(to)) return
    event.preventDefault()
    navigate(to)
  }

  return <a href={appHref(to)} onClick={handleClick} {...props} />
}
