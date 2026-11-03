import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("AppRoutes top-level route contract", () => {
  it("keeps every shop journey under its tenant slug and gives root a neutral landing", () => {
    const source = readFileSync(new URL("./routes.tsx", import.meta.url), "utf8");
    const switchStart = source.indexOf("<Switch>");
    const switchEnd = source.indexOf("</Switch>");
    const storefront = source.indexOf('path="/shop/:slug"');
    const landing = source.indexOf('path="/" component={StorefrontLandingPage}');

    expect(switchStart).toBeGreaterThan(-1);
    expect(switchEnd).toBeGreaterThan(switchStart);
    expect(storefront).toBeGreaterThan(switchStart);
    expect(landing).toBeGreaterThan(storefront);
    expect(landing).toBeLessThan(switchEnd);
    expect(source).not.toContain('VITE_TENANT_ID');
  });
});
