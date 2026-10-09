export type BreezRuntimeDependencies<T> = {
  connect: () => Promise<T>;
  subscribe: (sdk: T) => Promise<() => Promise<void>>;
  disconnect: (sdk: T) => Promise<void>;
};

/** One instance per wallet/environment. Inject the selected Spark SDK bindings and durable event handler. */
export const createBreezRuntime = <T>(
  dependencies: BreezRuntimeDependencies<T>,
): {
  get: () => Promise<T>;
  close: () => Promise<void>;
} => {
  let pending: Promise<T> | undefined;
  let unsubscribe: (() => Promise<void>) | undefined;
  let closing: Promise<void> | undefined;

  const initialize = async (): Promise<T> => {
    const sdk = await dependencies.connect();

    try {
      unsubscribe = await dependencies.subscribe(sdk);

      return sdk;
    } catch {
      await dependencies.disconnect(sdk);

      throw new Error("SDK_SUBSCRIPTION_FAILED");
    }
  };

  const get = async (): Promise<T> => {
    if (closing) await closing;
    if (pending) return pending;

    pending = initialize().catch(() => {
      pending = undefined;

      throw new Error("SDK_INITIALIZATION_FAILED");
    });

    return pending;
  };

  const close = async (): Promise<void> => {
    if (closing) return closing;

    const current = pending;

    closing = (async (): Promise<void> => {
      try {
        if (!current) return;

        const sdk = await current;

        try {
          await unsubscribe?.();
        } finally {
          await dependencies.disconnect(sdk);
        }
      } finally {
        pending = undefined;
        unsubscribe = undefined;
      }
    })();

    try {
      await closing;
    } catch {
      throw new Error("SDK_CLOSE_FAILED");
    } finally {
      closing = undefined;
    }
  };

  return { get, close };
};
