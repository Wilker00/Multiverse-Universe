import { useState, type FormEvent } from 'react'
import { Icon } from '../components/Icon'
import { usePageMeta } from '../lib/pageMeta'
import { coreApi } from '../lib/api'

const githubUrl = import.meta.env.VITE_GITHUB_URL || 'https://github.com/'

export function LandingPage() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  usePageMeta('Multiverse — Join early access', 'Join the early list for Multiverse, a workbench for agents that learn from verified experience.', true)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (state === 'submitting') return
    setState('submitting')
    setMessage('')
    try {
      await coreApi.joinWaitlist(email, website)
      setState('success')
      setMessage('You are on the list. We will share the next build with you.')
      setEmail('')
    } catch (reason) {
      setState('error')
      setMessage(reason instanceof Error ? reason.message : 'Signup is unavailable right now. Please try again.')
    }
  }

  return <div className="signup-shell">
    <main className="signup-main">
      <div className="signup-stage" aria-hidden="true">
        <img src={`${import.meta.env.BASE_URL}mascot/welcome.svg`} alt="" width="640" height="760" />
      </div>
      <div className="signup-content">
        <p className="signup-wordmark">multiverse</p>
        <h1>Agents that remember what worked.</h1>
        <p className="signup-copy">Join the early list for the next Multiverse build.</p>
        <form className="signup-form" onSubmit={submit}>
          <label className="sr-only" htmlFor="signup-email">Email address</label>
          <div className="signup-controls">
            <input id="signup-email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="Email address" disabled={state === 'submitting'} />
            <button className="button primary" type="submit" disabled={state === 'submitting'}>{state === 'submitting' ? 'Joining' : 'Join early access'}</button>
          </div>
          <label className="signup-trap" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label>
          <p className={`signup-message is-${state}`} role="status" aria-live="polite">{message}</p>
        </form>
        <a className="signup-github" href={githubUrl} target="_blank" rel="noreferrer">Check GitHub <Icon name="arrow" size={15} /></a>
      </div>
    </main>
  </div>
}
