# Document capture and storage

Prefer provider-hosted onboarding when it meets the product requirement. If the
application collects documents, use a dedicated evidence service rather than
passing files through ordinary business events.

## Upload protocol

Authenticate, scope the KYC attempt and create a short-lived upload grant for a
specific object reference, content type and size bound. Use private storage and
server-generated opaque keys. Validate actual file content, dimensions and size
at a trusted boundary; an extension or browser MIME field is insufficient.

Mark the object usable only after the expected upload and validation complete.
Store its digest and owner. A downstream adapter resolves the reference after
checking attempt ownership and purpose. Signed URLs are temporary credentials;
never log them or send them to analytics.

## Provider requirements

Check the chosen provider's current accepted document types and front/back rules.
Do not assume one provider's evidence can be reused by another. For Woovi account
onboarding, see [official document guidance](https://developers.woovi.com/docs/baas/documentos-kyc).
For Pods, inspect the evidence schemas in its
[OpenAPI](https://api.pods.finance/openapi.json).

## Recovery and tests

Allow corrected uploads to create a new revision while preserving minimal audit
metadata. Reject another subject's object, expired grants, oversized content,
wrong image format and attempts to fetch arbitrary URLs. If URL transfer is
supported, enforce allowed HTTPS hosts and private-network/redirect protections.

Synthetic fixtures should be non-biometric generated images. Do not commit scans,
selfies or real provider samples. Read [Pods evidence](pods-evidence.md) and
[privacy](privacy.md).
