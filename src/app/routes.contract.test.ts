import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("AppRoutes top-level route contract", () => {
  it("selects one route so storefront bootstrap cannot mount the tab shell", () => {
    const source = readFileSync(new URL("./routes.tsx", import.meta.url), "utf8");
    const switchStart = source.indexOf("<Switch>");
    const switchEnd = source.indexOf("</Switch>");
    const storefront = source.indexOf('path="/shop/:slug"');
    const tabShell = source.indexOf('path="/" render={() => <TabsLayout />}');

    expect(switchStart).toBeGreaterThan(-1);
    expect(switchEnd).toBeGreaterThan(switchStart);
    expect(storefront).toBeGreaterThan(switchStart);
    expect(tabShell).toBeGreaterThan(storefront);
    expect(tabShell).toBeLessThan(switchEnd);
  });
});
