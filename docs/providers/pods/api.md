# Open and use Pods API documentation

Open [https://api.pods.finance/openapi.json](https://api.pods.finance/openapi.json)
in a browser. It is a public OpenAPI document, not a customer export. If you prefer
an interactive explorer, import this URL into an API tool you control; keep API
keys out of shared collections and public documentation viewers.

## How to read an operation

Find its path and method under `paths`, inspect parameters/requestBody, then resolve
schema references under `components.schemas`. Check required fields, amount units,
nullable values, response shape and the HTTP error codes. `components.securitySchemes`
describes credentials. Dashboard endpoints can have a different authentication
requirement from ordinary API-key routes.

## Initial map

| Purpose                       | Public operation                               |
| ----------------------------- | ---------------------------------------------- |
| API health                    | `GET /health`                                  |
| Quote                         | `GET /v2/swap/quote`                           |
| Swap status                   | `GET /v2/swap/status/{id}`                     |
| External-evidence KYC profile | `POST /api/v1/kyc/sessions`                    |
| Submit evidence               | `POST /api/v1/kyc/sessions/{kycUserId}/submit` |
| KYC state                     | `GET /api/v1/kyc/status`                       |
| Link wallet                   | `POST /api/v1/kyc/{kycUserId}/wallets`         |
| Ramp limits                   | `GET /api/v1/limits`                           |

Ordinary API-key routes use `x-api-key`. Check each operation's effective security
rather than applying one credential to every dashboard endpoint. Keep your base
URL fixed from configuration.

## Implementation notes

Validate responses at runtime and project only necessary fields. Rate limits and
quote lifetime are provider configuration; honor returned deadlines and retry
signals instead of copying a fixed value. Never log full request URLs when their
query contains identity, bank details, addresses or payment identifiers.
See [swaps](swaps.md), [KYC](kyc.md) and [shared contracts](../contracts.md).
