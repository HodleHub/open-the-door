# LNURL Auth

[LUD-04](https://github.com/lnurl/luds/blob/luds/04.md) describes signing an authentication
challenge with a domain-scoped linking key. It authenticates control of that key;
it does not authorize a payment or prove legal identity.

## Server flow

Create a fresh `k1` challenge bound to a pending application login/action, expire
it and store its protected representation. Verify the callback signature and
key using a reviewed implementation, then consume the challenge atomically.
Bind the verified key to an opaque application subject through an explicit
registration/linking policy.

## Wallet flow

Validate the destination domain and requested auth action. Use the wallet's
documented domain-scoped key derivation/signing behavior. Show that the action
is authentication and name the relying party. Do not reuse payment signing
prompts or send a seed/private key to the server.

## Session completion

The browser retrieves completion through its own bound authenticated/pending
session mechanism. Possessing an unrelated callback URL cannot take over the
login. Use TLS, replay prevention, short lifetime and CSRF/session protections
appropriate to your application.

Test altered challenge/domain, bad signature, repeated callback, expired challenge
and cross-browser session confusion. Keep challenge/signature payloads out of
ordinary logs. Read [authentication](../product/authentication.md),
[LNURL overview](lnurl.md) and [wallet signing](../wallet/signing.md).
