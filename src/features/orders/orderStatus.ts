export type CustomerOrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

const colors: Record<CustomerOrderStatus, string> = {
  PLACED: "warning",
  ACCEPTED: "primary",
  PREPARING: "tertiary",
  READY: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export const getOrderStatusColor = (status: string): string =>
  colors[status as CustomerOrderStatus] || "medium";

export const getOrderStatusTranslationKey = (status: string): string =>
  `order_status_${status.toLowerCase()}`;

export const activeOrderJourney: readonly CustomerOrderStatus[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "COMPLETED",
];

export const getOrderJourneyIndex = (status: string): number =>
  status === "CANCELLED" ? -1 : activeOrderJourney.indexOf(status as CustomerOrderStatus);
