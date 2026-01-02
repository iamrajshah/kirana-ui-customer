/**
 * Format price in Indian Rupees
 */
export const formatPrice = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

/**
 * Format price without decimal if whole number
 */
export const formatPriceCompact = (amount: number): string => {
  return amount % 1 === 0 ? `₹${amount}` : `₹${amount.toFixed(2)}`;
};

/**
 * Parse price string to number
 */
export const parsePrice = (priceStr: string): number => {
  return parseFloat(priceStr.replace(/[^0-9.-]+/g, ''));
};
