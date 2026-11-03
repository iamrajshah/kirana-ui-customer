import React, { useEffect, useState } from "react";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
} from "@ionic/react";
import { add, remove } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@store/cart.store";
import { toast } from "@services/toast";
import { storageService } from "@services/storage";
import {
  getCartStockLimit,
  getStockQuantity,
  isVariantInStock,
  shouldShowExactStock,
  type StorefrontStockVariant,
} from "@features/catalog/stockPresentation";
import ImageWithFallback from "./ImageWithFallback";
import { formatCurrency } from "@utils/currency";

interface ProductVariant extends StorefrontStockVariant {
  id: string;
  brand?: string;
  selling_price: number;
  mrp_price?: number;
  unit?: string;
  size?: string;
  image_url?: string;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand?: string;
    image_url?: string;
    variants?: ProductVariant[];
    product_variants?: ProductVariant[];
  };
  onProductClick?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductClick,
}) => {
  const { t } = useTranslation();
  const { addItem, updateQuantity, items } = useCartStore();
  const [cartQuantity, setCartQuantity] = useState(0);

  const variant = product.variants?.[0] ?? product.product_variants?.[0];

  // Check cart for current quantity
  useEffect(() => {
    if (!variant) {
      setCartQuantity(0);
      return;
    }
    const cartItem = items.find((item) => item.variant_id === variant.id);
    setCartQuantity(cartItem?.quantity || 0);
  }, [items, variant]);

  // Don't render if no variants
  if (!variant) return null;

  const isInStock = isVariantInStock(variant);
  const isOutOfStock = !isInStock;
  const exactStockIsVisible = shouldShowExactStock(
    storageService.getStorefront(),
  );
  const stockQuantity = getStockQuantity(variant);
  const publicStockLimit = exactStockIsVisible
    ? getCartStockLimit(variant)
    : undefined;
  const isLowStock =
    exactStockIsVisible &&
    typeof stockQuantity === "number" &&
    stockQuantity > 0 &&
    stockQuantity <= 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem({
        variant_id: variant.id,
        product_id: product.id,
        product_name: product.name,
        brand: variant.brand || product.brand || "",
        unit: variant.unit || variant.size,
        price: variant.selling_price,
        image_url: variant.image_url || product.image_url,
        max_quantity: publicStockLimit,
      });
      toast.success(t("added_to_cart") || "Added to cart");
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (publicStockLimit === undefined || cartQuantity < publicStockLimit) {
      updateQuantity(variant.id, cartQuantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartQuantity > 0) {
      updateQuantity(variant.id, cartQuantity - 1);
    }
  };

  const openProduct = () => onProductClick?.(product.id);

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openProduct();
  };

  return (
    <IonCard
      className="storefront-product-card"
      onClick={openProduct}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${t("view_details")}: ${product.name}`}
    >
      <div className="storefront-product-card__media">
        <ImageWithFallback
          src={product.image_url || variant.image_url}
          alt={product.name}
          className="storefront-product-card__image"
        />
        {isOutOfStock && (
          <IonBadge color="danger" className="storefront-product-card__badge">
            {t("out_of_stock")}
          </IonBadge>
        )}
        {isLowStock && !isOutOfStock && (
          <IonBadge color="warning" className="storefront-product-card__badge">
            {t("only_units_left", { count: stockQuantity })}
          </IonBadge>
        )}
      </div>

      <IonCardContent className="storefront-product-card__content">
        <div className="storefront-product-card__details">
          <h3>{product.name}</h3>
          {(variant.brand || product.brand || variant.unit || variant.size) && (
            <p>
              {[variant.brand || product.brand, variant.unit || variant.size]
                .filter(Boolean)
                .join(" • ")}
            </p>
          )}
          {!isOutOfStock && (
            <small className="storefront-product-card__availability">
              {exactStockIsVisible && typeof stockQuantity === "number"
                ? t("units_available", { count: stockQuantity })
                : t("available")}
            </small>
          )}
        </div>

        <div className="storefront-product-card__footer">
          <div className="storefront-product-card__price">
            <strong>{formatCurrency(variant.selling_price)}</strong>
            {Number(variant.mrp_price) > Number(variant.selling_price) && (
              <del>{formatCurrency(Number(variant.mrp_price))}</del>
            )}
          </div>

          {cartQuantity > 0 ? (
            <div
              className="storefront-product-card__stepper"
              onClick={(e) => e.stopPropagation()}
            >
              <IonButton
                fill="clear"
                size="small"
                onClick={handleDecrement}
                aria-label={t("decrease_quantity_for", {
                  product: product.name,
                })}
                className="storefront-product-card__stepper-button"
              >
                <IonIcon icon={remove} style={{ fontSize: "16px" }} />
              </IonButton>
              <span>{cartQuantity}</span>
              <IonButton
                fill="clear"
                size="small"
                onClick={handleIncrement}
                aria-label={t("increase_quantity_for", {
                  product: product.name,
                })}
                disabled={
                  typeof publicStockLimit === "number" &&
                  cartQuantity >= publicStockLimit
                }
                className="storefront-product-card__stepper-button"
              >
                <IonIcon icon={add} style={{ fontSize: "16px" }} />
              </IonButton>
            </div>
          ) : (
            <IonButton
              fill="solid"
              size="small"
              onClick={handleAddToCart}
              aria-label={`${t("add_to_cart")}: ${product.name}`}
              disabled={isOutOfStock}
              className="storefront-product-card__add"
            >
              +
            </IonButton>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductCard;
