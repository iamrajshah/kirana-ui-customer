import { describe, expect, it } from "vitest";
import {
  getOrderJourneyIndex,
  getOrderStatusColor,
  getOrderStatusTranslationKey,
} from "./orderStatus";

describe("customer order status presentation", () => {
  it("covers the POS order lifecycle", () => {
    expect(getOrderStatusColor("PLACED")).toBe("warning");
    expect(getOrderStatusColor("ACCEPTED")).toBe("primary");
    expect(getOrderStatusColor("PREPARING")).toBe("tertiary");
    expect(getOrderStatusColor("READY")).toBe("success");
    expect(getOrderStatusColor("COMPLETED")).toBe("success");
    expect(getOrderStatusColor("CANCELLED")).toBe("danger");
  });

  it("uses localized status keys and a safe unknown color", () => {
    expect(getOrderStatusTranslationKey("OUT_FOR_DELIVERY")).toBe(
      "order_status_out_for_delivery",
    );
    expect(getOrderStatusColor("UNKNOWN")).toBe("medium");
  });

  it("maps each active state to a stable customer journey position", () => {
    expect(getOrderJourneyIndex("PLACED")).toBe(0);
    expect(getOrderJourneyIndex("READY")).toBe(3);
    expect(getOrderJourneyIndex("COMPLETED")).toBe(4);
    expect(getOrderJourneyIndex("CANCELLED")).toBe(-1);
  });
});
