import { AppShell } from './components/AppShell'
import { ProductShell } from './components/ProductShell'
import { useResource } from './hooks/useResource'
import { coreApi } from './lib/api'
import { matchPath, usePathname } from './lib/router'
import { EvaluationDetailPage } from './pages/EvaluationDetailPage'
import { EvaluationsPage } from './pages/EvaluationsPage'
import { AgentBuilderPage } from './pages/AgentBuilderPage'
import { MemoryDetailPage } from './pages/MemoryDetailPage'
import { MemoryPage } from './pages/MemoryPage'
import { LandingPage } from './pages/LandingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { EvidencePage } from './pages/product/EvidencePage'
import { LoopPage } from './pages/product/LoopPage'
import { ProductHomePage } from './pages/product/ProductHomePage'
import { RunDetailPage } from './pages/RunDetailPage'
import { RunsPage } from './pages/RunsPage'
import { SkillDetailPage } from './pages/SkillDetailPage'
import { SkillsPage } from './pages/SkillsPage'
import { TaskComposerPage } from './pages/TaskComposerPage'
import { TracePage } from './pages/TracePage'
import { VersePage } from './pages/VersePage'

function StudioRoute({ pathname }: { pathname: string }) {
  const trace = matchPath(pathname, '/runs/:runId/trace')
  if (trace) return <TracePage runId={trace.runId} />

  const run = matchPath(pathname, '/runs/:runId')
  if (run) return <RunDetailPage runId={run.runId} />

  const evaluation = matchPath(pathname, '/evaluations/:evaluationId')
  if (evaluation) return <EvaluationDetailPage evaluationId={evaluation.evaluationId} />

  const memory = matchPath(pathname, '/memory/:memoryId')
  if (memory) return <MemoryDetailPage memoryId={memory.memoryId} />

  const skill = matchPath(pathname, '/skills/:skillId')
  if (skill) return <SkillDetailPage skillId={skill.skillId} />

  const verse = matchPath(pathname, '/verses/:verseId')
  if (verse) return <VersePage verseId={verse.verseId} />

  if (pathname === '/agents/new') return <AgentBuilderPage />
  if (pathname === '/tasks/new') return <TaskComposerPage />
  if (pathname === '/runs') return <RunsPage />
  if (pathname === '/evaluations') return <EvaluationsPage />
  if (pathname === '/memory') return <MemoryPage />
  if (pathname === '/skills') return <SkillsPage />
  return <NotFoundPage />
}

function StudioApp({ pathname }: { pathname: string }) {
  const health = useResource(coreApi.health, [])
  return <AppShell pathname={pathname} health={health.data}><StudioRoute pathname={pathname} /></AppShell>
}

function ProductApp({ pathname }: { pathname: string }) {
  const page = pathname === '/loop' ? <LoopPage /> : pathname === '/evidence' ? <EvidencePage /> : <ProductHomePage />
  return <ProductShell pathname={pathname}>{page}</ProductShell>
}

export default function App() {
  const pathname = usePathname()
  if (pathname === '/') return <LandingPage />
  if (pathname === '/product' || pathname === '/loop' || pathname === '/evidence') return <ProductApp pathname={pathname} />
  return <StudioApp pathname={pathname} />
}
