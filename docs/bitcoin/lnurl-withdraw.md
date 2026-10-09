# LNURL Withdraw

[LUD-03](https://github.com/lnurl/luds/blob/luds/03.md) defines a withdrawal challenge.
The service publishes callback, `k1`, default description and min/max withdrawable
millisatoshis. The user's wallet creates a receiving invoice and submits it with
the challenge to the callback.

## Service implementation

Bind an unguessable challenge to the authorized withdrawal, amount limits,
expiration and owner. Store only a protected representation where practical.
Validate the submitted invoice network, amount and expiry with a supported parser.
Claim the challenge atomically before starting one payment. A repeated request
must return the existing outcome rather than pay twice.

## Wallet implementation

Validate the endpoint and response shape, choose an allowed amount and create an
invoice through the owner-scoped receiving adapter. Submit `k1` and `pr` through
the documented callback. Track invoice settlement through the receiving backend;
callback acceptance alone does not mean funds arrived.

## Recovery

An ambiguous callback/send outcome requires lookup of the original operation.
Do not create another challenge or pay another invoice until the first outcome
is established. Treat the full withdraw URL and challenge as temporary credentials;
exclude them from logs, analytics and public fixtures.

Test challenge replay, concurrent redemption, wrong amount/network, expired
challenge and a process crash after payment acceptance. Read
[operation lifecycle](../architecture/operation-lifecycle.md), [Lightning](lightning.md)
and [LNURL overview](lnurl.md).
