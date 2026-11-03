import { describe, expect, it } from "vitest";
import {
  hasStorefrontChanged,
  normalizeShopSlug,
  shouldResetCustomerSession,
} from "./storefront";
import { storefrontPath } from "./storefrontPath";

describe("tenant storefront selection", () => {
  it("normalizes a shared shop slug before resolving it", () => {
    expect(normalizeShopSlug(" Kantilal-Shop ")).toBe("kantilal-shop");
  });

  it("clears an authenticated session before switching tenants", () => {
    expect(shouldResetCustomerSession(true, "7", "8")).toBe(true);
    expect(shouldResetCustomerSession(true, "7", "7")).toBe(false);
    expect(shouldResetCustomerSession(false, undefined, "8")).toBe(false);
  });

  it("treats a different or missing prior tenant as a storefront change", () => {
    expect(hasStorefrontChanged("1", "2")).toBe(true);
    expect(hasStorefrontChanged(undefined, "2")).toBe(true);
    expect(hasStorefrontChanged("2", "2")).toBe(false);
  });

  it("keeps navigation inside the selected shop slug", () => {
    expect(storefrontPath("/product/42", "shop-2")).toBe(
      "/shop/shop-2/product/42",
    );
  });
});
