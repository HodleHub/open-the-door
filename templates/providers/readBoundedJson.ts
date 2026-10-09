import type { Result } from "../core/types.js";

export type ReadBoundedJsonArgs = { response: Response; maximumBytes: number };

/** Bound actual streamed bytes before parsing; never expose parse errors or body text. */
export const readBoundedJson = async (
  args: ReadBoundedJsonArgs,
): Promise<Result<unknown>> => {
  if (
    !Number.isSafeInteger(args.maximumBytes) ||
    args.maximumBytes < 1 ||
    args.maximumBytes > 1_048_576
  ) {
    return { success: false, code: "INVALID_RESPONSE_LIMIT" };
  }

  if (!args.response.body) return { success: false, code: "EMPTY_RESPONSE" };

  const reader = args.response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  try {
    for (;;) {
      const chunk = await reader.read();

      if (chunk.done) break;

      received += chunk.value.byteLength;

      if (received > args.maximumBytes) {
        await reader.cancel();

        return { success: false, code: "RESPONSE_TOO_LARGE" };
      }

      chunks.push(chunk.value);
    }

    const bytes = new Uint8Array(received);
    let offset = 0;

    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const value: unknown = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(bytes),
    );

    return { success: true, data: value };
  } catch {
    return { success: false, code: "INVALID_JSON_RESPONSE" };
  } finally {
    reader.releaseLock();
  }
};
