export interface StorefrontCategory {
  id: string | number;
  name: string;
}

const CATEGORY_ICONS: Array<[RegExp, string]> = [
  [/milk|dairy|butter|cheese|दूध|दुग्ध/i, "🥛"],
  [/staple|grain|pulse|atta|rice|flour|धान्य|किराणा/i, "🌾"],
  [/snack|biscuit|namkeen|चिवडा|नाश्ता/i, "🍪"],
  [/drink|beverage|juice|tea|coffee|पेय|चहा/i, "🧃"],
  [/fruit|vegetable|fresh|produce|फळ|भाजी/i, "🥬"],
  [/home|clean|care|household|स्वच्छ|घर/i, "🧹"],
  [/personal|beauty|soap|care|वैयक्तिक/i, "🧴"],
  [/oil|cooking|spice|masala|तेल|मसाला/i, "🫙"],
];

export const getCategoryIcon = (name: string): string =>
  CATEGORY_ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? "🛍️";

export const getCategoryShortcuts = (
  categories: StorefrontCategory[],
  selectedCategory: string,
  limit = 4,
): StorefrontCategory[] => {
  const shortcuts = categories.slice(0, limit);
  if (
    selectedCategory === "all" ||
    shortcuts.some((category) => String(category.id) === selectedCategory)
  ) {
    return shortcuts;
  }

  const selected = categories.find(
    (category) => String(category.id) === selectedCategory,
  );
  if (!selected || limit < 1) return shortcuts;
  return [...shortcuts.slice(0, limit - 1), selected];
};
