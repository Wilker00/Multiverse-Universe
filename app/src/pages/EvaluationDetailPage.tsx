import { AsyncState, KeyValue, SectionHeading, StatusText, formatDate, shortId } from '../components/Common'
import { EvaluationReportView, readEvaluationReport } from '../components/EvaluationReportView'
import { Link } from '../components/Link'
import { PageIntro } from '../components/PageIntro'
import { useResource } from '../hooks/useResource'
import { coreApi } from '../lib/api'

export function EvaluationDetailPage({ evaluationId }: { evaluationId: string }) {
  const resource = useResource(() => coreApi.job(evaluationId), [evaluationId])
  const job = resource.data
  const report = readEvaluationReport(job?.result)

  return <>
    <PageIntro eyebrow="Evaluation report" title="Evidence before conclusions." description="This record preserves the compared conditions, result limits, and dataset fingerprints for one Core job." image="/media/green-orbit.jpg" imageAlt="Green sculptural forms circling an open center" label={shortId(evaluationId, 22)} actions={<Link className="button secondary" to="/evaluations">Back to evaluations</Link>} />
    <AsyncState loading={resource.loading} error={resource.error} empty={!job} emptyTitle="Evaluation not found" emptyBody="This job is not available in the current Core database." onRetry={resource.reload}>
      {job && <section className="workspace-section">
        <SectionHeading eyebrow="Core job" title="Recorded result" />
        <dl className="technical-record compact-record">
          <KeyValue label="Status"><StatusText tone={job.status === 'completed' ? 'success' : job.status === 'failed' ? 'danger' : 'neutral'}>{job.status}</StatusText></KeyValue>
          <KeyValue label="Started">{formatDate(job.started)}</KeyValue>
          <KeyValue label="Completed">{formatDate(job.completed)}</KeyValue>
          <KeyValue label="Job ID"><code>{job.id}</code></KeyValue>
        </dl>
        {report ? <EvaluationReportView report={report} /> : <div className="state-panel"><span className="state-label">Report unavailable</span><h2>{job.status === 'failed' ? 'The evaluation failed.' : 'The evaluation has not completed.'}</h2><p>{job.error || 'Refresh the evaluation list after Core finishes the job.'}</p></div>}
      </section>}
    </AsyncState>
  </>
}
