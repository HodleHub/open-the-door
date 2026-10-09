# Secrets and signing material

A private repository is not a secret store. Treat it as material intended for a
future public release and keep credentials out from its first commit.

## Configuration rules

Use `.env.example` only for empty/placeholder names. Ignore real `.env` files,
wallet databases, key files, exports and local build output. Inject credentials
from your application's server secret manager and reference signers through an
approved custody boundary. Do not add a seed/private key variable to make a
sample initializer easier.

Keep Pods keys, Woovi AppIDs/Master keys, SDK access keys, cloud credentials,
webhook tokens and provider session links out of prompts, source, logs, build
artifacts and browser variables. Public application identifiers are still
operator-specific configuration and need not be embedded in a reusable kit.

## Transport

Credentialed requests use a fixed HTTPS host, no credential-forwarding redirects,
timeout and response-size bounds. Normalize errors without returning raw bodies.
Never log full headers, URLs with sensitive queries or SDK events.

## Rotation and exposure

Revoke leaked credentials through the issuing provider and replace their secret
references. Review history and generated artifacts; deleting the latest file does
not delete an older commit. Do not paste the leaked value into a remediation report.

Run `gitleaks dir . --redact` when available and scan git history before release.
The kit's hygiene check complements secret scanning but does not replace it.
See [SECURITY.md](../../SECURITY.md), [publication](publication.md) and
[configuration](../getting-started/configuration.md).
