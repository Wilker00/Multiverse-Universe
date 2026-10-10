import { useEffect, useState, type FormEvent } from 'react'
import { coreApi } from '../lib/api'
import { navigate } from '../lib/router'
import type { RepositoryInspection, TaskDraft } from '../types'
import { SectionHeading, StatusText } from '../components/Common'
import { PageIntro } from '../components/PageIntro'

const draftKey = 'multiverse.task-draft.v2'
const initialDraft: TaskDraft = {
  objective: '',
  repositoryUrl: '',
  commitSha: '',
  acceptanceChecks: '',
  allowNetwork: true,
  allowSecrets: false,
  maxAttempts: 5,
  maxMinutes: 10
}

function readDraft() {
  try {
    return { ...initialDraft, ...JSON.parse(localStorage.getItem(draftKey) || '{}') } as TaskDraft
  } catch {
    return initialDraft
  }
}

export function TaskComposerPage() {
  const [draft, setDraft] = useState<TaskDraft>(readDraft)
  const [inspection, setInspection] = useState<RepositoryInspection | null>(null)
  const [planAccepted, setPlanAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const commitValid = /^[0-9a-f]{40}$/i.test(draft.commitSha.trim())
  const canInspect = draft.repositoryUrl.startsWith('https://') && commitValid && !busy
  const canRun = inspection?.status === 'ready' && planAccepted && draft.objective.trim().length >= 12 && !busy

  useEffect(() => {
    if (!inspection || !['pending', 'running'].includes(inspection.status)) return
    const timer = window.setInterval(async () => {
      try {
        const current = await coreApi.inspection(inspection.id)
        setInspection(current)
        if (current.status === 'ready') setMessage('Inspection ready. Review the immutable execution plan before starting.')
        if (current.status === 'failed') setMessage(current.error || 'Repository inspection failed.')
      } catch (reason) {
        setMessage(reason instanceof Error ? reason.message : 'Could not refresh the inspection.')
      }
    }, 1200)
    return () => window.clearInterval(timer)
  }, [inspection?.id, inspection?.status])

  const update = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) => {
    setDraft(current => ({ ...current, [key]: value }))
    if (key === 'repositoryUrl' || key === 'commitSha') {
      setInspection(null)
      setPlanAccepted(false)
    }
  }

  const inspect = async () => {
    if (!canInspect) return
    setBusy(true)
    setMessage('Starting the bounded repository inspection.')
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft))
      const created = await coreApi.inspectRepository(draft.repositoryUrl.trim(), draft.commitSha.trim())
      setInspection(created)
      setMessage('Inspection queued. Core is checking the pinned repository without executing it.')
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Could not start the inspection.')
    } finally {
      setBusy(false)
    }
  }

  const startRun = async (event: FormEvent) => {
    event.preventDefault()
    if (!canRun || !inspection?.execution_plan) return
    setBusy(true)
    setMessage('Creating the task and bounded run.')
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft))
      const task = await coreApi.createCodingTask({
        inspection_id: inspection.id,
        objective: draft.objective.trim(),
        acceptance_notes: draft.acceptanceChecks.trim(),
        accepted_plan_digest: inspection.execution_plan.digest,
        max_attempts: draft.maxAttempts,
        max_seconds: draft.maxMinutes * 60,
        allow_registry_network: draft.allowNetwork,
        allow_secrets: false
      })
      const run = await coreApi.startCodingRun(task.id)
      navigate(`/runs/${run.id}`)
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Could not start the run.')
      setBusy(false)
    }
  }

  const plan = inspection?.execution_plan

  return <>
    <PageIntro
      eyebrow="New repository task"
      title="Inspect first. Approve the boundary. Then run."
      description="Pin a public repository to one commit, review the detected checks and permissions, and let Core preserve the evidence."
      image="/media/painted-signal.jpg"
      imageAlt="Abstract painted layers in coral, moss, and blue"
      mascot="/mascot/welcome.svg"
      label="Bounded coding path"
    />

    <div className="boundary-note" role="note">
      <StatusText>Nebius and NVIDIA</StatusText>
      <p>Nemotron provides inference through Nebius Token Factory. OpenShell isolates execution. Credentials never enter the browser, repository, trace, or sandbox.</p>
    </div>

    <form className="task-form" onSubmit={startRun} noValidate>
      <section className="form-section" aria-labelledby="repository-title">
        <SectionHeading eyebrow="01" title="Pinned repository" />
        <div className="field-grid" id="repository-title">
          <label className="field"><span>Public HTTPS Git URL</span><input type="url" value={draft.repositoryUrl} onChange={event => update('repositoryUrl', event.target.value)} placeholder="https://github.com/owner/repository.git" autoComplete="off" /></label>
          <label className="field"><span>Full commit SHA</span><input value={draft.commitSha} onChange={event => update('commitSha', event.target.value)} placeholder="40 hexadecimal characters" autoComplete="off" spellCheck={false} /><small>Branches and tags are not accepted because they can move.</small></label>
        </div>
        <div className="form-actions compact-actions">
          <button className="button secondary" type="button" onClick={inspect} disabled={!canInspect}>Inspect repository</button>
          {inspection && <StatusText tone={inspection.status === 'ready' ? 'success' : inspection.status === 'failed' ? 'danger' : 'neutral'}>{inspection.status}</StatusText>}
        </div>
      </section>

      {plan && <section className="form-section plan-review" aria-labelledby="plan-title">
        <SectionHeading eyebrow="02" title="Execution plan" />
        <div className="verification-panel" id="plan-title">
          <div><StatusText tone="success">Detected {plan.stack}</StatusText><h2>Review the exact commands before execution.</h2><p>Dependency access is temporary. Editing and checks run with network denied.</p></div>
          <dl className="technical-record">
            <div className="key-value"><dt>Install</dt><dd>{plan.install_commands.length ? plan.install_commands.map(command => <code key={command.join(' ')}>{command.join(' ')}</code>) : 'No install command'}</dd></div>
            <div className="key-value"><dt>Checks</dt><dd>{plan.check_commands.map(command => <code key={command.join(' ')}>{command.join(' ')}</code>)}</dd></div>
            <div className="key-value"><dt>Runtime image</dt><dd><code>{plan.image}</code></dd></div>
            <div className="key-value"><dt>Run network</dt><dd>{plan.run_network}</dd></div>
            <div className="key-value"><dt>Plan digest</dt><dd><code>{plan.digest}</code></dd></div>
          </dl>
        </div>
        <label className="permission-row plan-consent"><input type="checkbox" checked={planAccepted} onChange={event => setPlanAccepted(event.target.checked)} /><span><strong>Accept this immutable plan</strong><small>If the repository or command plan changes, Core requires another inspection.</small></span><StatusText>{planAccepted ? 'Accepted' : 'Review'}</StatusText></label>
      </section>}

      <section className="form-section" aria-labelledby="outcome-title">
        <SectionHeading eyebrow="03" title="Outcome" />
        <label className="field field-wide" id="outcome-title"><span>Required repository change</span><textarea value={draft.objective} onChange={event => update('objective', event.target.value)} rows={5} placeholder="Describe the observable behavior that must change and what must remain unchanged." /></label>
        <label className="field field-wide"><span>Acceptance notes</span><textarea value={draft.acceptanceChecks} onChange={event => update('acceptanceChecks', event.target.value)} rows={4} placeholder="Add reviewer context. Core still executes only the checks in the accepted plan." /><small>These notes do not grant the agent permission to execute additional commands.</small></label>
      </section>

      <section className="form-section" aria-labelledby="permission-title">
        <SectionHeading eyebrow="04" title="Permissions and budget" />
        <div className="permission-list" id="permission-title">
          <label className="permission-row"><input type="checkbox" checked readOnly disabled /><span><strong>Disposable task workspace</strong><small>Repository access stays inside a fresh OpenShell sandbox.</small></span><StatusText>Required</StatusText></label>
          <label className="permission-row"><input type="checkbox" checked={draft.allowNetwork} onChange={event => update('allowNetwork', event.target.checked)} /><span><strong>Registry access during setup</strong><small>Limited to the package registries shown in the plan, then removed.</small></span><StatusText>{draft.allowNetwork ? 'Setup only' : 'Denied'}</StatusText></label>
          <label className="permission-row"><input type="checkbox" checked={false} readOnly disabled /><span><strong>Secret access</strong><small>Unsupported in the MVP. Provider credentials remain outside the sandbox.</small></span><StatusText>Denied</StatusText></label>
        </div>
        <div className="field-grid">
          <label className="field"><span>Maximum attempts</span><input type="number" min="1" max="5" value={draft.maxAttempts} onChange={event => update('maxAttempts', Number(event.target.value))} /></label>
          <label className="field"><span>Maximum minutes</span><input type="number" min="1" max="60" value={draft.maxMinutes} onChange={event => update('maxMinutes', Number(event.target.value))} /></label>
        </div>
      </section>

      <div className="form-actions">
        <button className="button primary" type="submit" disabled={!canRun}>{busy ? 'Working' : 'Start bounded run'}</button>
        <span className="form-hint" aria-live="polite">{message || 'Inspect and accept the execution plan before starting.'}</span>
      </div>
    </form>
  </>
}
