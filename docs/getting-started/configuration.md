# Configuration

Start with `PROVIDER_MODE=mock`. Treat the mode as an application policy, not a
promise that every provider exposes a test endpoint. The templates do not read
`.env`; an application composition root must validate settings and inject adapters.

## Configuration groups

| Group               | Examples                                   | Boundary                               |
| ------------------- | ------------------------------------------ | -------------------------------------- |
| Public UI           | Product name, public app URL               | May appear in browser configuration    |
| Provider access     | Pods API key, Woovi AppID, Flashnet access | Server secret store                    |
| Wallet signing      | Signer reference, approved network         | Custody-specific trusted boundary      |
| Liveness capture    | Owned Cognito pool and region              | Public temporary capture configuration |
| Liveness validation | Fixed validator URL, verification policy   | Trusted backend                        |
| Storage             | Private evidence-store credentials         | Restricted service identity            |

Read `.env.example` for placeholder names. Keep signing keys and seeds outside
ordinary application environment files. Inject a reference to a signer instead.
Do not put server credentials into build-time browser variables.

## Validate before startup

Require explicit mode and network. Reject missing keys for enabled real adapters.
Validate HTTPS URLs against a configuration allowlist and reject user-selected
provider hosts. Never derive the destination host from request input. Disallow
redirects on credentialed requests and cap response sizes and request duration.

Track capabilities separately from configuration: possessing a key does not grant
BaaS, Pix payout or a currency rail. [Provider contracts](../providers/contracts.md)
define this distinction. Persist environment on every operation so a worker cannot
resume a test operation against live credentials.

## Changing configuration

Rotate a provider key without logging it. Record the configuration version and
operator action using opaque references. Disable new operations before changing
custody or provider account scope, then reconcile pending operations. See
[secrets](../security/secrets.md) and [deployment](../operations/deployment.md).
