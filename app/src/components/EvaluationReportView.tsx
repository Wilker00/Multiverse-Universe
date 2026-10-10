import type { EvaluationReport } from '../types'
import { KeyValue, SectionHeading, StatusText, shortId } from './Common'

export function readEvaluationReport(result: Record<string, unknown> | null | undefined) {
  const report = result?.report
  if (!report || typeof report !== 'object') return null
  return report as EvaluationReport
}

function cost(value: number | null) {
  return value == null ? 'Not available' : `$${value.toFixed(5)}`
}

export function EvaluationReportView({ report }: { report: EvaluationReport }) {
  const baselineRate = report.n_eval ? Math.round(report.baseline.passed / report.n_eval * 100) : 0
  const treatmentRate = report.n_eval ? Math.round(report.treatment.passed / report.n_eval * 100) : 0

  return <div className="evaluation-report">
    {report.simulated && <div className="boundary-note" role="note"><StatusText>Harness result</StatusText><p>This evaluation uses the deterministic stand-in agent. It checks the measurement system, not product capability.</p></div>}

    <div className="comparison-record" aria-label="Evaluation comparison">
      <div className="comparison-head"><span>Condition</span><span>Verified</span><span>Attempts</span><span>Cost per verified task</span></div>
      <div className="comparison-row"><strong>Stateless baseline</strong><span>{report.baseline.passed} / {report.n_eval} ({baselineRate}%)</span><span>{report.baseline.attempts}</span><span>{cost(report.baseline.cost_per_verified)}</span></div>
      <div className="comparison-row"><strong>Verified memory</strong><span>{report.treatment.passed} / {report.n_eval} ({treatmentRate}%)</span><span>{report.treatment.attempts}</span><span>{cost(report.treatment.cost_per_verified)}</span></div>
    </div>

    <div className="report-section">
      <SectionHeading eyebrow="Paired result" title="What changed task by task" />
      <dl className="key-grid">
        <KeyValue label="Both passed">{report.paired.both}</KeyValue>
        <KeyValue label="Memory only">{report.paired.only_treatment}</KeyValue>
        <KeyValue label="Baseline only">{report.paired.only_baseline}</KeyValue>
        <KeyValue label="Neither passed">{report.paired.neither}</KeyValue>
        <KeyValue label="Sign-test value">{report.sign_test_p.toFixed(3)}</KeyValue>
        <KeyValue label="Promoted memories">{report.promoted}</KeyValue>
      </dl>
    </div>

    <div className="report-section">
      <SectionHeading eyebrow="Limits" title="Read before interpreting" />
      <ul className="plain-list">
        {report.notes.length ? report.notes.map(note => <li key={note}>{note}</li>) : <li>No additional evaluator notes were recorded.</li>}
        <li>{report.leakage.length ? `Possible task overlap: ${report.leakage.join(', ')}.` : 'No train and evaluation task overlap was detected.'}</li>
      </ul>
    </div>

    <details className="technical-disclosure">
      <summary>Dataset fingerprints</summary>
      <dl className="technical-record">
        <KeyValue label="Training set"><code>{shortId(report.dataset.train_digest, 24)}</code></KeyValue>
        <KeyValue label="Evaluation set"><code>{shortId(report.dataset.eval_digest, 24)}</code></KeyValue>
        <KeyValue label="Attempt budget">{report.budget}</KeyValue>
      </dl>
    </details>
  </div>
}
