# Bitcoin tab

Build a dedicated Bitcoin experience with Spark, Lightning and on-chain
interoperability supported by your chosen wallet/provider. Keep all amounts and
network effects explicit; a Lightning identifier is not an EVM address.

## Reading path

1. [Spark](spark.md) and [Lightning](lightning.md).
2. [Breez SDK](breez.md) and [Flashnet](flashnet.md).
3. [LNURL overview](lnurl.md), [Pay](lnurl-pay.md), [Withdraw](lnurl-withdraw.md)
   and [Auth](lnurl-auth.md).
4. [Lightning addresses](lightning-address.md).
5. [Recovery](recovery.md).

## Screen behavior

Offer receive and pay actions appropriate to the selected adapter. Parse the
input type before requesting an action: BOLT11 invoice, Lightning address, LNURL,
Spark address or a supported Bitcoin address. Use trusted parsing libraries for
wire formats; never route arbitrary text straight to a signer.

Show sats, fees, destination, expiry and pending status. An LNURL lookup is a
network request; it is not payment authorization. A received invoice is not proof
of settlement. Present operation history and a recovery path for unresolved sends.

## Templates

[Breez runtime](../../templates/bitcoin/createBreezRuntime.ts) covers initialization
and lifecycle cleanup; [Lightning send](../../templates/bitcoin/prepareLightningSend.ts)
separates preparation from execution. [Flashnet preparation](../../templates/bitcoin/prepareFlashnetSwap.ts)
binds input/output amounts. [LNURL validation](../../templates/bitcoin/validateLnurlPayRequest.ts)
checks an already fetched parameter response; full networking and invoice
verification must be implemented separately.
