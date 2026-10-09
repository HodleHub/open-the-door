# Mock, test and live environments

A deployment named staging is not necessarily a financial sandbox. If it uses
real credentials against a production host, its requests can create real obligations.
Keep the application environment and provider environment as separate fields.

## Modes

| Mode          | Behavior                                                    | Data                        |
| ------------- | ----------------------------------------------------------- | --------------------------- |
| Mock          | Inject local synthetic adapters, no provider requests       | Synthetic only              |
| Provider test | Use an explicitly documented or authorized test setup       | Provider-approved fixtures  |
| Live          | Approved account, enabled capability, controlled activation | Restricted customer records |

[Woovi sandbox](../providers/woovi/sandbox.md) has separate registration and keys.
The inspected [Pods OpenAPI](https://api.pods.finance/openapi.json) advertises a
production server. Obtain test instructions from Pods; do not invent a sandbox
hostname or infer safety from a different API key.

## Enforce separation

Persist tenant, environment, provider account reference and idempotency key when
creating an operation. Workers must resolve credentials from those fields, not
from whichever deployment configuration is currently loaded. Never share caches,
evidence buckets, signing directories or webhook secrets between modes.

Reject live adapters when mode is mock. Reject a callback whose provider account
or environment does not match the stored operation. Unknown or mismatched events
must remain unprocessed until reviewed.

## User experience

Label simulated money and approvals as demo data. Test mode should show unavailable
capabilities clearly. A test-only invoice or balance cannot be presented as an
external settled asset. Review [capabilities](../architecture/capabilities.md)
when switching a feature from mock to an enabled external rail.
