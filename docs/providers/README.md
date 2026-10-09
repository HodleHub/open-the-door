# Providers

Pods is the initial ramp/swap integration for this kit. Woovi has a separate manual
for Pix and BaaS. Wallet, identity, biometric and Bitcoin providers remain independent
ports; account access does not imply every capability is available.

## Choose a path

| Need                                           | Starting manual                                     | Template                                                               |
| ---------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------- |
| Fiat/crypto ramps and swaps                    | [Pods](pods/README.md)                              | [Quote preparation](../../templates/providers/pods/createPodsQuote.ts) |
| Pix collections/payments and customer accounts | [Woovi](woovi/README.md)                            | [Charge request](../../templates/providers/woovi/createWooviCharge.ts) |
| Embedded wallet                                | [Privy boundary](../wallet/privy-adapter.md)        | [Wallet adapter](../../templates/wallet/createPrivyWalletAdapter.ts)   |
| Liveness capture                               | [Self-hosted guide](../kyc/self-hosted-liveness.md) | Trusted validator contract                                             |
| Bitcoin payments                               | [Breez](../bitcoin/breez.md)                        | [Runtime](../../templates/bitcoin/createBreezRuntime.ts)               |
| Bitcoin asset routing                          | [Flashnet](../bitcoin/flashnet.md)                  | [Prepared swap](../../templates/bitcoin/prepareFlashnetSwap.ts)        |

## Adapter requirements

Every integration documents account creation/access, official docs, authentication,
enabled product scope, environment, schemas, money units, idempotency, pending
states and recovery. Start with an injected mock and implement the boundary against
the current official contract. [contracts.md](contracts.md) is the shared review.

Do not export an application's internal routing priorities, negotiated fees,
operator credentials or private provider arrangements. The kit teaches public
integration patterns. Limits, fees and supported routes must be read from your
own account and current provider docs rather than copied from another deployment.

Follow [documentation access](../external-docs.md) when finding endpoint schemas.
