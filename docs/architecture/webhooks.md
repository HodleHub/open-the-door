# Webhook ingestion

A webhook is a notification that triggers verification. It is not an instruction
to credit money or approve KYC without checking the provider account and resource.

## Receiver sequence

1. Enforce body and request limits before parsing.
2. Verify the documented signature or configured authorization on raw bytes where
   the provider requires it. Reject missing/invalid authentication.
3. Bind the webhook to the configured provider account and environment.
4. Decode an allowlisted event shape; unknown events do not alter balances.
5. Store a durable event with a unique deduplication key.
6. Acknowledge after persistence; process asynchronously.
7. Fetch authoritative state through the same provider-account binding before a
   material decision or journal posting.

## Duplicates and ordering

Events can be duplicated, delayed or arrive in a different order. Use atomic
transition rules so a late pending event cannot roll settled state backward.
Deduplicate the transport event and enforce one business effect independently.
If an event ID is unavailable, construct a stable key from documented immutable
resource fields and event type, without embedding PII in the key.

## Privacy

Never log raw webhook bodies or complete authentication headers. Store only fields
needed for reconciliation and approved audit retention. Verify the resource's
owner in the local operation mapping. Do not accept tenant IDs from the payload
as proof of ownership.

Test invalid authentication, duplicate events, reordered terminal events and a
resource belonging to another tenant. Read [Woovi webhooks](../providers/woovi/webhooks.md)
for registration guidance and [testing](../operations/testing.md) for acceptance.
