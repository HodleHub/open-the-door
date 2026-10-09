# Add other swap providers

A portable swap port permits multiple integrations without exposing private
routing policy. Add a provider only for the assets, networks and operations its
current public contract supports.

| Candidate | Official entry point                                        | Integration focus                                         |
| --------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| Pods      | [OpenAPI](https://api.pods.finance/openapi.json)            | Initial ramp/swap adapter                                 |
| Uniswap   | [Developer docs](https://developers.uniswap.org/docs)       | Selected API or protocol path                             |
| 0x        | [Official docs](https://docs.0x.org/)                       | Account/key setup and reviewed quote/transaction contract |
| Jupiter   | [Official docs](https://developers.jup.ag/docs/get-started) | Reviewed Solana quote/execution contract                  |
| Flashnet  | [Docs](https://docs.flashnet.xyz/)                          | Selected Bitcoin asset-routing product                    |

This table lists integration entry points, not a claim of interchangeable
networks, custody, quote guarantees or execution semantics.

## Implementation procedure

Read the provider's current authentication and execution documentation. Implement
quote, prepare, submit and status as applicable. Decode external responses at
runtime and project the common plan. Keep provider-specific credentials, signer
requirements and calldata handling inside the adapter.

Normalize slippage units, fee treatment and expiry deliberately. If a provider
cannot meet an application's requested minimum output or settlement policy,
return unavailable rather than weakening that policy.

## Comparison

Compare plans on the same input/destination, including network costs and execution
requirements. Do not expose negotiated private fees or another application's
routing priorities. Requoting with a new provider requires fresh user approval.

Run shared tests for wrong network, altered recipient, unknown status, expiry and
lost submission response. Read [execution](execution.md) and
[provider contracts](../providers/contracts.md).
