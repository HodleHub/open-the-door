# Lightning addresses

A Lightning address is a user-facing handle such as `demo@example.com`, not a
Bitcoin key or an email-delivery request. [LUD-16](https://github.com/lnurl/luds/blob/luds/16.md)
defines resolving it through `https://<domain>/.well-known/lnurlp/<username>` to
an LNURL Pay response.

## Serving addresses

Map an intentionally public handle to a private receiving-wallet reference.
Validate the path handle and return a bounded payRequest response for enabled
recipients. The callback creates an invoice for the requested allowed amount
through the configured wallet, preserving metadata semantics required by LNURL.

The public endpoint must never disclose the internal subject, provider profile,
wallet secret or a complete account record. Apply rate limits and response-size
limits. Keep handle policy separate from an application's login email.

## Paying an address

Parse handle/domain with a supported implementation, build the well-known URL
safely and fetch under a reviewed network policy. Validate the returned LNURL Pay
parameters and invoice before user approval. Do not send a payment based only on
the friendly address text.

## Verification

Test invalid handles, unknown recipient, disabled receive capability, metadata
hash mismatch, callback amount outside limits and private-network target. Track
settlement using the receiving wallet/backend; endpoint lookup and invoice creation
are not incoming payments.

Read [LNURL Pay](lnurl-pay.md), [Lightning](lightning.md) and
[multi-tenancy](../architecture/multi-tenancy.md).
