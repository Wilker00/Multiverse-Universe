# Core API Contract Direction

The current `/api/*` routes support a trusted local prototype. Production work begins under `/api/v1` and keeps incompatible changes out of the local adapter.

## First Versioned Operations

| Operation | Method and path | Actor | Success | Required behavior |
| --- | --- | --- | --- | --- |
| Create task | `POST /api/v1/tasks` | Project member | `201` | Validate and persist an immutable task contract; require idempotency key |
| Read task | `GET /api/v1/tasks/{task_id}` | Authorized project member | `200` | Return metadata, not hidden verifier material |
| Start run | `POST /api/v1/tasks/{task_id}/runs` | Authorized operator | `202` | Persist job atomically and return job and run IDs |
| Read run | `GET /api/v1/runs/{run_id}` | Authorized project member | `200` | Return server-authoritative status, budget, result, and evidence links |
| Cancel run | `POST /api/v1/runs/{run_id}/cancel` | Authorized operator | `202` | Be idempotent and preserve partial trace evidence |
| Read trace | `GET /api/v1/runs/{run_id}/events` | Authorized project member | `200` | Cursor paginate immutable ordered events |
| Review memory | `POST /api/v1/memory/{memory_id}/transitions` | Reviewer | `200` | Require expected version, target state, reason, and actor audit |
| Start evaluation | `POST /api/v1/evaluations` | Evaluator | `202` | Pin dataset and configuration digests and require idempotency key |
| Read evaluation | `GET /api/v1/evaluations/{evaluation_id}` | Authorized project member | `200` | Return paired results, regressions, costs, and limitations |

## Task Request

```json
{
  "objective": "Fix the declared repository behavior",
  "repository_snapshot_id": "snap_...",
  "task_family": "repository_bug_fix",
  "acceptance_check_ids": ["check_..."],
  "permission_policy_id": "policy_...",
  "budget": {
    "max_attempts": 3,
    "max_duration_seconds": 300,
    "max_input_tokens": 100000,
    "max_output_tokens": 20000
  }
}
```

Hidden tests, reference solutions, host paths, provider secrets, and raw credentials are never request or response fields.

## Error Contract

Use `application/problem+json` with stable `type`, `title`, `status`, safe `detail`, `instance`, and `correlation_id`. Define distinct problem types for validation, permission denial, version conflict, exhausted budget, sandbox unavailable, missing artifact, and retryable worker failure.

## Concurrency and Retry

- Require an idempotency key for create-task, start-run, and start-evaluation operations.
- Return the original operation for a valid duplicate and reject a reused key with a different request digest.
- Require an expected version for memory and approval transitions.
- Give jobs bounded retries, backoff, timeout, cancellation, stale-lease recovery, and one terminal state.
- Cursor paginate changing collections using stable creation sequence and opaque cursors.

## Authorization

Authorize actor, tenant, project, object, operation, and sensitive fields on every request. Authentication alone is insufficient. Keep Studio unavailable to crawlers and do not use `robots.txt` as access control.
