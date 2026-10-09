# Pods KYC

Select a KYC path authorized for your account. The public schema includes
external-evidence sessions and other hosted/import flows. They are alternative
integration contracts, not interchangeable payloads.

## External-evidence flow

Open a profile with `POST /api/v1/kyc/sessions`, bind its returned `kycUserId` to
your subject, and submit verified evidence through the documented submit endpoint.
Read `GET /api/v1/kyc/status` using the same provider account. Construct identity
payloads only inside a restricted service.

See [evidence handoff](../../kyc/pods-evidence.md) and inspect
CreateKycSessionRequest, SubmitKycEvidenceRequest and KycStatusResponse in the
[OpenAPI](https://api.pods.finance/openapi.json). Do not rely on a TypeScript type
alone to validate incoming data.

## Capability mapping

A normalized approval is not a generic rail entitlement. Project the current
schema's explicit currency/rail availability into your application's capabilities.
For a BRL flow, require the relevant enabled BRL capability in addition to your
own policy checks. Foreign-currency access is independently evaluated.

## Identity and wallet binding

Verify wallet ownership before linking it to a KYC profile. A submitted wallet
address is not proof of control. Keep profile mappings private and subject-scoped.
Handle identity/email conflicts through a protected correction process rather
than merging profiles automatically.

## Recovery

Pending decisions need polling or documented verified callbacks. Validation errors
need a corrected evidence step, not an unbounded retry loop. Unknown outcomes after
submission require status lookup. Test unauthorized profile access, incomplete
attestation, mismatched identity and approved-but-disabled rails.
Read [decisions](../../kyc/decisions.md) and [failures](failures.md).
