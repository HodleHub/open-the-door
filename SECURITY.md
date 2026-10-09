# Security

This kit contains examples and contracts. Each application must implement its own
authorization, storage, signing policy, webhook verification and reconciliation.
The checks exercise synthetic behavior and do not certify external services.

## Reporting

Use the repository's private vulnerability reporting feature if it is enabled.
If it is unavailable, contact a repository maintainer through an existing private
channel and arrange a secure report. Do not put sensitive evidence in public
issues, discussions or pull requests.

Include the affected file/commit, prerequisite, expected behavior and a minimal
synthetic reproduction. Remove keys, session links, identities and wallet material.
If credentials were exposed, revoke them through the issuing provider before
sharing a sanitized report.

## Required boundaries

Authenticate requests on the server; resolve the application subject there. Scope
wallets, evidence and operations to that subject and tenant. Signed requests must
bind network, asset, amount, destination and expiration. Do not accept provider
calldata or client liveness scores without independent verification.

Keep PII in a restricted encrypted evidence store. Ordinary domain events contain
references and normalized decisions. Limit telemetry to an explicit allowlist.
Never serialize request/response objects, provider errors or SDK events into logs.

See [PII](docs/security/pii.md), [secrets](docs/security/secrets.md),
[webhooks](docs/architecture/webhooks.md), [signing](docs/wallet/signing.md) and
[publication](docs/security/publication.md). Real-money activation is an operator
configuration step after provider acceptance and application validation.
