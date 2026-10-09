# LNURL Pay

[LUD-06](https://github.com/lnurl/luds/blob/luds/06.md) defines the pay request.
An initial lookup returns `tag: payRequest`, callback, metadata and min/max
sendable amounts in millisatoshis. The wallet selects an allowed amount and asks
the callback for an invoice.

## Validate the response

Check tag, bounded integer min/max, callback URL and metadata string. Metadata
is itself JSON encoded as a string. Preserve its exact string for the invoice
description-hash verification required by the protocol. Use a reviewed invoice
parser and verify requested amount, network, expiry and description hash before
signing/paying.

[validateLnurlPayRequest.ts](../../templates/bitcoin/validateLnurlPayRequest.ts)
checks a fetched parameter response and amount bounds only. It does not fetch
URLs, parse invoices or verify metadata hashes.

## Application integration

Fetch under a strict URL/network policy. Add the selected amount to the callback
using a URL API rather than concatenating untrusted text. Parse the returned
invoice and any supported extensions, show the validated plan and prepare its
fee bound. Persist the payment reference and reconcile actual settlement.

## Negative tests

Reject an amount outside bounds, malformed metadata, private-network callback,
redirect to an unapproved host, wrong invoice amount/hash/network and expired
invoice. A callback HTTP success cannot mark the application operation paid.
Do not replay an unresolved payment with a replacement invoice automatically.
Read [Lightning addresses](lightning-address.md) and [LNURL overview](lnurl.md).
