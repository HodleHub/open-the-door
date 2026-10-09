# Bitcoin payment recovery

SDK event listeners are useful for responsiveness, but durable payment recovery
must work after a process or device restarts.

## Persist before execution

Record subject, wallet, environment, approved plan, fee bound, provider binding
and operation ID. Store external payment/order/transaction references as soon as
they are available. Keep invoice/challenge data under restricted handling and
avoid logging it.

## Restart procedure

Reinitialize the correct owner-scoped runtime, restore its documented state and
query pending/unknown operations. Decode current provider outcomes and apply
idempotent transitions. Historical SDK events may be replayed; deduplicate business
effects independently of transport events.

An unavailable status remains unknown. Preserve funds/reservations according to
the custody/accounting design and show the existing operation to the user. Do not
attempt a new send because an SDK timer or HTTP connection failed.

## Special cases

For a multi-leg Flashnet route, reconcile origin, destination and refund separately.
For LNURL Pay, verify the original invoice/payment before requesting a replacement.
For Withdraw, retain the claimed challenge and original outcome so redemption
cannot be paid twice. If a provider offers fee acceptance or recovery actions,
validate them against the original authorized operation.

Test acceptance followed by a crash, listener cleanup/reconnect, duplicate historical
events, delayed destination and refund completion. Read
[Breez](breez.md), [Flashnet](flashnet.md), [jobs](../architecture/jobs.md) and
[wallet recovery](../wallet/recovery.md).
