import test from "node:test";
import assert from "node:assert/strict";
import { parseAmount } from "../.build/templates/core/parseAmount.js";
import { createPrivyWalletAdapter } from "../.build/templates/wallet/createPrivyWalletAdapter.js";
import { projectKycDecision } from "../.build/templates/kyc/projectKycDecision.js";
import { requestJson } from "../.build/templates/providers/requestJson.js";
import { createPodsQuote } from "../.build/templates/providers/pods/createPodsQuote.js";
import { createWooviCharge } from "../.build/templates/providers/woovi/createWooviCharge.js";
import { calculateMinimumOutput } from "../.build/templates/swaps/calculateMinimumOutput.js";
import { createBreezRuntime } from "../.build/templates/bitcoin/createBreezRuntime.js";
import { prepareLightningSend } from "../.build/templates/bitcoin/prepareLightningSend.js";
import { prepareFlashnetSwap } from "../.build/templates/bitcoin/prepareFlashnetSwap.js";
import { validateLnurlPayRequest } from "../.build/templates/bitcoin/validateLnurlPayRequest.js";

const context = {
  subjectId: "subject_demo_a",
  tenantId: "tenant_demo",
  environment: "mock",
};
const wallet = { ...context, walletId: "wallet_demo", network: "spark-demo" };
const intent = {
  operationId: "operation_demo",
  walletId: "wallet_demo",
  network: "spark-demo",
  assetIdentifier: "asset_demo",
  amountRaw: "1000",
  destination: "recipient_demo",
  maximumFeeRaw: "10",
  expiresAtMs: 2000,
};

test("money preserves integers above Number precision and rejects malformed units", () => {
  assert.equal(
    parseAmount({ raw: "9007199254740993" }).data,
    9007199254740993n,
  );

  for (const raw of ["-1", "1.5", "01", "1e3", "", "1".repeat(79)]) {
    assert.equal(parseAmount({ raw }).success, false);
  }
});

test("another subject wallet is rejected before signing", async () => {
  let submitted = false;
  const provider = createPrivyWalletAdapter({
    now: () => 1000,
    verifyOwnership: async () => true,
    resolveOwnedWallet: async () => ({
      success: true,
      data: { ...wallet, subjectId: "subject_demo_b" },
    }),
    verifyApproval: async () => true,
    submitApproved: async () => {
      submitted = true;
      return {
        success: true,
        data: { externalReference: "external_demo", state: "submitted" },
      };
    },
  });

  assert.equal(
    (await provider.submit({ context, intent })).code,
    "WALLET_SCOPE_MISMATCH",
  );
  assert.equal(submitted, false);
});

test("network, expiry and approval are checked through the real wallet adapter path", async () => {
  let approved = false;
  let submits = 0;
  const provider = createPrivyWalletAdapter({
    now: () => 1000,
    verifyOwnership: async () => true,
    resolveOwnedWallet: async () => ({ success: true, data: wallet }),
    verifyApproval: async () => approved,
    submitApproved: async () => {
      submits += 1;
      return {
        success: true,
        data: { externalReference: "external_demo", state: "submitted" },
      };
    },
  });

  assert.equal(
    (
      await provider.submit({
        context,
        intent: { ...intent, network: "other-demo" },
      })
    ).code,
    "NETWORK_MISMATCH",
  );
  assert.equal(
    (
      await provider.submit({
        context,
        intent: { ...intent, expiresAtMs: 999 },
      })
    ).code,
    "INTENT_EXPIRED",
  );
  assert.equal(
    (await provider.submit({ context, intent })).code,
    "APPROVAL_REQUIRED",
  );
  assert.equal(submits, 0);
  approved = true;
  assert.equal(
    (await provider.submit({ context, intent })).data.state,
    "submitted",
  );
  assert.equal(submits, 1);
});

test("KYC unknown status and disabled rail cannot grant transaction capability", () => {
  const verifiedRails = { pix: false, usd: true, eur: false };
  const approved = projectKycDecision({
    verifiedState: "approved",
    policyVersion: "policy_demo",
    verifiedRails,
  });
  const unknown = projectKycDecision({
    verifiedState: "unexpected",
    policyVersion: "policy_demo",
    verifiedRails,
  });

  assert.equal(approved.pixEnabled, false);
  assert.equal(approved.usdEnabled, true);
  assert.equal(unknown.usdEnabled, false);
});

const transportArgs = {
  baseUrl: "https://provider.example",
  allowedOrigins: ["https://provider.example"],
  path: "/quote",
  method: "GET",
  headers: { Authorization: "fixture_secret_marker" },
};

test("HTTP transport rejects unapproved origins without making a request", async () => {
  let called = false;
  const response = await requestJson({
    ...transportArgs,
    baseUrl: "https://other.example",
    fetchImpl: async () => {
      called = true;
      return new Response("{}");
    },
  });

  assert.equal(response.code, "INVALID_PROVIDER_ORIGIN");
  assert.equal(called, false);
});

test("HTTP transport disables redirects and carries a bounded timeout", async () => {
  const response = await requestJson({
    ...transportArgs,
    fetchImpl: async (url, options) => {
      assert.equal(url.origin, "https://provider.example");
      assert.equal(options.redirect, "error");
      assert.ok(options.signal instanceof AbortSignal);
      return new Response('{"demo":true}');
    },
  });

  assert.deepEqual(response, { success: true, data: { demo: true } });
});

test("HTTP failures and parse errors do not expose raw provider bodies or credentials", async () => {
  const failed = await requestJson({
    ...transportArgs,
    fetchImpl: async () =>
      new Response("fixture_sensitive_marker", { status: 422 }),
  });
  const invalid = await requestJson({
    ...transportArgs,
    fetchImpl: async () => new Response("fixture_sensitive_marker"),
  });

  assert.equal(failed.code, "PROVIDER_HTTP_ERROR");
  assert.equal(invalid.code, "INVALID_JSON_RESPONSE");
  assert.doesNotMatch(
    JSON.stringify([failed, invalid]),
    /fixture_sensitive_marker|fixture_secret_marker/,
  );
});

test("actual response bytes are limited even without Content-Length", async () => {
  const response = await requestJson({
    ...transportArgs,
    maximumBytes: 8,
    fetchImpl: async () => new Response('{"oversized":true}'),
  });

  assert.equal(response.code, "RESPONSE_TOO_LARGE");
});

const podsArgs = {
  originChain: "network-demo-a",
  destinationChain: "network-demo-b",
  tokenIn: "asset_demo_a",
  tokenOut: "asset_demo_b",
  amountIn: "1000",
  nowMs: 1000,
};
const podsPayload = {
  quote: {
    quoteId: "quote_demo",
    deadline: 3,
    tokenIn: { amount: "1000" },
    tokenOut: { amount: "950" },
  },
};

test("Pods request runs through bounded transport and projects only quote fields", async () => {
  const result = await createPodsQuote({
    ...podsArgs,
    transport: (request) =>
      requestJson({
        ...transportArgs,
        ...request,
        fetchImpl: async (url) => {
          assert.equal(url.pathname, "/v2/swap/quote");
          assert.equal(url.searchParams.get("amountIn"), "1000");
          return new Response(
            JSON.stringify({
              ...podsPayload,
              customerData: "fixture_sensitive_marker",
            }),
          );
        },
      }),
  });

  assert.equal(result.data.expiresAtMs, 3000);
  assert.doesNotMatch(JSON.stringify(result), /fixture_sensitive_marker/);
});

test("Pods stale, malformed and mismatched quote responses fail closed", async () => {
  const stale = await createPodsQuote({
    ...podsArgs,
    nowMs: 4000,
    transport: async () => ({ success: true, data: podsPayload }),
  });
  const malformed = await createPodsQuote({
    ...podsArgs,
    transport: async () => ({ success: true, data: { quote: {} } }),
  });
  const mismatched = await createPodsQuote({
    ...podsArgs,
    amountIn: "900",
    transport: async () => ({ success: true, data: podsPayload }),
  });

  assert.equal(stale.code, "QUOTE_EXPIRED");
  assert.equal(malformed.code, "INVALID_PODS_RESPONSE");
  assert.equal(mismatched.code, "QUOTE_INPUT_MISMATCH");
});

test("Woovi charge uses cents/correlation and never returns identity-bearing extras", async () => {
  const result = await createWooviCharge({
    correlationId: "charge_demo",
    valueCents: 2500,
    transport: (request) =>
      requestJson({
        ...transportArgs,
        ...request,
        fetchImpl: async (url, options) => {
          assert.equal(url.pathname, "/api/v1/charge");
          assert.deepEqual(JSON.parse(options.body), {
            correlationID: "charge_demo",
            value: 2500,
          });
          return new Response(
            JSON.stringify({
              charge: {
                correlationID: "charge_demo",
                value: 2500,
                status: "ACTIVE",
                customer: "fixture_sensitive_marker",
              },
            }),
          );
        },
      }),
  });

  assert.equal(result.data.providerStatus, "ACTIVE");
  assert.doesNotMatch(JSON.stringify(result), /fixture_sensitive_marker/);
});

test("Woovi amount mismatch is rejected rather than accepted for settlement", async () => {
  const result = await createWooviCharge({
    correlationId: "charge_demo",
    valueCents: 2500,
    transport: async () => ({
      success: true,
      data: {
        charge: { correlationID: "charge_demo", value: 2000, status: "ACTIVE" },
      },
    }),
  });

  assert.equal(result.code, "INVALID_WOOVI_RESPONSE");
});

test("integer slippage rounds down with no Number precision loss", () => {
  const result = calculateMinimumOutput({
    expectedRaw: "9007199254740993",
    slippageBps: 125,
  });

  assert.equal(result.data, ((9007199254740993n * 9875n) / 10000n).toString());
  assert.equal(
    calculateMinimumOutput({ expectedRaw: "1000", slippageBps: 10_000 })
      .success,
    false,
  );
});

test("Breez runtime parallel callers share initialization and close cleans the listener", async () => {
  let connects = 0;
  const events = [];
  const sdk = { reference: "sdk_demo" };
  const runtime = createBreezRuntime({
    connect: async () => {
      connects += 1;
      return sdk;
    },
    subscribe: async () => async () => {
      events.push("unsubscribed");
    },
    disconnect: async () => {
      events.push("disconnected");
    },
  });

  const instances = await Promise.all([
    runtime.get(),
    runtime.get(),
    runtime.get(),
  ]);

  assert.equal(connects, 1);
  assert.ok(instances.every((instance) => instance === sdk));
  await runtime.close();
  assert.deepEqual(events, ["unsubscribed", "disconnected"]);
  await runtime.get();
  assert.equal(connects, 2);
  await runtime.close();
});

test("Breez failed initialization can recover and exposes only safe errors", async () => {
  let attempts = 0;
  const runtime = createBreezRuntime({
    connect: async () => {
      attempts += 1;
      if (attempts === 1) throw new Error("fixture_sensitive_marker");
      return { reference: "sdk_demo" };
    },
    subscribe: async () => async () => {},
    disconnect: async () => {},
  });

  await assert.rejects(runtime.get(), /^Error: SDK_INITIALIZATION_FAILED$/);
  assert.equal((await runtime.get()).reference, "sdk_demo");
  await runtime.close();
});

test("Breez subscription failure disconnects the partially initialized SDK", async () => {
  let disconnected = 0;
  const runtime = createBreezRuntime({
    connect: async () => ({}),
    subscribe: async () => {
      throw new Error("fixture_sensitive_marker");
    },
    disconnect: async () => {
      disconnected += 1;
    },
  });

  await assert.rejects(runtime.get(), /^Error: SDK_INITIALIZATION_FAILED$/);
  assert.equal(disconnected, 1);
});

test("Lightning changed amount or fee cannot reuse the prepared intent", async () => {
  const invoice = {
    referenceId: "invoice_demo",
    network: "spark-demo",
    amountMsatRaw: "1000000",
    expiresAtMs: 3000,
  };
  const plan = {
    planReference: "plan_demo",
    invoiceReference: "invoice_demo",
    amountMsatRaw: "1000000",
    feeMsatRaw: "5",
    expiresAtMs: 2000,
  };
  const args = {
    invoice,
    network: "spark-demo",
    maximumFeeMsatRaw: "10",
    nowMs: 1000,
  };

  assert.equal(
    (
      await prepareLightningSend({
        ...args,
        prepare: async () => ({ success: true, data: plan }),
      })
    ).success,
    true,
  );
  assert.equal(
    (
      await prepareLightningSend({
        ...args,
        prepare: async () => ({
          success: true,
          data: { ...plan, feeMsatRaw: "11" },
        }),
      })
    ).code,
    "LIGHTNING_PLAN_MISMATCH",
  );
  assert.equal(
    (
      await prepareLightningSend({
        ...args,
        prepare: async () => ({
          success: true,
          data: { ...plan, amountMsatRaw: "2000000" },
        }),
      })
    ).code,
    "LIGHTNING_PLAN_MISMATCH",
  );
});

test("Flashnet preparation binds integer minimum output and rejects stale plan", async () => {
  const args = {
    poolId: "pool_demo",
    tokenIn: "asset_demo_a",
    tokenOut: "asset_demo_b",
    amountInRaw: "1000",
    slippageBps: 100,
    nowMs: 1000,
  };
  const valid = await prepareFlashnetSwap({
    ...args,
    quotePool: async () => ({
      success: true,
      data: { expectedAmountOutRaw: "950", expiresAtMs: 3000 },
    }),
  });
  const stale = await prepareFlashnetSwap({
    ...args,
    quotePool: async () => ({
      success: true,
      data: { expectedAmountOutRaw: "950", expiresAtMs: 999 },
    }),
  });

  assert.equal(valid.data.minimumAmountOutRaw, "940");
  assert.equal(stale.code, "QUOTE_EXPIRED");
});

test("LNURL preserves exact metadata and rejects disallowed callback or amount", () => {
  const value = {
    tag: "payRequest",
    callback: "https://pay.example/callback",
    minSendable: 1000,
    maxSendable: 100000,
    metadata: '[["text/plain", "Synthetic payment"]]',
  };
  const args = {
    value,
    amountMsatRaw: "5000",
    isAllowedCallback: (url) => url.hostname === "pay.example",
  };

  assert.equal(validateLnurlPayRequest(args).data.metadata, value.metadata);
  assert.equal(
    validateLnurlPayRequest({ ...args, amountMsatRaw: "999" }).success,
    false,
  );
  assert.equal(
    validateLnurlPayRequest({ ...args, isAllowedCallback: () => false })
      .success,
    false,
  );
  assert.equal(
    validateLnurlPayRequest({
      ...args,
      value: { ...value, maxSendable: Number.NaN },
    }).success,
    false,
  );
});
