# Swaps

A swap exchanges an exact asset/network input for an output under a time-bound
plan. The UI, signer, provider and settlement tracker must agree on that plan.

## Reading path

- [Quotes](quotes.md): amount direction, fees, slippage and expiry.
- [Execution](execution.md): decode and approve a prepared transaction.
- [Uniswap](uniswap.md): public protocol/API integration paths.
- [Other providers](alternatives.md): portable adapter additions.
- [Cross-chain recovery](cross-chain.md): track every external leg.

Start with [Pods](../providers/pods/swaps.md) as the initial provider. Use the
[swap port](../../templates/swaps/swapProvider.ts) so pricing and execution can be
implemented by different adapter products without changing domain rules.

## Required UI

Show input asset/network and exact amount, expected output, minimum output, fee
breakdown, deadline and destination. Explain when gas is separate from swap fees.
Disable expired quotes and require fresh approval after a changed route/plan.

## Required backend

Scope wallet/quote/operation to the authenticated subject. Bind an idempotency key
to the request digest. Validate execution effects before signing and store external
references durably. Normalize status without treating acceptance as settlement.

## First tests

Use a synthetic provider to test quote expiry, wrong destination, wrong network,
unsupported assets, duplicated submission and source-complete/destination-pending.
The [quote guard](../../templates/swaps/validateQuote.ts) demonstrates time and
amount checks; an application must also validate asset, recipient, fees and route.
