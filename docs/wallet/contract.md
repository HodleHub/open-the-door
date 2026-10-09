# Wallet contract

The application uses a stable wallet ID and opaque subject. The adapter resolves
any provider-specific wallet ID through a protected mapping. Do not make a raw
address or a provider DID the authority for selecting a wallet.

## Minimum operations

| Operation | Input                              | Output                            |
| --------- | ---------------------------------- | --------------------------------- |
| Resolve   | Verified context, wallet ID        | Owner-scoped wallet metadata      |
| Receive   | Wallet ID, asset/network           | Address or invoice preparation    |
| Balance   | Wallet ID, asset/network           | Raw amount and observation time   |
| Submit    | Wallet ID, approved signing intent | External operation reference      |
| Status    | Scoped operation reference         | Normalized pending/terminal state |

Different networks may expose different receiving methods. Keep optional capabilities
explicit instead of pretending every wallet implements EVM transactions, Spark
transfers and Lightning invoices with the same wire format.

## Signing intent

A signed intent binds application operation ID, wallet ID, owner scope, network,
asset identifier, raw amount, recipient, maximum fee and expiration. Network-specific
payloads belong behind adapters and must be validated against this intent before
signing. A client-provided operation ID is not proof that an approval exists.

## Error behavior

Use stable codes for unavailable capability, ownership mismatch, expired intent,
invalid network and unknown outcome. Never return raw SDK errors or signing material
in an HTTP response. See [template types](../../templates/wallet/walletProvider.ts)
and [boundary example](../../templates/wallet/createPrivyWalletAdapter.ts).

Validate that a wrong subject is rejected before the provider call, a network
mismatch cannot be signed and a prepared transaction cannot replace the approved
recipient. Read [signing](signing.md) for the full preparation/review sequence.
