# Create your provider accounts

Each builder owns its accounts and contracts. This kit supplies no shared Hodle
credentials, bank accounts, cloud pools or hosted backend access.

## Recommended order

1. Finish local mock screens and domain tests.
2. Read [Pods account access](../providers/pods/account.md), obtain dashboard/API
   access from Pods, and confirm an authorized test procedure for your use case.
3. Register separately in [Woovi sandbox](../providers/woovi/sandbox.md).
4. Follow [Woovi account setup](../providers/woovi/account-setup.md) for your own
   company; request BaaS if you need customer accounts.
5. Select a wallet/signing solution using [custody](../wallet/custody.md).
6. Request your own Breez SDK API key through its [official docs](https://sdk-doc-spark.breez.technology/guide/getting_started.html).
7. Follow Flashnet's [official quickstart](https://docs.flashnet.xyz/orchestra/quickstart)
   for the product/API version you intend to integrate.
8. Create your own AWS resources for [self-hosted liveness](../kyc/self-hosted-liveness.md).

## Record permissions, not credentials

Maintain a private operator registry of account references, environments, enabled
products, support paths and credential rotation dates. The public repository may
contain capability names and setup instructions, never account-specific values.

Ask each provider about supported networks, fiat currencies, KYC paths, settlement
states, webhook authenticity, idempotency and limits. Obtain contractual access
before assuming a feature listed in an API schema is enabled for your account.

## Verify setup

Start with documented read-only requests in the authorized environment. Check
response shape and account scope without printing identity-bearing results.
Then test a synthetic/provider-approved scenario. Treat unsupported rails as
unavailable in the UI. Do not simulate external approval while a provider account
or customer is still pending.
