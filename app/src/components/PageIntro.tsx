import type { ReactNode } from 'react'

interface PageIntroProps {
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  mascot?: string
  label: string
  actions?: ReactNode
}

export function PageIntro({ eyebrow, title, description, image, imageAlt, mascot, label, actions }: PageIntroProps) {
  return <section className="page-intro" aria-labelledby="page-title">
    <div className="page-intro-copy">
      <p className="eyebrow">{eyebrow}</p>
      <h1 id="page-title">{title}</h1>
      <p className="lede">{description}</p>
      {actions && <div className="intro-actions">{actions}</div>}
    </div>
    <figure className="orientation-media">
      <img src={image} alt={imageAlt} width="960" height="1200" />
      <figcaption>{label}</figcaption>
      {mascot && <span className="orientation-mascot" aria-hidden="true"><img src={mascot} alt="" /></span>}
    </figure>
  </section>
}
