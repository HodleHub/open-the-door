import { readBoundedJson } from "./readBoundedJson.js";
import type { Result } from "../core/types.js";

export type JsonTransport = (args: {
  path: string;
  method: "GET" | "POST";
  body?: unknown;
}) => Promise<Result<unknown>>;

export type RequestJsonArgs = {
  baseUrl: string;
  allowedOrigins: string[];
  path: string;
  method: "GET" | "POST";
  headers: Record<string, string>;
  body?: unknown;
  fetchImpl: typeof fetch;
  timeoutMs?: number;
  maximumBytes?: number;
};

/** Fixed-origin HTTPS transport. Allowed origins must come from trusted operator configuration. */
export const requestJson = async (
  args: RequestJsonArgs,
): Promise<Result<unknown>> => {
  try {
    const base = new URL(args.baseUrl);

    if (
      base.protocol !== "https:" ||
      base.username ||
      base.password ||
      !args.allowedOrigins.includes(base.origin)
    ) {
      return { success: false, code: "INVALID_PROVIDER_ORIGIN" };
    }

    if (!args.path.startsWith("/") || args.path.startsWith("//")) {
      return { success: false, code: "INVALID_PROVIDER_PATH" };
    }

    const url = new URL(args.path, base);
    const timeoutMs = args.timeoutMs ?? 10_000;

    if (
      url.origin !== base.origin ||
      !Number.isSafeInteger(timeoutMs) ||
      timeoutMs < 1 ||
      timeoutMs > 60_000
    ) {
      return { success: false, code: "INVALID_REQUEST_CONFIGURATION" };
    }

    const response = await args.fetchImpl(url, {
      method: args.method,
      headers: {
        ...args.headers,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      redirect: "error",
      signal: AbortSignal.timeout(timeoutMs),
      ...(args.body === undefined ? {} : { body: JSON.stringify(args.body) }),
    });

    if (!response.ok) {
      await response.body?.cancel();

      return { success: false, code: "PROVIDER_HTTP_ERROR" };
    }

    return await readBoundedJson({
      response,
      maximumBytes: args.maximumBytes ?? 32_768,
    });
  } catch {
    return { success: false, code: "PROVIDER_REQUEST_FAILED" };
  }
};
