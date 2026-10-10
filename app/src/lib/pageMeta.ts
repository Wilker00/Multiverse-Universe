import { useEffect } from 'react'

function meta(name: string, content: string) {
  let node = document.querySelector(`meta[name="${name}"]`)
  if (!node) {
    node = document.createElement('meta')
    node.setAttribute('name', name)
    document.head.appendChild(node)
  }
  node.setAttribute('content', content)
}

export function usePageMeta(title: string, description: string, index: boolean) {
  useEffect(() => {
    document.title = title
    meta('description', description)
    meta('robots', index ? 'index,follow' : 'noindex,nofollow')
  }, [title, description, index])
}
