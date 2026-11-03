import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Ionic storefront stability contracts", () => {
  it("keeps the tab bar shape stable when customer authentication changes", () => {
    const source = readFileSync(
      new URL("../features/layout/TabsLayout.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toContain('tab="orders"');
    expect(source).toContain('tab="profile"');
    expect(source).not.toMatch(/isAuthenticated\s*&&\s*\(\s*<IonTabButton/);
  });

  it("uses a React toast instead of mutating an Ionic overlay after navigation", () => {
    const source = readFileSync(
      new URL("../components/ToastContainer.tsx", import.meta.url),
      "utf8",
    );

    expect(source).not.toContain("IonToast");
    expect(source).toContain("storefront-toast");
  });
});
