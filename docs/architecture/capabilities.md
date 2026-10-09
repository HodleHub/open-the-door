# Capabilities

A capability expresses what a particular subject can do on a particular provider,
network and environment. Account setup, KYC approval and enabled product scope
are separate inputs to that decision.

## Capability record

Track provider binding, operation kind, asset/network, enabled state, verification
source, policy version and checked time. Prefer narrow names such as `pix.receive`,
`pix.send`, `swap.quote`, `swap.execute` and `lightning.receive`. Do not let a generic
`kycApproved` flag authorize every rail.

For Pods, map documented currency/rail status to the relevant capability. For
Woovi, distinguish company account approval, BaaS feature access, account-specific
application scope and customer-account availability. For signing, verify supported
networks and user approval policy independently.

## Enforcement

The server evaluates capabilities before preparing an operation and again before
submission if they may have changed. An agent-generated UI can hide unavailable
features, but hiding a button is not enforcement. Unknown provider status disables
the affected capability until it is understood.

## Revocation

When a credential expires, a provider suspends a rail or KYC needs reverification,
stop new operations and preserve existing references for reconciliation. Do not
silently switch pending operations to another provider. Re-evaluate after a trusted
status refresh and record why a capability changed without exposing raw identity
results.

Test approved KYC without the requested rail, enabled rail without signing scope,
and suspension between quote and submission. See [KYC decisions](../kyc/decisions.md)
and [provider contracts](../providers/contracts.md).
