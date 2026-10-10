import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

export interface RailCard {
  id: string
  index: string
  title: string
  summary: string
  image: string
  alt: string
  tone: 'light' | 'dark'
  mascot?: string
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function MediaRail({ cards, onSelect }: { cards: RailCard[]; onSelect: (id: string) => void }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = () => {
    const node = scroller.current
    if (!node) return
    setAtStart(node.scrollLeft <= 2)
    setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 2)
  }

  useEffect(() => {
    update()
    const node = scroller.current
    node?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      node?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [cards.length])

  const move = (direction: -1 | 1) => {
    const node = scroller.current
    const card = node?.querySelector<HTMLElement>('.pub-media-card')
    if (!node || !card) return
    const styles = window.getComputedStyle(node)
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 12
    node.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reducedMotion() ? 'auto' : 'smooth' })
  }

  return <div className="pub-rail-block">
    <div className="pub-rail-controls">
      <button className="pub-icon-button" type="button" aria-label="Previous steps" disabled={atStart} onClick={() => move(-1)}>
        <Icon name="arrowLeft" size={16} />
      </button>
      <button className="pub-icon-button" type="button" aria-label="Next steps" disabled={atEnd} onClick={() => move(1)}>
        <Icon name="arrow" size={16} />
      </button>
    </div>
    <div className="pub-rail-clip">
      <div className="pub-rail" ref={scroller} tabIndex={0} aria-label="Execution loop">
        {cards.map((card, index) => <button key={card.id} className="pub-media-card" type="button" data-card-mode={card.id} data-tone={card.tone} onClick={() => onSelect(card.id)}>
          <img src={card.image} alt={card.alt} width="960" height="1200" loading={index === 0 ? undefined : 'lazy'} />
          <span className="pub-media-shade" />
          <span className="pub-media-index">{card.index} / {card.title}</span>
          <span className="pub-media-action" aria-hidden="true"><Icon name="arrow" size={16} /></span>
          <span className="pub-media-info">
            {card.mascot && <span className="pub-media-figure" aria-hidden="true"><img src={card.mascot} alt="" /></span>}
            <span className="pub-media-copy"><strong>{card.title}</strong><span>{card.summary}</span></span>
          </span>
        </button>)}
      </div>
    </div>
  </div>
}
