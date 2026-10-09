# Builder roadmap

The starter kit prioritizes reusable instructions and small original templates.
These milestones describe a builder's application journey; they are not claims
that the kit contains a deployed banking product.

## Phase 1: usable synthetic product

Complete the [one-prompt build](../prompts/build-neobank.md), implement the screen
map and pass [acceptance criteria](../prompts/acceptance-criteria.md). Establish
provider-neutral identity/wallet ports, exact amounts, operation persistence and
mock status/recovery. No provider credentials are required.

## Phase 2: approved external test integrations

Create your own provider accounts. Implement Pods pricing and authorized KYC/ramp
paths, Woovi sandbox charge/status handling, and your selected wallet adapter.
Validate ownership, capabilities and callback authenticity. Add liveness with
owned AWS resources and a trusted validator when required.

## Phase 3: swaps and Bitcoin

Implement transaction decoding/signing policy and one swap adapter. Add reviewed
Uniswap/other provider paths as needed. Implement Spark/Lightning receiving,
Breez runtime lifecycle, Flashnet preparation and supported LNURL flows. Validate
recovery after restart and ambiguous outcomes.

## Phase 4: controlled operations

Complete custody, privacy, retention, secrets, journal/outbox recovery and
reconciliation for the actual product. Activate only approved live capabilities
through an operator procedure after external validation.

## Public release

Review all content and fresh history through [publication](security/publication.md).
Keep repository visibility private until an explicitly authorized release action.
Measure documentation quality by whether a new builder can finish a flow and
recover its failures, not by claiming an unverified percentage of another codebase.
