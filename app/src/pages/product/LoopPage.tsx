import { useState } from 'react'
import { MediaRail, type RailCard } from '../../components/MediaRail'
import { Link } from '../../components/Link'

const steps: Array<RailCard & { detail: string }> = [
  {
    id: 'task',
    index: '01',
    title: 'Task',
    summary: 'Set the outcome, budget, permissions, and checks.',
    detail: 'Name the repository change, what may stay the same, and how the result will be judged. If there is no check, a person has to review it.',
    image: '/media/painted-signal.jpg',
    alt: 'Abstract coral, moss, and blue painted landscape',
    tone: 'light',
    mascot: '/mascot/welcome.svg'
  },
  {
    id: 'execute',
    index: '02',
    title: 'Execute',
    summary: 'Run one bounded attempt and keep the trace.',
    detail: 'Record the attempts, tool results, errors, timing, and token use. The trace is the source. It is not itself a lesson.',
    image: '/media/story-ribbons.jpg',
    alt: 'Lavender and peach paper forms unfolding in sequence',
    tone: 'light',
    mascot: '/mascot/point.svg'
  },
  {
    id: 'verify',
    index: '03',
    title: 'Verify',
    summary: 'Count success only when the checks pass.',
    detail: 'Visible checks and hidden checks both have to pass before a fixture run is verified. Agreement inside the model does not replace that result.',
    image: '/media/sky-portal.jpg',
    alt: 'A sculptural doorway among soft blue clouds',
    tone: 'light',
    mascot: '/mascot/thinking.svg'
  },
  {
    id: 'memory',
    index: '04',
    title: 'Memory',
    summary: 'Review the lesson, its source, and its limits.',
    detail: 'A candidate lesson keeps its source run, scope, and expiry. It stays out of later tasks until a person approves it.',
    image: '/media/mascot-field.jpg',
    alt: 'A small standing guide waving from a green hill under a peach and lavender sky',
    tone: 'light'
  },
  {
    id: 'evaluate',
    index: '05',
    title: 'Evaluate',
    summary: 'Compare memory with a matched baseline.',
    detail: 'Run the same held-out tasks with and without reviewed memory. Hold the budget constant, then report success, regressions, and cost.',
    image: '/media/green-orbit.jpg',
    alt: 'A pale point circling through a deep green field',
    tone: 'dark',
    mascot: '/mascot/celebrate.svg'
  }
]

export function LoopPage() {
  const [selected, setSelected] = useState(steps[0].id)
  const step = steps.find(item => item.id === selected) ?? steps[0]

  return <>
    <header className="pub-page-head">
      <p className="eyebrow">Execution loop</p>
      <h1>Move from a task to reusable evidence.</h1>
      <p className="pub-lede">Task, execute, record, verify, extract, retrieve, adapt, then check again. This page explains the loop. It does not start a run.</p>
    </header>

    <section className="pub-section pub-section-first" aria-labelledby="loop-steps-title">
      <div className="pub-heading">
        <div>
          <p className="eyebrow">Five stages</p>
          <h2 id="loop-steps-title">Choose a stage to read what it keeps.</h2>
        </div>
      </div>
      <MediaRail cards={steps} onSelect={setSelected} />
      <div className="pub-step">
        <div aria-live="polite">
          <p className="eyebrow">{step.index} / {step.title}</p>
          <h2 id="loop-step-title">{step.summary}</h2>
          <p>{step.detail}</p>
        </div>
        <Link className="button primary" to="/tasks/new">Start a task</Link>
      </div>
    </section>
  </>
}
