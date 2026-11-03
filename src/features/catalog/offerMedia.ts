export const OFFER_IMAGE_FALLBACK = "/demo-products/grocery.svg";

export const getOfferImageSource = (source?: string): string =>
  source || OFFER_IMAGE_FALLBACK;

export const getOfferImageFallback = (currentSource: string): string =>
  currentSource === OFFER_IMAGE_FALLBACK ? currentSource : OFFER_IMAGE_FALLBACK;
