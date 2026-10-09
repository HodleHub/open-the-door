# Ownership and multi-tenancy

Even a single-brand app has multiple users. Make ownership scope part of every
lookup and provider operation from the first prototype.

## Scope

An authenticated context contains an application subject, tenant and environment.
Resolve it server-side from a verified session. Requests may contain resource IDs,
but must not supply an authoritative subject or tenant. Query records using both
ID and scope; a successful ID lookup is not authorization.

Provider credentials also have account scope. A customer's Woovi application,
a Pods profile and a wallet signer reference must be mapped through protected
records. Never select a master credential because a client supplied a provider
account identifier.

## Sensitive resources

Evidence URLs must be issued after a scoped lookup and expire quickly. Object
storage paths should use opaque references; avoid names, emails or tax IDs. Wallet
addresses can identify users when joined to profile records, so restrict those
joins and exports.

A public Lightning address is an intentional published handle. Keep its mapping
to the actual application subject private and permit only the intended invoice
creation behavior.

## Verification

Create subjects A and B. Authenticate as A and request B's wallet, KYC attempt,
evidence reference, swap quote and operation. Every request must fail before an
external adapter is called. Repeat across tenants and environments. Include a
worker test that rejects a mismatched provider binding after loading an operation.
See [wallet contract](../wallet/contract.md), [PII](../security/pii.md) and
[authentication](../product/authentication.md).
