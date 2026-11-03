import { describe, expect, it, vi } from "vitest";
import { createSingleFlight } from "./singleFlight";

describe("createSingleFlight", () => {
  it("shares one request across overlapping submissions", async () => {
    let resolveRequest!: (value: string) => void;
    const task = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const singleFlight = createSingleFlight();

    const first = singleFlight.run(task);
    const second = singleFlight.run(task);

    expect(task).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
    expect(singleFlight.isRunning()).toBe(true);

    resolveRequest("verified");
    await expect(first).resolves.toBe("verified");
    expect(singleFlight.isRunning()).toBe(false);
  });

  it("allows another submission after the previous request settles", async () => {
    const task = vi.fn().mockResolvedValue("verified");
    const singleFlight = createSingleFlight();

    await singleFlight.run(task);
    await singleFlight.run(task);

    expect(task).toHaveBeenCalledTimes(2);
  });
});
