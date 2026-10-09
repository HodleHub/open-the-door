# Prompt: add one provider adapter

Use this after the application exists and the operator has confirmed provider
access. Fill in PROVIDER_NAME and CAPABILITY without including credentials.

---

Implement PROVIDER_NAME for CAPABILITY behind the existing domain ports. Read
AGENTS.md, docs/providers/contracts.md, the relevant provider manual and current
official endpoint/SDK documentation. Verify account access, environment, scopes,
amount units, idempotency and final status before choosing implementation details.

Keep credentials in injected server configuration. Validate every external response
at runtime and return only the normalized fields the domain requires. Preserve
owner/tenant/environment scope, integer amounts, accepted-plan binding and safe
error codes. Keep raw request bodies, headers, URLs, evidence and SDK responses
out of logs.

Use the existing durable operation/outbox path. Distinguish quote/preparation,
user approval, submission and settlement. On ambiguous submission, reconcile the
existing reference rather than creating a second payment. Verify callbacks and
fetch authoritative state before material decisions or ledger effects.

Add synthetic external-boundary tests for malformed responses, wrong account/
network/recipient, expired quote, disabled capability, response loss after acceptance
and duplicate/reordered events. Run application checks and update its README with
account setup, exact enabled scope, current API/SDK version, recovery behavior and
validation limits.

Do not call live money-moving endpoints, deploy, publish the repository or add
private source/data as part of this implementation prompt. Report exactly which
external validation remains for the authorized operator.
