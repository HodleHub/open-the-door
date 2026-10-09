# Create your Woovi account

Create an operator/company account first. Customer BaaS accounts are a later,
separately enabled flow.

## Signup and credential path

1. Open [Woovi](https://woovi.com/) and follow its current account/signup path.
2. Register your own organization and complete requested business onboarding.
3. Sign in with an administrator authorized to manage API access.
4. Read [API getting started](https://developers.woovi.com/docs/apis/api-getting-started).
   In the platform, open API/Plugins, create an API integration, give it a clear
   name and complete the required authentication step.
5. Store the resulting AppID in your server secret store. Configure only the
   scopes needed by this integration.
6. Register separately in [sandbox](sandbox.md) for development; production
   identity/keys are not interchangeable with sandbox access.

If API/Plugins is unavailable, ask your organization administrator to review your
permissions. Do not work around access controls by borrowing another account's key.

## BaaS enablement

Read [BaaS activation](https://developers.woovi.com/docs/baas/ativacao-baas).
Confirm account approval, request BaaS and account-creation capability through
Woovi's authorized support/account channel, then create the required Master API.
Keep that credential in a narrowly scoped server process.

## Setup completion

Record enabled features, environment and credential reference in private operator
configuration. Verify read-only access against the correct account without printing
customer-bearing results. Follow [authentication](authentication.md),
[BaaS accounts](baas-accounts.md) and [sandbox validation](sandbox.md) before
connecting the generated application.
