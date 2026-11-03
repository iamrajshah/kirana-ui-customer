import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonButton,
  IonSpinner,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiService } from "@services/api";
import { useCartStore } from "@store/cart.store";
import ImageWithFallback from "@components/ImageWithFallback";
import { formatCurrency } from "@utils/currency";
import { toast } from "@services/toast";
import ProductCard from "@components/ProductCard";
import AppHeader from "@components/AppHeader";
import { storefrontPath } from "@features/storefront/storefrontPath";
import { storageService } from "@services/storage";
import {
  getCartStockLimit,
  getStockQuantity,
  isVariantInStock,
  shouldShowExactStock,
} from "./stockPresentation";

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProductById(id);
      if (response.success) {
        setProduct(response.data);
      }
      try {
        const recommended = await apiService.getProductRecommendations(id);
        if (recommended.success) setRecommendations(recommended.data);
      } catch {
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Failed to load product:", error);
      toast.error(t("load_product_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (
      product &&
      product.product_variants &&
      product.product_variants.length > 0
    ) {
      const variant = product.product_variants[0];
      const imageUrl = variant.image_url || product.image_url;
      const exactStockIsVisible = shouldShowExactStock(
        storageService.getStorefront(),
      );
      addItem({
        variant_id: variant.id,
        product_id: product.id,
        product_name: product.name,
        brand: variant.brand,
        unit: variant.size,
        price: variant.selling_price,
        image_url: imageUrl,
        max_quantity: exactStockIsVisible
          ? getCartStockLimit(variant)
          : undefined,
      });
    }
  };

  const variant = product?.product_variants?.[0];
  const imageUrl = variant?.image_url || product?.image_url;
  const displayName = product?.name?.replace(/_/g, " ");
  const stockQuantity = getStockQuantity(variant);
  const inStock = isVariantInStock(variant);
  const exactStockIsVisible = shouldShowExactStock(
    storageService.getStorefront(),
  );

  return (
    <IonPage>
      <AppHeader />
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={storefrontPath("/home")} />
          </IonButtons>
          <IonTitle>{t("product")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <IonSpinner />
          </div>
        ) : product ? (
          <main className="product-detail-shell">
            <ImageWithFallback
              src={imageUrl}
              alt={product.name}
              className="product-detail-image"
            />
            <div className="product-detail-copy">
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: "0 0 8px 0",
                }}
              >
                {displayName}
              </h1>
              {variant && (
                <>
                  {variant.brand && (
                    <p
                      style={{
                        fontSize: "16px",
                        color: "var(--ion-color-medium)",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {t("brand")}: {variant.brand}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--ion-color-medium)",
                      margin: "0 0 16px 0",
                    }}
                  >
                    {variant.size}{" "}
                    {variant.packaging && `• ${variant.packaging}`}
                  </p>

                  <div style={{ marginBottom: "16px" }}>
                    <p
                      style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "var(--ion-color-primary)",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {formatCurrency(variant.selling_price)}
                    </p>
                    {variant.mrp_price &&
                      variant.mrp_price > variant.selling_price && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "16px",
                              color: "var(--ion-color-medium)",
                              textDecoration: "line-through",
                              margin: 0,
                            }}
                          >
                            {t("mrp")}: {formatCurrency(variant.mrp_price)}
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "var(--ion-color-success)",
                              fontWeight: "bold",
                              margin: 0,
                            }}
                          >
                            {Math.round(
                              ((variant.mrp_price - variant.selling_price) /
                                variant.mrp_price) *
                                100,
                            )}
                            % {t("off")}
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Product Details */}
                  <div className="product-detail-information">
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {t("product_details")}
                    </h3>
                    {variant.sku && (
                      <p
                        style={{
                          fontSize: "14px",
                          margin: "4px 0",
                          color: "var(--ion-color-medium)",
                        }}
                      >
                        {t("sku")}: {variant.sku}
                      </p>
                    )}
                    {variant.gst_percent && (
                      <p
                        style={{
                          fontSize: "14px",
                          margin: "4px 0",
                          color: "var(--ion-color-medium)",
                        }}
                      >
                        {t("gst")}: {variant.gst_percent}%
                      </p>
                    )}
                    <p
                      data-testid="product-stock-availability"
                      style={{
                        fontSize: "14px",
                        margin: "4px 0",
                        color: inStock
                          ? "var(--ion-color-success)"
                          : "var(--ion-color-danger)",
                      }}
                    >
                      {!inStock
                        ? t("out_of_stock")
                        : exactStockIsVisible &&
                            typeof stockQuantity === "number"
                          ? t("units_available", { count: stockQuantity })
                          : t("available")}
                    </p>
                  </div>

                  <div style={{ marginTop: "24px" }}>
                    <IonButton
                      expand="block"
                      size="large"
                      onClick={handleAddToCart}
                      disabled={!inStock}
                    >
                      {inStock ? t("add_to_cart") : t("out_of_stock")}
                    </IonButton>
                  </div>
                  {recommendations.length > 0 && (
                    <section style={{ marginTop: 28 }}>
                      <h2>{t("frequently_bought_together")}</h2>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(150px, 1fr))",
                          gap: 8,
                        }}
                      >
                        {recommendations.map((recommended) => (
                          <ProductCard
                            key={recommended.id}
                            product={recommended}
                            onProductClick={(productId) =>
                              history.push(
                                storefrontPath(`/product/${productId}`),
                              )
                            }
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          </main>
        ) : (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <p>{t("error_occurred")}</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;
