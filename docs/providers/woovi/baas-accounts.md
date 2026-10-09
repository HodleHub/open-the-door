# Create customer accounts with Woovi BaaS

BaaS requires your approved operator account, enabled BaaS/account-creation features
and the appropriate Master API. Follow [activation](https://developers.woovi.com/docs/baas/ativacao-baas)
first. Your app starts onboarding; provider review determines account approval.

## Onboard a customer

Use `POST /api/v1/kyc/onboarding` with the currently required fields and a stable
correlation ID. Prefer the documented hosted onboarding link so customers submit
sensitive documents directly to the provider. Keep the returned link out of logs
and analytics. This flow is not a generic guarantee of support for every individual
or company profile; verify eligibility for your product.

Read [documents/KYC](https://developers.woovi.com/docs/baas/documentos-kyc)
and [KYC Onboarding](https://developers.woovi.com/docs/category/kyc-onboarding).
Build requests from protected runtime inputs. This kit intentionally includes no
valid tax-ID fixture or live onboarding response.

## Account activation

Subscribe to the documented account-register events and refresh authoritative
status through the correct account scope. Persist provider account ID privately.
A frontend redirect from onboarding is not proof of approval.

Only after the bank account exists, create its account-scoped API application with
the documented `/api/v1/application` flow. Validate scope with a documented read-only
request before persisting an active credential. Configure required Pix keys and
webhooks using that account's permitted access.

## Recovery

Pending review remains pending; corrected onboarding follows the provider's supported
path. An identity conflict is a restricted review case. A lost application-creation
response requires finding/reconciling the existing application before creating another.
See [basic flow](https://developers.woovi.com/docs/baas/basic-flux-baas),
[authentication](authentication.md) and [webhooks](webhooks.md).
