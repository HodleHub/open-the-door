# Prepare, review and execute

The provider's executable output crosses a trust boundary. Independently validate
its effects before asking the signer to authorize it.

## Sequence

1. Load the owner-scoped quote and wallet.
2. Verify capability, expiry and immutable accepted plan.
3. Request executable preparation through the chosen adapter.
4. Decode every transaction, approval and destination effect.
5. Compare chain, assets, amounts, recipient, spender, fees and deadline to the plan.
6. Show the validated plan and obtain the required user approval.
7. Submit once under a durable application operation.
8. Store external references and reconcile final delivery.

For EVM, use verified protocol deployment addresses and supported ABI decoding.
For other networks, validate their complete transaction/instruction format. An
allowlisted router alone is insufficient if its calldata contains a different
recipient or amount.

## Multiple actions

Some routes need approval plus swap or several external legs. Track each action
with its own status and relate it to the parent operation. Do not label a token
approval or origin transfer as a completed trade.

## Unknown outcomes

If signing/broadcast/acceptance is uncertain, preserve the operation and reconcile
its references. Never silently re-sign a different payload or choose a new provider.
A changed route requires a new plan and fresh consent.

Test recipient replacement, wrong chain, unknown spender, expired deadline,
excessive allowance, output below minimum and a restart between submission and
persistence. See [EVM](../wallet/evm.md), [Uniswap](uniswap.md),
[cross-chain recovery](cross-chain.md) and [jobs](../architecture/jobs.md).
