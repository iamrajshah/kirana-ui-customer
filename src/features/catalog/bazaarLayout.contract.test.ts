import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

describe("Modern Bazaar responsive layout", () => {
  it("replaces the unbounded category strip with shortcuts and an accessible browser", () => {
    const home = read("./HomePage.tsx");
    const categories = read("./CategoryNavigator.tsx");

    expect(home).toContain("<CategoryNavigator");
    expect(home).not.toContain("IonSegment");
    expect(categories).toContain("getCategoryShortcuts");
    expect(categories).toContain("openCategoryBrowser");
    expect(categories).toContain('aria-controls="bazaar-category-browser"');
    expect(categories).toContain('data-category-browser="open"');
    expect(categories).not.toContain("IonModal");
  });

  it("wires every category browser entry to the catalogue filter", () => {
    const categories = read("./CategoryNavigator.tsx");

    expect(categories).toContain("onSelect(categoryId)");
    expect(categories).toContain('selectCategory("all")');
    expect(categories).toContain("selectCategory(id)");
  });

  it("keeps offer and product navigation inside the resolved storefront", () => {
    const home = read("./HomePage.tsx");

    expect(home).toContain(
      "history.push(storefrontPath(`/product/${productId}`))",
    );
    expect(home).toContain("handleProductClick(String(offer.product_id))");
    expect(home).toContain("onProductClick={handleProductClick}");
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

  it("contains mobile grids and navigation inside the viewport", () => {
    const styles = read("../../theme/variables.css");

    expect(styles).toContain(".bazaar-page::part(scroll)");
    expect(styles).toContain(
      "grid-template-columns: repeat(3, minmax(0, 1fr))",
    );
    expect(styles).toMatch(
      /\.storefront-bottom-nav ion-tab-button\s*\{[^}]*min-width:\s*0;/s,
    );
  });
});
