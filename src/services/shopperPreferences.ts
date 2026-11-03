export const SHOPPER_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "mr", name: "मराठी" },
  { code: "gu", name: "ગુજરાતી" },
] as const;

export type ShopperLanguage = (typeof SHOPPER_LANGUAGES)[number]["code"];

export const isShopperLanguage = (value: string): value is ShopperLanguage =>
  SHOPPER_LANGUAGES.some((language) => language.code === value);
