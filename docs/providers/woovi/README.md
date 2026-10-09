# Woovi integration manual

Use this path to go from your own account to Pix collections and, when enabled,
customer accounts through BaaS. Each feature requires the correct environment,
account and application scope.

## Read in order

1. [Create an account](account-setup.md).
2. [Use sandbox](sandbox.md).
3. [AppID and authentication](authentication.md).
4. [BaaS customer accounts](baas-accounts.md).
5. [Pix charges](charges.md) and [payouts](payouts.md).
6. [Webhooks](webhooks.md) and [reconciliation](reconciliation.md).

Start at [Woovi Developers](https://developers.woovi.com/). Use the sidebar's API,
BaaS, charge, payment and webhook sections; follow the API explorer for complete
schemas. Guides explain workflows, while the endpoint reference defines required
fields. Review the current docs for your enabled account capabilities.

## Template path

[createWooviCharge.ts](../../../templates/providers/woovi/createWooviCharge.ts)
illustrates a minimal charge using a server-side AppID, cents and a correlation ID
through an injected transport. It validates a projected response and returns safe
errors. It does not open an account, approve a payment or post a ledger credit.

## First integration

Create a separate sandbox organization, generate its own AppID and validate a
charge/status cycle. Add durable operations and authenticated webhooks before
making balances spendable. Customer-account onboarding and outgoing payments
have additional access requirements; follow their manuals instead of reusing a
charge example as a generic payment API.
