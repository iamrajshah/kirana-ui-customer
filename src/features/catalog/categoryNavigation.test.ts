import { describe, expect, it } from "vitest";
import { getCategoryIcon, getCategoryShortcuts } from "./categoryNavigation";

const categories = [
  "Dairy",
  "Staples",
  "Snacks",
  "Beverages",
  "Fresh vegetables",
  "Home care",
  "Personal care",
].map((name, index) => ({ id: index + 1, name }));

describe("Modern Bazaar category navigation", () => {
  it("keeps the home row to six total tiles including For You and All", () => {
    const shortcuts = getCategoryShortcuts(categories, "all");
    expect(shortcuts).toEqual(categories.slice(0, 4));
    expect(shortcuts.length + 2).toBe(6);
  });

  it("keeps a drawer-selected category visible in the shortcut row", () => {
    expect(getCategoryShortcuts(categories, "7").map(({ id }) => id)).toEqual([
      1, 2, 3, 7,
    ]);
  });

  it("uses recognisable category artwork without relying on server images", () => {
    expect(getCategoryIcon("Dairy products")).toBe("🥛");
    expect(getCategoryIcon("Home care")).toBe("🧹");
    expect(getCategoryIcon("Miscellaneous")).toBe("🛍️");
  });
});
