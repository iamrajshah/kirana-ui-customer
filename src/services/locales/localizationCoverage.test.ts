import { describe, expect, it } from "vitest";
import en from "./en.json";
import hi from "./hi.json";
import mr from "./mr.json";
import gu from "./gu.json";

const keys = (value: Record<string, string>) => Object.keys(value).sort();

describe("customer storefront translations", () => {
  it.each([en, hi, mr, gu])("translates the delivery city field", (translations) => {
    expect(translations.city).toBeTruthy();
  });

  it.each([
    ["Hindi", hi],
    ["Marathi", mr],
    ["Gujarati", gu],
  ])("keeps %s aligned with English", (_language, translations) => {
    expect(keys(translations)).toEqual(keys(en));
    expect(
      Object.values(translations).every(
        (translation) => translation.trim().length > 0,
      ),
    ).toBe(true);
  });
});
