# Send validated evidence to Pods

Evidence reuse is a restricted adapter operation. First confirm Pods accepts your
chosen capture/verification path and required attestation. Read the current
[public OpenAPI](https://api.pods.finance/openapi.json), particularly
CreateKycSessionRequest and SubmitKycEvidenceRequest.

## Public endpoint sequence

1. Open/reuse a profile through `POST /api/v1/kyc/sessions`.
2. Bind its returned profile ID to the authenticated application attempt.
3. Resolve private document/liveness evidence references in the adapter.
4. Construct the currently documented payload and submit through
   `POST /api/v1/kyc/sessions/{kycUserId}/submit`.
5. Read `GET /api/v1/kyc/status?kycUserId=...` until the decision/rail capability
   is authoritative.

The session requires identity fields and a wallet address. These are supplied
from your protected records at runtime, never from repository fixtures or logs.
Do not copy a profile returned for another tenant or merge conflicting identities.

## Attestation

Use a trusted liveness result and verified document extraction. Match the session,
identity and ownership across steps. Client-supplied scores or success flags are
not evidence. The transport may support encoded images or restricted URLs;
implement only the form authorized by the current schema/provider agreement.

## Response handling

Acceptance can remain pending. Project only normalized state and enabled rails
into ordinary domain records. Discard unnecessary identity-bearing response fields.
Handle validation/identity errors with safe codes and an explicit correction path;
do not automatically resubmit incompatible evidence.

Test wrong-profile ownership, missing attestation, expired transfer URLs and
approved status without the desired rail. See [Pods KYC](../providers/pods/kyc.md),
[decision projection](decisions.md) and [PII](../security/pii.md).
