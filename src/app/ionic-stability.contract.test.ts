import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Ionic storefront stability contracts", () => {
  it("keeps the mobile Bazaar navigation stable when authentication changes", () => {
    const source = readFileSync(
      new URL("../features/layout/TabsLayout.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toContain("to={`${base}/orders`}");
    expect(source).toContain("to={`${base}/home#catalog`}");
    expect(source).toContain("to={`${base}/cart`}");
    expect(source).not.toContain("IonTabs");
    expect(source).not.toContain("IonTabButton");
  });

  it("uses a React toast instead of mutating an Ionic overlay after navigation", () => {
    const source = readFileSync(
      new URL("../components/ToastContainer.tsx", import.meta.url),
      "utf8",
    );

    expect(source).not.toContain("IonToast");
    expect(source).toContain("storefront-toast");
  });

  it("completes checkout without mutating an Ionic loading overlay during navigation", () => {
    const source = readFileSync(
      new URL("../features/checkout/CheckoutPage.tsx", import.meta.url),
      "utf8",
    );

    expect(source).not.toContain("IonLoading");
    expect(source).not.toContain("disabled={loading || !isAuthenticated}");
    expect(source).toContain("orderSubmission.current.run");
    expect(source).toContain("leavingCheckout.current = true");
    expect(source).toContain("if (items.length === 0) return null");
    expect(source).not.toMatch(
      /if \(items\.length === 0\)[^{]*\{[^}]*history\.replace/s,
    );
  });
});
