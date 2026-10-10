(function () {
  const json = async (path, options) => {
    const response = await fetch(path, options)
    const body = await response.json().catch(() => null)
    if (!response.ok) throw new Error((body && body.detail) || `Request failed (${response.status})`)
    return body
  }

  const write = path => json(path, {
    method: 'POST',
    headers: { 'X-Multiverse-Actor': 'studio-local' }
  })

  window.MultiverseCoreClient = {
    health: () => json('/api/health'),
    tasks: () => json('/api/tasks'),
    runs: () => json('/api/runs'),
    memory: () => json('/api/memory'),
    jobs: () => json('/api/jobs'),
    job: id => json(`/api/jobs/${encodeURIComponent(id)}`),
    trace: id => json(`/api/runs/${encodeURIComponent(id)}/trace`),
    verses: id => json(`/api/runs/${encodeURIComponent(id)}/verses`),
    learn: () => write('/api/learn'),
    evaluate: budget => write(`/api/eval?budget=${encodeURIComponent(budget || 3)}`),
    experiment: () => write('/api/experiment'),
    approve: id => write(`/api/memory/${encodeURIComponent(id)}/approve`),
    reject: id => write(`/api/memory/${encodeURIComponent(id)}/reject`),
    demote: id => write(`/api/memory/${encodeURIComponent(id)}/demote`)
  }
})()
