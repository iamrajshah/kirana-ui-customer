import { describe, expect, it } from "vitest";
import { isShopperLanguage, SHOPPER_LANGUAGES } from "./shopperPreferences";

describe("public shopper preferences", () => {
  it("offers every supported language before authentication", () => {
    expect(SHOPPER_LANGUAGES.map(({ code }) => code)).toEqual([
      "en",
      "hi",
      "mr",
      "gu",
    ]);
  });

  it("rejects unsupported persisted language values", () => {
    expect(isShopperLanguage("mr")).toBe(true);
    expect(isShopperLanguage("fr")).toBe(false);
  });
});
