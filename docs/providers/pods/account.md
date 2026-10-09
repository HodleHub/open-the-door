# Get a Pods account and API access

Use your own organization identity and credentials. The kit does not supply an
account or dashboard session.

## Access steps

1. Open [Pods' official site](https://pods.finance/). Use its current account/contact
   path or the onboarding link supplied directly by Pods.
2. Describe your application and required capabilities: quotes, crypto swaps,
   BRL Pix ramps, KYC evidence path and supported networks.
3. Complete the provider's business onboarding and confirm product access.
4. Open the authorized Pods dashboard and obtain an API key using its current
   credential controls. The [OpenAPI authentication section](https://api.pods.finance/openapi.json)
   describes dashboard-issued API keys.
5. Put the key in your server secret store and bind it to an environment/account
   reference. Do not share it with a coding agent through chat or a committed file.
6. Confirm with Pods how to test your enabled rails safely. Do not assume a
   production endpoint becomes simulated with a second key.

The dashboard URL and self-service signup steps were not independently confirmed
for this kit. Follow the link provided by the provider; no guessed dashboard
hostname is included here.

## Questions to settle

Confirm identity/evidence requirements, account scope, route availability, quote
acceptance behavior, status references, webhook verification, fees, limits and
support for ambiguous outcomes. Keep provider-specific approvals in private
operator records; only generic setup instructions belong in this repository.

## First verification

Read [API access](api.md). Validate documented read-only behavior under your approved
account without printing response bodies. Then implement and test one enabled
capability with provider-approved fixtures. Record the contract/API version and
result in your application's private integration documentation.
