export const paymentModes = [
  { value: 'CASH', label: 'Cash on Delivery', icon: '💵' },
  { value: 'UPI', label: 'UPI Payment', icon: '📱' },
  { value: 'CARD', label: 'Pay Later', icon: '💳' },
] as const;

export type PaymentMode = typeof paymentModes[number]['value'];
