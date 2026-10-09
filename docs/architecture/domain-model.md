# Domain model

Keep the model small and distinguish business identity from provider identifiers.
The following records are application contracts, not a copy of any private database.

| Record             | Purpose                             | Important fields                                           |
| ------------------ | ----------------------------------- | ---------------------------------------------------------- |
| Subject            | Authenticated application principal | Opaque ID, tenant reference                                |
| Wallet             | Owner-scoped wallet capability      | Wallet ID, subject, network, provider reference            |
| KYC attempt        | One verification journey            | Attempt ID, subject, policy version, state                 |
| Evidence reference | Handle to restricted data           | Object reference, owner, expiry, purpose                   |
| Quote              | Time-bound proposed trade           | Quote ID, assets/networks, raw amounts, fees, deadline     |
| Operation          | Durable requested action            | Operation ID, subject, environment, state, idempotency key |
| Provider binding   | Private external identity link      | Internal reference, provider/account scope                 |
| Journal entry      | Balanced immutable accounting event | Operation ID, postings, asset, revision                    |

## Amounts and assets

Encode money as integer decimal strings in the asset's smallest unit. Store asset
identity and decimals explicitly. Token symbol alone is ambiguous: pair it with
network and contract identifier. Never add BRL cents to satoshis or combine identical
symbols from different networks into an unexplained total.

## References and ownership

Resolve a wallet/evidence/operation using its ID plus authenticated subject,
tenant and environment. The client cannot choose the owner. Provider references
are mappings for reconciliation, not bearer authorization.

## State changes

Use transactions or atomic compare-and-set operations for state transitions.
Persist an outbox alongside externally relevant changes. Keep the original quote
snapshot so a later provider response cannot silently change approved amount,
fees or destination. Retain audit metadata without unnecessary PII.
Read [operations](operation-lifecycle.md), [ledger](ledger.md) and
[KYC data model](../kyc/data-model.md).
