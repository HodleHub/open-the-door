# Local development

The kit itself needs only Node.js and npm. No database, provider account or wallet
seed is required for `npm run check`. Financial templates receive injected adapters;
tests supply synthetic implementations.

## Install and inspect

Run `npm ci` from the repository root. The lockfile pins the development dependency.
Use `npm run typecheck`, `npm run docs:check`, `npm run hygiene:check` and
`npm test` independently when diagnosing a failed check. `npm run check` runs all
four. The `.build/` directory is generated test output and is ignored.

## Application workspace

Generate your application in `app/` or copy the kit's interfaces into a new
project. Give that application its own package manifest, migrations and run
commands. Choose its persistence after reviewing [jobs](../architecture/jobs.md)
and [ledger](../architecture/ledger.md). In-memory mocks help with UI development,
but cannot demonstrate durable payment processing.

Use a local identity provider or synthetic login adapter. Keep test subjects
opaque, for example `subject_demo_a`. Use placeholder strings rather than valid
personal documents or real addresses. Do not import development database exports.

## Debug safely

Inspect normalized operation state and stable error codes. Avoid logging complete
HTTP bodies, headers, signed URLs or SDK events. When a fixture needs an evidence
image, generate a non-biometric test image in the test process instead of committing
an image from a camera. Network access is unnecessary for the default tests.

A local pass proves contract examples work with mocks. External adapter checks
require your own approved provider setup; follow
[environment isolation](sandbox.md) before enabling outbound calls.
