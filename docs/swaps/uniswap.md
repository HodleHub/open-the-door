# Uniswap integration paths

Choose an API or direct protocol/SDK integration explicitly. Uniswap protocol
versions and router deployments are separate contracts; do not assume a v3 example
implements v4 or a different route product.

## Access the docs

Open [Uniswap Developers](https://developers.uniswap.org/docs) and follow
[Quick Start](https://developers.uniswap.org/docs/get-started/quickstart).
For an API integration, obtain your own developer account/key through the documented
portal. For a direct protocol/SDK integration, use the SDK and deployment references
for your selected chain/version. Follow their current license and access requirements.

## API request sequence

Create an API key at [the developer dashboard](https://developers.uniswap.org/dashboard).
The reviewed quickstart uses `x-api-key` and
`POST https://trade-api.gateway.uniswap.org/v1/quote`. Supply the configured token
identifiers, chain IDs, exact amount direction and verified swapper address.
Inspect its returned routing before choosing execution: the current quickstart
routes order-based paths to `/order` and transaction paths to `/swap`.
Do not send every quote to one endpoint or treat the response as settlement.
Validate the returned transaction/signature plan, sign with the user's authorized
wallet, and monitor the selected flow's documented status.

## Adapter flow

Resolve exact token contracts/decimals and chain. Quote with the selected API/SDK,
normalize raw amounts, minimum output, fees and deadline into the
[swap port](../../templates/swaps/swapProvider.ts). Prepare transactions only after
binding the user's wallet and recipient.

Check allowance and the documented spender. Decode router calldata and any permit
or signature intent independently. Verify chain, recipient, amount, minimum output,
expiry and fee bounds before approval. Persist approval and swap references separately.

## Validation

Use a configured test network or local fork with synthetic funds where supported;
never assume a production router/API request is a simulation. Test incorrect token
decimals, unknown router/spender, invalid permit domain, expired quote and failed
execution receipt. A returned route is not proof that it can execute or settle.

Read [protocol deployments](https://developers.uniswap.org/docs),
[execution](execution.md), [EVM signing](../wallet/evm.md) and
[quote contract](quotes.md). No router address or private routing rule is embedded
in this kit.
