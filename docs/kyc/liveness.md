# Trusted liveness validation

The browser captures a challenge; a trusted validator decides whether the result
satisfies policy. Keep these responsibilities separate.

## Session creation

Authenticate the application subject, create an attempt and obtain a new session
from your authorized biometric provider. Bind an unguessable short-lived validation
token to that exact session, subject, attempt, purpose and expiry. Store only a
protected token representation where possible and enforce one-use semantics.

The capture page may report analysis complete. Treat that as permission to ask
the validator for a result, never as approval. The validator loads its server-bound
session ID and fetches the biometric result directly from the trusted API. It
checks completion, freshness, configured confidence/policy and ownership, then
persists a decision before returning success.

## Failure handling

Cancellation, expired session, failed challenge, unavailable analysis and low
confidence must not enable a capability. A retry creates a new session and token.
Do not let a browser supply a score, session belonging to another attempt or a
provider name as authoritative attestation.

## Evidence handling

Biometric reference images/results are restricted evidence. Use the purpose and
retention policy communicated before capture. Avoid analytics and third-party
scripts on the camera page. Do not persist video/images merely to debug a capture.

Read [self-hosted setup](self-hosted-liveness.md) for the public capture project,
[Pods handoff](pods-evidence.md) for a restricted downstream integration and
[AWS programming guide](https://docs.aws.amazon.com/rekognition/latest/dg/face-liveness-programming-api.html)
for the external analysis contract.
