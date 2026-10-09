# Flashnet integration logic

Choose the Flashnet product explicitly: its Spark AMM SDK and Orchestra API are
separate integration surfaces. Keep their clients and response types in adapters.

## Public documentation

For Spark AMM, read the official [TypeScript SDK](https://github.com/flashnetxyz/ts-sdk).
For Orchestra, start at [Quickstart](https://docs.flashnet.xyz/orchestra/quickstart),
[quotes](https://docs.flashnet.xyz/orchestra/quotes) and
[order status](https://docs.flashnet.xyz/orchestra/status). Obtain access/credentials
through the product's current documented path and use your own signer.

## SDK path

The SDK README shows a `FlashnetClient` created from a Spark wallet, followed by
initialization, pool discovery and swap execution. Supply an already authorized
owner-scoped wallet; do not introduce a shared seed in the application core.
Map token public keys, integer input, minimum output and slippage into a bound plan.

[prepareFlashnetSwap.ts](../../templates/bitcoin/prepareFlashnetSwap.ts)
illustrates plan validation and minimum-output calculation using an injected
public pool quote boundary. It does not sign or move funds. A builder adds the
pinned SDK execution/status calls after user approval.

## Orchestra path

Normalize the current quote/order contracts into the swap port. Validate source,
destination, payment instructions, fees and expiry. Persist the original reference
before executing a source leg and reconcile destination/refund states afterward.

Test unknown pool/token, amount conversion, changed output, expired plan, mismatched
wallet and an interrupted multi-leg operation. Keep credentials and private fee policy outside the kit. Read
[cross-chain recovery](../swaps/cross-chain.md) and [signing](../wallet/signing.md).
