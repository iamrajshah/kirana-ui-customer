import { describe, expect, it, vi } from "vitest";
import { startForegroundPolling } from "./foregroundPolling";

describe("startForegroundPolling", () => {
  it("polls only while the storefront is visible and cleans up", () => {
    const poll = vi.fn();
    const clearIntervalFn = vi.fn();
    let scheduled: (() => void) | undefined;
    let hidden = false;
    const handle = 17 as unknown as ReturnType<typeof setInterval>;

    const stop = startForegroundPolling({
      poll,
      intervalMs: 15_000,
      isHidden: () => hidden,
      setIntervalFn: (handler, delay) => {
        expect(delay).toBe(15_000);
        scheduled = handler;
        return handle;
      },
      clearIntervalFn,
    });

    scheduled?.();
    expect(poll).toHaveBeenCalledTimes(1);

    hidden = true;
    scheduled?.();
    expect(poll).toHaveBeenCalledTimes(1);

    stop();
    expect(clearIntervalFn).toHaveBeenCalledWith(handle);
  });
});
