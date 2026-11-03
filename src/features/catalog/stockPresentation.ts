import type { StorefrontSelection } from "@services/storage";

export interface StorefrontStockVariant {
  in_stock?: boolean;
  quantity?: number;
  inventory?: {
    quantity?: number;
    in_stock?: boolean;
  } | null;
}

export const shouldShowExactStock = (
  storefront: StorefrontSelection | null | undefined,
): boolean => storefront?.preferences?.showStockQuantity === true;

export const getStockQuantity = (
  variant: StorefrontStockVariant | null | undefined,
): number | undefined => {
  const quantity = variant?.quantity ?? variant?.inventory?.quantity;
  return typeof quantity === "number" && Number.isFinite(quantity)
    ? quantity
    : undefined;
};

export const isVariantInStock = (
  variant: StorefrontStockVariant | null | undefined,
): boolean => {
  if (typeof variant?.in_stock === "boolean") return variant.in_stock;
  if (typeof variant?.inventory?.in_stock === "boolean") {
    return variant.inventory.in_stock;
  }
  return (getStockQuantity(variant) ?? 0) > 0;
};

export const getCartStockLimit = (
  variant: StorefrontStockVariant | null | undefined,
): number | undefined => getStockQuantity(variant);
