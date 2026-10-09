# Enter the official documentation

These public sources were reviewed while preparing the kit on 2026-10-08. Recheck
the current contract when implementing an adapter; public APIs and consoles evolve.
The kit does not include credentials or private documentation access.

| Integration        | Entry point                                                                                               | Where to begin                                                |
| ------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Pods               | [Public OpenAPI](https://api.pods.finance/openapi.json)                                                   | paths, request schemas, securitySchemes and responses         |
| Woovi              | [Developer portal](https://developers.woovi.com/)                                                         | API getting started, test environment, BaaS and API explorer  |
| Privy              | [Docs](https://docs.privy.io/)                                                                            | Backend access-token verification and chosen wallet SDK       |
| Ethereum Sepolia   | [Ethereum network guide](https://ethereum.org/developers/docs/networks/)                                  | Application testnet, explorer and ETH faucets                 |
| Test USDC          | [Circle faucet](https://faucet.circle.com/)                                                               | Ethereum Sepolia; verify the Testnet contract in Circle docs  |
| Hodle liveness     | [Public repo](https://github.com/HodleHub/aws-rekognition-liveness)                                       | README setup, integration contract and SECURITY.md            |
| AWS Rekognition    | [Programming guide](https://docs.aws.amazon.com/rekognition/latest/dg/face-liveness-programming-api.html) | Create session, capture permissions and trusted results       |
| Spark              | [Docs](https://docs.spark.money/)                                                                         | Selected wallet SDK, network and signer                       |
| Breez Spark        | [SDK docs](https://sdk-doc-spark.breez.technology/)                                                       | API key, bindings, initialization, events and payments        |
| Flashnet AMM       | [Official SDK](https://github.com/flashnetxyz/ts-sdk)                                                     | Versioned client, pools, intent/signing and swaps             |
| Flashnet Orchestra | [Docs](https://docs.flashnet.xyz/)                                                                        | Quickstart, quotes, order status and available routes         |
| Uniswap            | [Developer docs](https://developers.uniswap.org/docs)                                                     | Quickstart, API access, selected SDK/protocol and deployments |
| LNURL              | [LUD index](https://github.com/lnurl/luds)                                                                | LUD-03, LUD-04, LUD-06 and LUD-16                             |
| Lightning invoices | [BOLT11](https://github.com/lightning/bolts/blob/master/11-payment-encoding.md)                           | Amounts, network, expiry and description/hash                 |

## Reading an integration

Start with product prerequisites and account access. Then verify environment,
authentication, required fields, amount units, approval/submission semantics,
status and recovery. Read endpoint schemas as well as workflow prose. A documented
feature may still require account-specific activation.

For EVM test setup, follow the [Sepolia manual](getting-started/sepolia.md). Open
Circle's [USDC contract reference](https://developers.circle.com/stablecoins/usdc-contract-addresses)
and use its Testnet section. For direct swaps, select the Ethereum Sepolia column
of Uniswap's [v3 deployment reference](https://developers.uniswap.org/docs/protocols/v3/deployments/v3-ethereum-deployments).
Verify protocol deployments and API network support separately.

## Private access

If an account-only reference is needed, obtain it from the provider through your
own authorized account. Keep that material private and document only generic
requirements here. Do not invent URLs or authentication flows when access could
not be confirmed. [Pods account guide](providers/pods/account.md) marks its
unverified dashboard/signup details explicitly.
