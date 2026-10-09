# Authentication

Separate login identity from wallet ownership and KYC. A valid access token permits
a server to resolve a session; it does not automatically authorize a particular
wallet, payment or evidence record.

## Server flow

Use your selected identity provider's verified token/session mechanism. Validate
signature, issuer, audience, expiration and the appropriate session state. Map
its external subject to an opaque application subject in protected storage.
Resolve tenant/environment server-side and pass that context to domain services.

[Privy access tokens](https://docs.privy.io/authentication/user-authentication/access-tokens)
are one possible identity adapter. Keep its verification and identity lookup inside
the adapter. The domain and UI should work with an application session contract,
so another authentication provider can replace it.

## Sensitive actions

Require explicit user approval for a bound financial intent. Depending on custody,
use the signer or identity provider's documented additional authentication controls.
Do not invent a custom signing challenge that bypasses the wallet's policy.
Apply CSRF defenses to cookie-authenticated state changes and configure cookie
flags for your deployment.

## Session lifecycle

Define logout, expiration, revocation and recovery behavior. Do not keep bearer
tokens in logs, URLs or analytics. Do not merge users because they supply the same
email or wallet address; linking identities requires a verified procedure.

Test forged tokens, wrong audience, expired sessions and an authenticated request
for another user's wallet. Read [Privy boundary](../wallet/privy-adapter.md),
[multi-tenancy](../architecture/multi-tenancy.md) and [secrets](../security/secrets.md).
