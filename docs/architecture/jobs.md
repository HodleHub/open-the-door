# Jobs and the outbox

An HTTP response can be lost after a financial operation is accepted. Make recovery
independent of that request by persisting an operation and outbox event together.

## Worker contract

A worker claims a job with a lease, loads the scoped operation, verifies that the
next transition is allowed, and checks whether an external reference already exists.
It then performs the step or reconciles its existing outcome. Commit the new state
and any ledger effect atomically before acknowledging the job.

Use a durable queue/store in the generated application. In-memory promises,
process-global SDK event listeners and request-level locks cannot survive a process
restart and cannot prove exactly-once external execution.

## Retry policy

| Situation                    | Action                                    |
| ---------------------------- | ----------------------------------------- |
| Read-only transient failure  | Bounded backoff with jitter               |
| Rate limit                   | Honor retry guidance and cap concurrency  |
| Invalid evidence/ownership   | Stop; require corrected authorized input  |
| Lost submission response     | Mark unknown and reconcile                |
| Duplicate job                | Load existing state and return its result |
| Expired quote before signing | Requote and obtain new user approval      |

## Outbox recovery

Scan unapplied outbox rows after restart. Use a deterministic event ID and record
delivery progress; consumers must still be idempotent. A lease expiry can lead to
duplicate processing, so combine leases with atomic state transitions and stable
provider correlation IDs.

Define a reconciliation schedule for pending and unknown operations. Alert using
opaque operation references and stable codes. See [observability](../operations/observability.md)
and [operation lifecycle](operation-lifecycle.md).
