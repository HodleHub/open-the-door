# Validation

Distinguish kit checks, generated-application checks and external integration
validation. They establish different things.

## Kit checks

```sh
npm ci
npm run check
```

TypeScript checks portable template contracts. Documentation checks resolve local
links and verify every Markdown file appears in the documentation map. Hygiene
checks reject common sensitive files/identifiers. Synthetic tests exercise transport
bounds, ownership, quote expiry, KYC capability projection and SDK runtime recovery.
They do not use provider credentials or move funds.

## Application acceptance

Use [prompt acceptance criteria](../../prompts/acceptance-criteria.md). Exercise real
application endpoints/worker transitions with synthetic persistence and external
I/O mocks. Test other-user resources, concurrent spend attempts, reused idempotency
keys with changed input, lost submit responses and duplicate/reordered events.

For signing, decode effects and reject wrong network, recipient, asset, spender,
amount or fee. For KYC, reject cross-attempt evidence, browser-only approval and
approved status without the requested rail.

## External validation

Use only your own authorized provider test environment/fixtures. Record API/SDK
version, enabled capability, request acceptance, status verification and recovery
behavior privately. Capture sanitized result codes rather than identity-bearing
payloads. A live funds test requires a separately controlled operator procedure.

## Publication

Run a redacted secret scanner and review the complete inventory/history. Keep
fixture generation synthetic. See [publication](../security/publication.md),
[jobs](../architecture/jobs.md) and [reconciliation](../providers/woovi/reconciliation.md).
