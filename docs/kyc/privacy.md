# KYC privacy by design

A reusable public kit may explain required identity fields. It must not contain
identity values or evidence from customers, staff, provider consoles or development
exports. Use opaque examples and private runtime inputs.

## Before capture

Explain purpose, data categories, processing providers and retention in language
the customer understands. Define access and deletion procedures for your actual
product with qualified advice. Record the applicable notice/consent version when
required by your policy; do not invent a universal retention period.

## During processing

Upload to private storage with narrow temporary grants. Keep evidence handling in
restricted services and resolve references only for the bound attempt. Exclude
camera pages, document upload routes and provider bodies from analytics, session
replay, debug logging and tracing payload capture.

Apply an allowlist to telemetry: normalized error code, operation kind, duration
and non-identifying aggregate metrics. Opaque IDs still require controlled access
when they can be joined to customer records.

## After processing

Retain only the evidence and audit metadata required by your defined policy and
provider obligations. Implement lifecycle deletion, including copies in backups
and downstream storage where applicable. Verify that application exports and
support tools use the same access restrictions.

## Repository review

Scan prose, fixtures, images, binaries, commit messages and history before release.
A syntactically invalid CPF placeholder is preferable to an invented valid identity.
Never commit raw webhook samples or screenshots from a live KYC review.
See [PII rules](../security/pii.md) and [publication procedure](../security/publication.md).
