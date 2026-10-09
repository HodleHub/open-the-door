# Woovi reconciliation

Use provider statements/status to compare external outcomes with application
operations and ledger entries. Webhooks improve latency; reconciliation repairs
lost notifications and ambiguous submissions.

## Periodic process

Find pending/unknown operations within a bounded window. Resolve each stored
provider/account/environment binding, read its authoritative resource and validate
correlation, amount, direction and final state. Apply an allowed transition and
its balanced journal effect atomically using a unique posting key.

For broader statement reconciliation, follow the current account/transaction API
reference linked from [Woovi Developers](https://developers.woovi.com/). Process
records inside a restricted service. Do not export live statements to this
repository or public issue attachments.

For BaaS statements, the [balance/statement guide](https://developers.woovi.com/docs/baas/movimentando-saldo)
documents `GET /api/v1/statement` with bounded date windows and pagination using
the account's AppID. Keep statement records in restricted processing storage;
only normalized operation/journal effects reach the application core.

For outgoing payments, [payment lookup](https://developers.woovi.com/docs/payment/payment-how-to-list)
documents `GET /api/v1/payment/{id}` where the identifier is the original
`correlationID`. Its list endpoint supports bounded time windows and pagination
and requires the documented listing scope. Verify the terminal result, expected
amount and source account before a final posting.

## Exceptions

| Observation                            | Action                                                          |
| -------------------------------------- | --------------------------------------------------------------- |
| Provider settled, local pending        | Apply verified idempotent settlement                            |
| Local settled, provider inconsistent   | Quarantine for restricted investigation                         |
| No resource after ambiguous submission | Follow provider-supported lookup/recovery; preserve uncertainty |
| Refund pending                         | Keep separate refund operation until confirmed                  |
| Duplicate provider event               | Acknowledge without a second effect                             |
| Amount/account mismatch                | Stop automatic processing and alert with safe code              |

## Validation

Interrupt execution after provider acceptance but before local persistence. Restart
and reconcile to one result. Replay the completion event and verify one journal
posting. Include changed credentials/account scope and a late callback for an
expired charge. Read [jobs](../../architecture/jobs.md),
[ledger](../../architecture/ledger.md) and [observability](../../operations/observability.md).
