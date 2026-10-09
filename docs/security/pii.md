# Keep PII out of the repository

This kit may name identity fields needed by a public API. It must not include real
values from customers, staff, console sessions, exports or private test accounts.
Wallet addresses and transaction references can also identify people when linked
to application records.

## Allowed examples

Use opaque IDs such as `subject_demo_a`, reserved example domains and placeholders
that clearly cannot be submitted as real identity documents. Build non-biometric
image fixtures in memory when necessary. Do not use invented valid CPF/CNPJ,
phone or banking details as convenient fixtures.

## Restricted data

Exclude names paired with identifiers, birth dates, postal addresses, emails,
phones, tax IDs, document images, selfies, video, biometric results, account
numbers, real transactions, receipts and signed evidence/onboarding URLs. Do not
commit raw API or webhook bodies, database dumps or screenshots from live consoles.

At runtime, evidence belongs in a private encrypted store with purpose-bound access,
retention and deletion. Domain records use references and normalized outcomes.
Telemetry uses an allowlist; redacting a few field names in an arbitrary object
is insufficient.

## Review procedure

Run `npm run hygiene:check` and a redacted secret scanner, then manually read every
staged file and inspect history/file inventory. Automated patterns catch common
shapes, not every identity or semantic disclosure. Verify comments, fixtures,
images, commit messages, ignored files and generated output too.

If data was committed, keep the repository private, remove the artifact, follow
your incident process and review all reachable history before publishing.
Read [publication](publication.md), [KYC privacy](../kyc/privacy.md) and
[observability](../operations/observability.md).
