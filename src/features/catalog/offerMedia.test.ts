import { describe, expect, it } from "vitest";
import {
  OFFER_IMAGE_FALLBACK,
  getOfferImageFallback,
  getOfferImageSource,
} from "./offerMedia";

describe("storefront offer media", () => {
  it("uses the supplied product image when available", () => {
    expect(getOfferImageSource("/demo-products/cooking.svg")).toBe(
      "/demo-products/cooking.svg",
    );
  });

  it("uses a deployed fallback for missing or failed artwork", () => {
    expect(getOfferImageSource()).toBe(OFFER_IMAGE_FALLBACK);
    expect(getOfferImageFallback("/demo-products/missing.svg")).toBe(
      OFFER_IMAGE_FALLBACK,
    );
  });
});
