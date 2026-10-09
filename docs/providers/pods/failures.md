# Pods failure handling

The public API describes a structured error envelope with a stable code and
human-readable details. Use the HTTP status and documented code for decisions;
raw messages/details can contain sensitive values and must not be logged or forwarded.

## Recovery categories

| Category                          | Behavior                                                  |
| --------------------------------- | --------------------------------------------------------- |
| Missing/invalid credential        | Disable adapter; operator repairs access                  |
| Ownership/profile conflict        | Stop; protected correction process                        |
| Invalid evidence                  | Ask for the specific corrected capture step               |
| Unsupported route/limit           | Explain unavailability; prepare a new user-approved route |
| Expired quote                     | Obtain a new quote and fresh acceptance                   |
| Rate limit/transient read failure | Bounded backoff                                           |
| Ambiguous execution               | Reconcile the existing operation                          |
| Refund required                   | Track refund independently until confirmed                |

Read the current codes in the [OpenAPI](https://api.pods.finance/openapi.json).
Do not freeze a private application's exception handling into the public kit.
The adapter should recognize only codes it has reviewed; unknown errors become a
safe unavailable/unknown outcome without speculative retries.

## Diagnostics

Record operation kind, normalized code, duration, retry count and provider/account
reference under controlled access. Do not print query parameters, evidence payloads,
Pix keys, addresses, profile responses or credential headers.

## Verification

Inject malformed JSON, wrong schema, expired deadline, unknown status, response
loss after acceptance and repeated callbacks. The app must preserve its original
reference, avoid duplicate signing and withhold final balance effects until
confirmed. See [jobs](../../architecture/jobs.md),
[operations](../../architecture/operation-lifecycle.md) and [observability](../../operations/observability.md).
