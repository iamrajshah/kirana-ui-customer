import { beforeEach, describe, expect, it } from "vitest";
import { storageService } from "./storage";

const values = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
  },
});

describe("tenant-scoped customer cart storage", () => {
  beforeEach(() => localStorage.clear());

  it("returns a cart only for the storefront that created it", () => {
    storageService.setStorefront({
      tenantId: "1",
      slug: "shop-1",
      name: "Jayesh Trading",
      logoUrl: null,
      brandColor: "#087F5B",
      phone: null,
    });
    storageService.setCart([{ variant_id: "101", quantity: 2 }]);
    expect(storageService.getCart()).toEqual([
      { variant_id: "101", quantity: 2 },
    ]);

    storageService.setStorefront({
      tenantId: "2",
      slug: "shop-2",
      name: "Kirana Demo Store",
      logoUrl: null,
      brandColor: "#087F5B",
      phone: null,
    });

    expect(storageService.getCart()).toBeNull();
    expect(localStorage.getItem("kirana_cart")).toBeNull();
  });

  it("rejects legacy unscoped cart data", () => {
    storageService.setStorefront({
      tenantId: "2",
      slug: "shop-2",
      name: "Kirana Demo Store",
      logoUrl: null,
      brandColor: "#087F5B",
      phone: null,
    });
    localStorage.setItem(
      "kirana_cart",
      JSON.stringify([{ variant_id: "old" }]),
    );

    expect(storageService.getCart()).toBeNull();
  });
});
