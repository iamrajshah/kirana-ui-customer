import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { apiService } from "@services/api";
import ProductCard from "@components/ProductCard";
import EmptyState from "@components/EmptyState";
import AppHeader from "@components/AppHeader";
import { debounce } from "@utils/debounce";
import { toast } from "@services/toast";
import { storageService } from "@services/storage";
import { storefrontPath } from "@features/storefront/storefrontPath";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offersOnly, setOffersOnly] = useState(false);
  const storefront = storageService.getStorefront();

  useEffect(() => {
    loadCategories();
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const response = await apiService.getOffers();
      if (response.success) setOffers(response.data ?? []);
    } catch (error) {
      console.error("Failed to load offers:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error(t("load_categories_failed"));
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== "all") {
        params.category_id = selectedCategory;
      }

      const response = await apiService.getProducts(params);
      if (response.success && response.data.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error(t("load_products_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      loadProducts();
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.searchProducts(query);
      if (response.success && response.data.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error(t("search_failed"));
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadCategories();
    await loadOffers();
    await loadProducts();
    event.detail.complete();
  };

  const handleProductClick = (productId: string) => {
    history.push(storefrontPath(`/product/${productId}`));
  };

  const discountedProducts = products.filter((product) =>
    product.variants?.some(
      (variant: { mrp_price?: number; selling_price?: number }) =>
        Number(variant.mrp_price) > Number(variant.selling_price),
    ),
  );
  const visibleProducts = offersOnly ? discountedProducts : products;

  return (
    <IonPage>
      <AppHeader />
      <IonHeader>
        <IonToolbar>
          <IonSearchbar
            value={searchQuery}
            onIonChange={(e) => {
              const value = e.detail.value || "";
              setSearchQuery(value);
              handleSearch(value);
            }}
            placeholder={t("search_products")}
          />
        </IonToolbar>
        {categories.length > 0 && (
          <IonToolbar>
            <IonSegment
              key={selectedCategory}
              value={selectedCategory}
              onIonChange={(e) => setSelectedCategory(e.detail.value as string)}
              scrollable
            >
              <IonSegmentButton value="all">
                <IonLabel>{t("all_categories")}</IonLabel>
              </IonSegmentButton>
              {categories.map((cat) => (
                <IonSegmentButton key={cat.id} value={cat.id.toString()}>
                  <IonLabel>{cat.name}</IonLabel>
                </IonSegmentButton>
              ))}
            </IonSegment>
          </IonToolbar>
        )}
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="storefront-content">
        <section
          style={{
            margin: "12px 12px 4px",
            padding: 18,
            borderRadius: 20,
            color: "#fff",
            background: `linear-gradient(135deg, ${storefront?.brandColor || "#087F5B"}, #164e3f)`,
          }}
        >
          <p style={{ margin: 0, opacity: 0.85 }}>{t("shop_online_from")}</p>
          <h1 style={{ margin: "4px 0 12px" }}>
            {storefront?.name || t("app_name")}
          </h1>
          <button
            type="button"
            onClick={() => setOffersOnly((value) => !value)}
            style={{
              border: 0,
              borderRadius: 999,
              padding: "8px 14px",
              fontWeight: 700,
            }}
          >
            {offersOnly
              ? t("show_all_products")
              : t("view_offers", { count: discountedProducts.length })}
          </button>
        </section>

        {offers.length > 0 && (
          <section
            aria-label={t("published_offers")}
            style={{ padding: "8px 12px" }}
          >
            <h2 style={{ margin: "4px 0 10px", fontSize: "1.2rem" }}>
              {t("published_offers")}
            </h2>
            <div
              style={{
                display: "grid",
                gridAutoFlow: "column",
                gridAutoColumns: "minmax(250px, 78vw)",
                gap: 10,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                paddingBottom: 6,
              }}
            >
              {offers.map((offer) => {
                const image =
                  offer.image_url ||
                  offer.product?.image_url ||
                  offer.product?.product_variants?.[0]?.image_url;
                const offerVariant = offer.product?.product_variants?.[0];
                const sellingPrice = Number(offerVariant?.selling_price ?? 0);
                const mrpPrice = Number(offerVariant?.mrp_price ?? 0);
                const saving = Math.max(0, mrpPrice - sellingPrice);
                return (
                  <button
                    type="button"
                    key={offer.id}
                    onClick={() =>
                      offer.product_id &&
                      handleProductClick(String(offer.product_id))
                    }
                    style={{
                      display: "grid",
                      gridTemplateColumns: image ? "82px 1fr" : "1fr",
                      gap: 12,
                      minHeight: 118,
                      padding: 14,
                      textAlign: "left",
                      border: "1px solid rgba(8,127,91,.18)",
                      borderRadius: 18,
                      background: "linear-gradient(135deg,#fff8e8,#f1fbf6)",
                      boxShadow: "0 8px 22px rgba(20,78,63,.08)",
                      scrollSnapAlign: "start",
                    }}
                  >
                    {image && (
                      <img
                        src={image}
                        alt=""
                        style={{
                          width: 82,
                          height: 82,
                          objectFit: "contain",
                          borderRadius: 12,
                        }}
                      />
                    )}
                    <span>
                      {offer.badge_text && (
                        <small
                          style={{
                            display: "inline-block",
                            marginBottom: 5,
                            color: "#087f5b",
                            fontWeight: 800,
                          }}
                        >
                          {offer.badge_text}
                        </small>
                      )}
                      <strong style={{ display: "block", fontSize: "1.05rem" }}>
                        {offer.title}
                      </strong>
                      {offer.description && (
                        <span
                          style={{
                            display: "block",
                            marginTop: 5,
                            color: "#53645d",
                          }}
                        >
                          {offer.description}
                        </span>
                      )}
                      {saving > 0 && (
                        <span
                          style={{
                            display: "block",
                            marginTop: 7,
                            color: "#087f5b",
                            fontWeight: 800,
                          }}
                        >
                          {t("offer_save", { amount: saving.toFixed(0) })}
                        </span>
                      )}
                      <span
                        style={{
                          display: "block",
                          marginTop: 8,
                          color: "#164e3f",
                          fontWeight: 800,
                        }}
                      >
                        {t("shop_offer_now")} →
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

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
        ) : visibleProducts.length === 0 ? (
          <EmptyState
            icon="📦"
            message={searchQuery ? t("no_results") : t("no_products_available")}
          />
        ) : (
          <div className="storefront-product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
