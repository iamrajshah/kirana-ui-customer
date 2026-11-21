import { webcrypto } from "node:crypto";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { checkoutRequestKey, completeCheckoutAttempt } from "./checkoutAttempt";

const values = new Map<string, string>();
beforeEach(() => {
  values.clear();
  vi.stubGlobal("crypto", webcrypto);
  vi.stubGlobal("sessionStorage", {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("shopper checkout recovery key", () => {
  it("reuses the persisted key after response loss without persisting delivery details", async () => {
    const payload = {
      items: [{ variant_id: "10", quantity: 1 }],
      address: "123 Audit Lane",
    };
    const first = await checkoutRequestKey("1", "2", payload);
    expect(await checkoutRequestKey("1", "2", payload)).toBe(first);
    expect([...values.values()].join("")).not.toContain("123 Audit Lane");
    expect(await checkoutRequestKey("2", "2", payload)).not.toBe(first);
    expect(await checkoutRequestKey("1", "3", payload)).not.toBe(first);
  });

  it("allows a subsequent intentional order and does not clear a newer pending intent", async () => {
    const first = await checkoutRequestKey("1", "2", { quantity: 1 });
    const edited = await checkoutRequestKey("1", "2", { quantity: 2 });
    expect(edited).not.toBe(first);
    completeCheckoutAttempt("1", "2", first);
    expect(await checkoutRequestKey("1", "2", { quantity: 2 })).toBe(edited);
    completeCheckoutAttempt("1", "2", edited);
    expect(await checkoutRequestKey("1", "2", { quantity: 2 })).not.toBe(
      edited,
    );
  });
});
