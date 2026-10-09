# Self-host our liveness capture

Use [HodleHub/aws-rekognition-liveness](https://github.com/HodleHub/aws-rekognition-liveness),
the public standalone capture/proxy project. It includes a React capture page and
localized pt-BR instructions. You own its deployment and AWS resources; AWS
Rekognition performs analysis.

## Install

```sh
git clone https://github.com/HodleHub/aws-rekognition-liveness.git
cd aws-rekognition-liveness
cp .env.example .env
pnpm install
pnpm dev
```

Follow that repository's current README for exact supported versions, configuration,
permissions, checks and production commands. Without a valid session link, the
page intentionally cannot complete a capture.

## Your application contract

Your backend authenticates the customer, creates/obtains an authorized AWS session
and issues a token bound to the attempt. Build the capture URL using URLSearchParams
with `sessionId` and `token` in the fragment. Treat the full link as a temporary
credential and exclude it from logs and analytics.

Configure your own AWS region/Cognito identity pool and a fixed trusted validator
endpoint. The validator must verify token/session binding, obtain the AWS result,
apply your policy and persist the decision. Return explicit `{ "success": true }`
only after approval. The application reads its own persisted backend outcome.

## Deployment checklist

Use HTTPS, least-privilege temporary capture permissions and server-only verification
permissions. Match the session region, constrain the validator URL, test CSP/camera
permissions and implement retention/consent. Run the capture project's documented
checks before deployment. Do not reuse another operator's cloud pool or long-lived
AWS credentials.

See [liveness trust model](liveness.md), [AWS session API](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_CreateFaceLivenessSession.html)
and the upstream README for details. This guide links the public project; it does
not import any private application configuration.
