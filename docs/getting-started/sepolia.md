# Ethereum Sepolia test environment

Use this profile to validate an EVM wallet and supported contract interactions
with test assets. Start with mocks, then opt into external Sepolia requests in your
generated application. The kit itself does not connect to RPCs, create wallets or
submit transactions. Ethereum recommends Sepolia for application development.
[Ethereum network guide](https://ethereum.org/developers/docs/networks/).

Public references below were reviewed on 2026-10-08. Recheck provider support,
faucet requirements and protocol deployments when implementing your adapter.

## Network identity

| Setting                        | Value                                              |
| ------------------------------ | -------------------------------------------------- |
| Profile identifier in this kit | `ethereum-sepolia`                                 |
| Network                        | Ethereum Sepolia                                   |
| Chain ID                       | `11155111`                                         |
| JSON-RPC chain ID              | `0xaa36a7`                                         |
| Native gas asset               | Test ETH, 18 decimals                              |
| Explorer                       | [Sepolia Etherscan](https://sepolia.etherscan.io)  |
| RPC                            | Your operator-configured Ethereum Sepolia endpoint |

Verify these values against the public
[Ethereum chain metadata](https://github.com/ethereum-lists/chains/blob/master/_data/chains/eip155-11155111.json).
Ethereum Sepolia and Base Sepolia are different networks: Base Sepolia uses
`84532`. A matching wallet address or the word Sepolia does not establish chain
identity. [Privy network reference](https://docs.privy.io/basics/react/advanced/configuring-evm-networks).

## What this environment covers

| Component     | Sepolia behavior                                                                          |
| ------------- | ----------------------------------------------------------------------------------------- |
| EVM wallet    | Read balances, prepare approved test transfers, track receipts                            |
| ERC-20 assets | Use contracts verified for chain `11155111`                                               |
| Uniswap       | Enable a selected protocol path only after deployment and route checks                    |
| Pods          | Keep mocked until Pods authorizes a specific test capability/network                      |
| Woovi         | Use its independent [sandbox](../providers/woovi/sandbox.md)                              |
| KYC/liveness  | Keep synthetic or use a separately authorized validation setup                            |
| Bitcoin       | Follow its own network and SDK configuration in the [Bitcoin guide](../bitcoin/README.md) |

Sepolia does not test Pix settlement, create a bank account or enable a fiat ramp.
Persist environment and chain on operations, asset records, caches and receipt
lookups. Keep mock, Sepolia and live wallets, credentials and storage separate.

## Configure your generated application

1. Create a dedicated test wallet with your chosen custody provider. Keep its
   signing material in that provider's trusted boundary and use a signer reference.
2. Obtain an Ethereum Sepolia RPC through your own node or provider account. Select
   the network explicitly in its console and obtain the HTTPS endpoint.
3. Fill the blank `SEPOLIA_RPC_URL` in your application's private configuration.
   Treat a credential-bearing URL as a secret; never publish it or log request URLs.
4. Implement the settings from [.env.example](../../.env.example) in your
   application's configuration parser. The kit does not load this file.
5. Keep `PROVIDER_MODE=mock` and `EVM_TEST_ENABLED=false` for the initial build.
   For an explicit Sepolia run, set `PROVIDER_MODE=test` and
   `EVM_TEST_ENABLED=true`. Enable only the verified EVM test capabilities;
   unconfigured fiat and Bitcoin adapters remain mocked or unavailable.

The EVM settings are `EVM_TEST_NETWORK=ethereum-sepolia`,
`EVM_TEST_CHAIN_ID=11155111`, `SEPOLIA_RPC_URL` and
`SEPOLIA_EXPLORER_URL=https://sepolia.etherscan.io`. Validate them at startup.
Reject arbitrary user-supplied RPC URLs, redirects and missing settings. Apply
request timeouts, response limits and an operator-controlled host allowlist.

After securely exporting your RPC URL locally, this read-only request checks the
endpoint's reported network. Do not enable shell tracing or verbose HTTP logging:

```sh
curl --silent --show-error --fail --max-time 10 \
  --header 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}' \
  "$SEPOLIA_RPC_URL"
```

Require `result` to equal `0xaa36a7`; an error, missing result or different value
blocks the adapter. Independently require the signer, transaction, quote and asset
configuration to use `11155111` before signing and broadcast. A reported chain ID
does not make an untrusted RPC trustworthy. Never fall back to a mainnet endpoint.

## Keep Privy inside the wallet adapter

If choosing Privy, configure its SDK wrapper for the Sepolia profile rather than
relying on its defaults. In the generated application's Privy integration module,
pass this configuration fragment to `PrivyProvider`:

```ts
import { sepolia } from "viem/chains";

const networkConfig = {
  defaultChain: sepolia,
  supportedChains: [sepolia],
};
```

The application must install its selected SDK versions; the kit does not bundle
them. Follow the official instructions for a custom RPC override where needed;
setting `SEPOLIA_RPC_URL` does not configure the SDK automatically. Default network
selection is a UI convenience. Inspect the actual wallet chain before every
approval/signature and reject mismatches. Keep SDK responses and wallet identities
behind the [provider-neutral adapter](../wallet/privy-adapter.md).
[Privy configuration guide](https://docs.privy.io/basics/react/advanced/configuring-evm-networks).

## Obtain test gas and tokens

Use an ETH faucet listed in the
[Ethereum Sepolia resources](https://ethereum.org/developers/docs/networks/), such as
the [Alchemy Ethereum Sepolia faucet](https://www.alchemy.com/faucets/ethereum-sepolia).
Select Ethereum Sepolia and your own dedicated test wallet. Follow the faucet's
current account and eligibility requirements; no quota or availability is assumed.
Confirm the resulting gas balance on the configured network before sending.

For test USDC, open the [Circle faucet](https://faucet.circle.com/), choose Ethereum
Sepolia and your own test wallet. Resolve the token contract from the **Testnet**
section of [Circle's USDC address reference](https://developers.circle.com/stablecoins/usdc-contract-addresses).
Circle states that testnet USDC has no financial value and is not backed by real
dollars. Keep it visibly labeled as a test asset.

Verify ERC-20 contract code and decimals on the selected network. Never infer
decimals from a symbol or use ETH's 18 decimals for every token. Identify an asset
by chain and contract, parse amounts into integer raw strings, and keep gas ETH
separate from token balances. The faucet does not guarantee a tradable pair.

## Uniswap and swaps

For a direct v3 integration, inspect the **Ethereum Sepolia Addresses** column of
the [official deployment table](https://developers.uniswap.org/docs/protocols/v3/deployments/v3-ethereum-deployments).
Select the exact SDK/router path you implement. Verify its factory, quoter,
spender/router, wrapped native asset and contract code on `11155111`; never copy
the mainnet column. For a v3 pool, query the verified factory's
`getPool(tokenA, tokenB, feeTier)` and confirm that the pool can quote the intended
amount. A deployed router does not guarantee a pool or executable route.

Protocol deployment does not establish Sepolia support in the Uniswap Trading API,
Pods or another route provider. Verify the chosen service's current supported
networks and account capabilities separately. If no validated path exists, show
swaps as unavailable or use an explicitly labeled mock/local-fork exercise.

When a test route is available, validate token contracts, quote expiry, exact
input, minimum output, recipient, spender, chain and fee bound. Review an approval
separately from the swap; decode calldata before signing and reconcile each receipt.
Follow the [Uniswap manual](../swaps/uniswap.md) and
[execution contract](../swaps/execution.md).

## Manual validation sequence

Run these steps only in your explicitly enabled generated application with your
own test wallets and test assets:

1. Read `eth_chainId`, then verify the connected signer and visible testnet label.
2. Read native gas and selected token balances through the configured adapter.
3. Prepare a small test transfer to a second test wallet you own. Review network,
   recipient, exact amount and maximum fee, then obtain user approval.
4. Persist the operation before submission. Track its original reference through
   pending, included and execution status using your confirmation policy.
5. Check the recipient balance and receipt on the same chain. Test a restart while
   the operation is pending; reconcile rather than submitting a second spend.
6. If a verified swap path exists, test quote, allowance, approval and execution as
   distinct operations. Confirm actual output and status without relying on a quote.

Use synthetic I/O tests for mainnet/Base Sepolia mismatches, changed wallet/network,
unknown token or spender, missing gas, expired quote, altered recipient/minimum
output, reverted receipt and lost broadcast response. Assert rejection before
signing or submission where applicable. Kit checks remain offline and synthetic;
no on-chain validation is implied by `npm run check`.

## Acceptance and privacy

Display **Ethereum Sepolia — test assets** throughout wallet/send/swap screens.
Keep that label distinct from mock demo mode. A test receipt cannot authorize a
live balance, fiat settlement or production readiness. Do not associate test
wallets with real KYC documents, selfies or customer records. Keep wallet-owner
maps, RPC credentials and validation records private; publish only sanitized
results without real addresses or transaction histories.

Continue with [environment isolation](sandbox.md), [EVM wallets](../wallet/evm.md),
[application acceptance](../../prompts/acceptance-criteria.md) and
[validation](../operations/testing.md).
