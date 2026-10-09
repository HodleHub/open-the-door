# KYC data model

Separate workflow metadata from identity-bearing evidence. The application's
ordinary KYC record should not be a dump of a provider response.

## Workflow record

Store attempt ID, subject/tenant/environment, selected provider binding, policy
version, consent version, normalized state, evidence references, decision source
and timestamps. Keep a protected mapping to the provider's KYC profile ID.

## Restricted evidence record

An evidence reference resolves to a private object or vault record. Store owner,
purpose, content type, byte size, integrity digest, upload/expiry time and retention
policy. Names, tax IDs, dates of birth, postal addresses, document images and
biometric results are restricted payload fields, not routine telemetry.

Wallet addresses linked to a KYC identity can be personal data. Keep that mapping
protected even if an address is publicly visible on a network. Do not use tax IDs
or email addresses as object names, idempotency keys or queue identifiers.

## Decision projection

Store decision state, relevant capabilities, provider binding, policy version and
verification time. Safe rejection codes can drive UI messages, but raw provider
results require restricted handling. Approval history should show the policy and
rail that were evaluated instead of a timeless global approved flag.

## Retention and deletion

Choose retention with qualified advice and provider obligations for your product.
Implement expiry/deletion in both the evidence store and copies held by downstream
services where applicable. Keep minimal audit records only under a defined policy.
See [privacy](privacy.md), [PII](../security/pii.md) and
[template types](../../templates/kyc/kycProvider.ts).
