# Woovi AppID and account scope

The general API guide specifies the raw AppID in the `Authorization` header,
without a Bearer prefix. Keep credential handling in a fixed server-side transport.
See [API getting started](https://developers.woovi.com/docs/apis/api-getting-started)
for current instructions and scopes.

## Credential separation

Use distinct credentials for sandbox, operator access and customer-account access.
A Master API can manage account integrations where enabled; do not send that
credential to the browser or use it for every customer's ordinary operation.

After a customer account exists and is verified, create a narrowly scoped
application for that account using the documented application API. Store its
credential encrypted and map it to the tenant/account privately. Validate a
read-only operation in the resulting account scope before activating it.

## HTTP policy

Use HTTPS, a fixed configured host, bounded requests and redirect rejection.
The [transport template](../../../templates/providers/requestJson.ts) enforces
those properties. Never expose complete headers, AppIDs or provider response
objects in logs or error messages.

Some generated guide snippets may differ from the general auth instructions.
Resolve discrepancies against the current endpoint reference and your authorized
provider guidance before implementation; the minimal charge template follows the
general raw-AppID contract.

## Rotation

Create replacement credentials with least privilege, verify the intended account,
update the secret reference and retire old access after pending operations are
reconciled. An authentication error disables the affected adapter; it must not
fall back to a more privileged Master key automatically.
Read [secrets](../../security/secrets.md) and [BaaS accounts](baas-accounts.md).
