# Decisions and rail access

KYC approval is scoped. Track which policy and provider granted which operation,
asset and environment. Do not translate every provider-approved profile into
unrestricted banking access.

## Projection

Validate the provider response at runtime, normalize its state and map explicitly
enabled rail fields into capabilities. Unknown states disable access. Keep
provider raw reasons separate from safe UI reason codes. A pending or retryable
rejection can offer a new capture step without allowing a transaction.

[projectKycDecision.ts](../../templates/kyc/projectKycDecision.ts) illustrates a
small projection: an approved decision grants only rails whose verified boolean
is true. It consumes already verified data; it is not a provider verifier or a
complete risk policy.

## Refresh and revocation

Persist checked time and policy version. Recheck at submission when the operation
requires fresh status. If a rail is disabled or a profile requires reverification,
stop new operations and reconcile existing ones. Do not erase pending transactions
or invent a refund because identity policy changed.

## Manual review

Provide a restricted review path for conflicts or unrecognized results. Operators
need least-privilege access to evidence, an auditable reason and an explicit
transition policy. A review UI must not expose complete provider payloads by default.
No automatic bypass should be triggered by a timeout or repeated rejection.

Test approved-but-disabled rail, unknown status, cross-environment approval and
revocation between quote and send. Read [capabilities](../architecture/capabilities.md)
and [privacy](privacy.md).
