interface ForegroundPollingOptions {
  poll: () => void | Promise<void>;
  intervalMs: number;
  isHidden?: () => boolean;
  setIntervalFn?: (
    handler: () => void,
    delay: number,
  ) => ReturnType<typeof setInterval>;
  clearIntervalFn?: (handle: ReturnType<typeof setInterval>) => void;
}

export const startForegroundPolling = ({
  poll,
  intervalMs,
  isHidden = () => typeof document !== "undefined" && document.hidden,
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval,
}: ForegroundPollingOptions): (() => void) => {
  const handle = setIntervalFn(() => {
    if (!isHidden()) void poll();
  }, intervalMs);

  return () => clearIntervalFn(handle);
};
