import { describe, expect, it } from "vitest";
import type { StorefrontSelection } from "@services/storage";
import {
  getCartStockLimit,
  getStockQuantity,
  isVariantInStock,
  shouldShowExactStock,
} from "./stockPresentation";

const shop = (showStockQuantity?: boolean): StorefrontSelection => ({
  tenantId: "1",
  slug: "demo",
  name: "Demo",
  logoUrl: null,
  brandColor: "#087f5b",
  phone: null,
  preferences:
    showStockQuantity === undefined ? undefined : { showStockQuantity },
});

describe("public stock presentation", () => {
  it("hides exact stock unless the shop explicitly enables it", () => {
    expect(shouldShowExactStock(undefined)).toBe(false);
    expect(shouldShowExactStock(shop())).toBe(false);
    expect(shouldShowExactStock(shop(false))).toBe(false);
    expect(shouldShowExactStock(shop(true))).toBe(true);
  });

  it("uses the public in_stock flag when quantities are intentionally omitted", () => {
    expect(isVariantInStock({ in_stock: true })).toBe(true);
    expect(isVariantInStock({ in_stock: false, quantity: 50 })).toBe(false);
    expect(getStockQuantity({ in_stock: true })).toBeUndefined();
    expect(getCartStockLimit({ in_stock: true })).toBeUndefined();
  });

  it("supports numeric stock only when the public response contains it", () => {
    expect(getStockQuantity({ quantity: 9, in_stock: true })).toBe(9);
    expect(getStockQuantity({ inventory: { quantity: 4 } })).toBe(4);
    expect(isVariantInStock({ inventory: { quantity: 4 } })).toBe(true);
  });
});
