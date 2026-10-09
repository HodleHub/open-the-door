# EVM wallet integration

EVM networks share transaction concepts but not chain IDs, contract deployments,
fees or token identity. Treat each supported network as a configured capability.

## Adapter responsibilities

Resolve the owner-scoped wallet, obtain the intended chain ID, check its observed
balance and prepare a transaction. Use a supported RPC/client library and runtime
validate all external responses. A token asset is network plus contract address
plus verified decimals; symbol alone is insufficient.

If using an externally owned account, handle nonce, gas and broadcast confirmation
in that adapter. If using a smart account, follow its selected account-abstraction
version, bundler and paymaster contracts. Those are adapter-specific requirements,
not universal EVM behavior.

## Sepolia testing

Follow the [Ethereum Sepolia manual](../getting-started/sepolia.md) for RPC setup,
test gas/tokens and a transfer validation sequence. Bind RPC, signer, transaction
and assets to chain `11155111`; reject mainnet and other test networks. A wallet
address does not identify its network. Keep test assets and operation records
separate from mock and live state, and show a persistent testnet label.

## Approvals and swaps

Read current allowance and request only the necessary approval under your product
policy. Validate spender against the selected protocol's official deployment list.
Decode returned calldata, check recipient, amount, minimum output, chain and deadline.
A successful allowance transaction does not mean the swap settled.

## Reconciliation

Persist transaction hash or user-operation reference. Track inclusion, execution
status and the confirmation policy you selected. A receipt must match the submitted
network and operation. Handle dropped/replaced transactions without creating a
second spend automatically.

Test wrong chain, misleading decimals, unknown spender, altered recipient, gas
above the approved bound and a failed receipt. See
[Uniswap](../swaps/uniswap.md), [signing](signing.md) and
[cross-chain recovery](../swaps/cross-chain.md).
