import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

describe("Modern Bazaar responsive layout", () => {
  it("replaces the unbounded category tab strip with shortcuts and a sheet", () => {
    const home = read("./HomePage.tsx");
    const categories = read("./CategoryNavigator.tsx");

    expect(home).toContain("<CategoryNavigator");
    expect(home).not.toContain("IonSegment");
    expect(categories).toContain("getCategoryShortcuts");
    expect(categories).toContain("bazaar-category-sheet");
  });

  it("keeps search, Bazaar hero, products and a mobile navigation contract", () => {
    const home = read("./HomePage.tsx");
    const tabs = read("../layout/TabsLayout.tsx");
    const styles = read("../../theme/variables.css");

    expect(home).toContain("bazaar-search-shell");
    expect(home).toContain("bazaar-hero-layout");
    expect(home).toContain("storefront-product-grid");
    expect(tabs).toContain("storefront-bottom-nav");
    expect(styles).toContain("@media (max-width: 700px)");
    expect(styles).toContain("body.dark .bazaar-featured-deal");
  });

  it("exposes language and theme controls in the public header", () => {
    const header = read("../../components/AppHeader.tsx");

    expect(header).toContain("SHOPPER_LANGUAGES");
    expect(header).toContain("toggleTheme");
    expect(header).not.toMatch(/isAuthenticated\s*&&\s*\(\s*<IonSelect/);
  });
});
