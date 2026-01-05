export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
};
