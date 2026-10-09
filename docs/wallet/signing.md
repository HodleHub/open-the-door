# Signing and user approval

Prepare a plan, show it to the user, then sign only the plan they accepted. Signing
an arbitrary provider payload is not a safe implementation of a send button.

## Preparation

Resolve the wallet with verified context. Validate destination/network and asset
identity. Convert the requested display amount to exact smallest units. Prepare
the provider transaction and decode its effect independently: recipient, amount,
spender, approvals, contract calls, value and chain must match the intent.

Persist the prepared plan and its digest. Bind fee bounds, quote expiry and request
idempotency to the operation. A requote or changed transaction requires fresh
approval; do not reuse a previous acceptance for a new destination or price.

## Review and submission

Show amount, asset, network, recipient, minimum output if applicable and a full fee
breakdown. Have the selected signer enforce its documented authentication/approval
policy. Before submission, verify the plan is still valid and the wallet/capability
still belongs to the same context.

Store the external transaction or operation reference immediately. A broadcast
response is not settlement. Reconcile via network/provider status and keep uncertain
outcomes visible rather than retrying a second transfer.

## Negative checks

Reject another user's wallet, altered recipient, wrong chain, expired quote,
excess fees, an unknown contract target and mismatched token allowance. Verify that
an approval for token X does not authorize spending token Y. Read
[EVM](evm.md), [swap execution](../swaps/execution.md) and
[operation lifecycle](../architecture/operation-lifecycle.md).
