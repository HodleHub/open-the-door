# LNURL: what it does

LNURL connects a Lightning wallet to an HTTP service for a specific interaction.
It can describe a payment request, a withdrawal challenge or authentication.
Lookup and callback stages are separate from actual Lightning settlement.

| Flow              | Purpose                                                    | Guide                           |
| ----------------- | ---------------------------------------------------------- | ------------------------------- |
| LNURL Pay         | Discover payment limits/metadata and request an invoice    | [Pay](lnurl-pay.md)             |
| LNURL Withdraw    | Present a receiving invoice against a withdrawal challenge | [Withdraw](lnurl-withdraw.md)   |
| LNURL Auth        | Sign a domain-scoped login challenge                       | [Auth](lnurl-auth.md)           |
| Lightning address | Resolve a human handle to LNURL Pay                        | [Address](lightning-address.md) |

Use the [LUD specification index](https://github.com/lnurl/luds) as the protocol
source. Support only the extensions your wallet/service implements. Use reviewed
Bech32 and invoice parsing libraries; do not write a format parser from a short
example.

## Trust boundary

An LNURL can point to a hostile HTTP endpoint. Validate scheme, destination and
redirects, apply DNS/private-network protections, and cap duration/size. If an
application fetches remotely on a user's behalf, implement SSRF controls before
enabling arbitrary user input.

Treat challenges, callbacks, invoices and full LNURL values as sensitive when
linked to a customer or withdrawal. Do not log them automatically.

## User approval

Lookup returns a proposed interaction. The wallet must validate the response,
show amount/metadata and require the appropriate approval. LNURL Auth must not
be presented as a payment. An HTTP callback success is not proof that money settled.
Read [Lightning](lightning.md) and [recovery](recovery.md).
