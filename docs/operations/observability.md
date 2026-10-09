# Observe behavior without leaking data

Use deliberate event fields rather than serializing arbitrary objects. Financial
and KYC APIs frequently return sensitive values in both success and error payloads.

## Useful signals

Track operation kind, normalized status/error code, adapter version, duration,
retry count, queue age and aggregate pending/unknown counts. Use opaque operation
references only in controlled diagnostic systems with retention/access policies.
Avoid identifiers in unbounded metric labels.

## Excluded payloads

Never emit identity documents, extracted fields, biometric results, request bodies,
headers, full provider URLs, invoices, preimages, seeds, signed links or complete SDK
and webhook events. A redaction function that removes `password` but prints the
rest of a provider response is not sufficient.

## Alerts

Alert on unknown operations older than the expected reconciliation window,
settlement mismatches, duplicate-effect prevention, outbox backlog, invalid webhook
authentication and unavailable signing/evidence services. Explain the action using
safe codes and link to a restricted operator view.

## Diagnostics and tests

Use synthetic fixtures to reproduce failures. Capture logs during tests and assert
that sensitive fixture fields and raw provider error strings are absent. Do not
attach production payloads to issues to make diagnosis easier.

Keep customer-facing messages simple: pending, unavailable, needs correction or
confirmed. Technical details belong in authorized operator tools. Read
[PII](../security/pii.md), [provider contract](../providers/contracts.md) and
[Woovi reconciliation](../providers/woovi/reconciliation.md).
