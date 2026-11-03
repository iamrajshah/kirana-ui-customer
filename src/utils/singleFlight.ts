export interface SingleFlight {
  isRunning(): boolean;
  run<T>(task: () => Promise<T>): Promise<T>;
}

/**
 * Coalesces overlapping invocations into one request. This is intentionally
 * independent of React state because a second click can arrive before a state
 * update has disabled the control.
 */
export const createSingleFlight = (): SingleFlight => {
  let inFlight: Promise<unknown> | null = null;

  return {
    isRunning: () => inFlight !== null,
    run<T>(task: () => Promise<T>): Promise<T> {
      if (inFlight) return inFlight as Promise<T>;

      const request = task().finally(() => {
        if (inFlight === request) inFlight = null;
      });
      inFlight = request;
      return request;
    },
  };
};
