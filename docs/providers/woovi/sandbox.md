# Woovi sandbox

Woovi documents a separate test environment with separate registration.
Production account data and credentials do not work there. Read
[test environment access](https://developers.woovi.com/docs/test-environment).

## Start

1. Register at [app.woovi-sandbox.com](https://app.woovi-sandbox.com/).
2. Create the authorized test integration and its own AppID.
3. Confirm the currently documented API host for that environment in the API
   reference; do not guess it by editing the production hostname.
4. Configure a dedicated test receiver and database namespace.
5. Use provider-approved synthetic data and the documented test controls.

The kit's default mode remains mock and makes no outbound requests. Sandbox
access is for your application adapter, not a credential to insert into this repo.

## Validate one cycle

Prepare a charge with a stable correlation ID, inspect the permitted payment
instructions privately, and exercise the provider's documented simulation flow.
Verify callback authentication and fetch status. Ensure the application changes
its state once and a repeated event cannot create another journal credit.

Test an invalid AppID, malformed response, expired charge and lost response.
Confirm that a sandbox operation cannot be resumed by a worker using live bindings.

## Capability limits

Check which products are enabled for your sandbox organization. Do not assume
BaaS, payout or every feature is available merely because the environment exists.
Mark unavailable rails clearly in the UI. Read [charges](charges.md),
[webhooks](webhooks.md) and [environment isolation](../../getting-started/sandbox.md).
