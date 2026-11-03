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
import {
  getOfferImageFallback,
  getOfferImageSource,
} from "@features/catalog/offerMedia";

const OfferImage: React.FC<{ source?: string; alt: string }> = ({
  source,
  alt,
}) => {
  const [resolvedSource, setResolvedSource] = useState(
    getOfferImageSource(source),
  );

  useEffect(() => {
    setResolvedSource(getOfferImageSource(source));
  }, [source]);

  return (
    <img
      className="storefront-offer-card__image"
      src={resolvedSource}
      alt={alt}
      onError={() => setResolvedSource(getOfferImageFallback(resolvedSource))}
    />
  );
};

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
            className="storefront-hero"
            style={{ "--storefront-brand": storefront?.brandColor || "#087F5B" } as React.CSSProperties}
          >
            <div className="storefront-hero__glow" aria-hidden="true" />
            <p>{t("shop_online_from")}</p>
            <h1>
              {storefront?.name || t("app_name")}
            </h1>
            <span className="storefront-hero__message">{t("storefront_hero_message")}</span>
            <button
              type="button"
              onClick={() => setOffersOnly((value) => !value)}
              className="storefront-hero__action"
            >
              {offersOnly
                ? t("show_all_products")
                : t("view_offers", { count: discountedProducts.length })}
            </button>
          </section>

          <section className="storefront-benefits" aria-label={t("shopping_benefits")}>
            <span><b>✓</b>{t("benefit_shop_prices")}</span>
            <span><b>◷</b>{t("benefit_quick_order")}</span>
            <span><b>⌂</b>{t("benefit_pickup_delivery")}</span>
          </section>

          {offers.length > 0 && (
            <section
              aria-label={t("published_offers")}
              className="storefront-offers"
            >
              <h2 className="storefront-offers__heading">
                {t("published_offers")}
              </h2>
              <div className="storefront-offer-grid">
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
                      className="storefront-offer-card"
                      onClick={() =>
                        offer.product_id &&
                        handleProductClick(String(offer.product_id))
                      }
                    >
                      <OfferImage source={image} alt={offer.title} />
                      <span className="storefront-offer-card__copy">
                        {offer.badge_text && (
                          <small className="storefront-offer-card__badge">
                            {offer.badge_text}
                          </small>
                        )}
                        <strong className="storefront-offer-card__title">
                          {offer.title}
                        </strong>
                        {offer.description && (
                          <span className="storefront-offer-card__description">
                            {offer.description}
                          </span>
                        )}
                        {saving > 0 && (
                          <span className="storefront-offer-card__saving">
                            {t("offer_save", { amount: saving.toFixed(0) })}
                          </span>
                        )}
                        <span className="storefront-offer-card__action">
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
              message={
                searchQuery ? t("no_results") : t("no_products_available")
              }
            />
          ) : (
            <section className="storefront-products" aria-label={t("shop_products")}>
              <div className="storefront-section-heading">
                <div><small>{t("everyday_essentials")}</small><h2>{t("shop_products")}</h2></div>
                <span>{t("product_count", { count: visibleProducts.length })}</span>
              </div>
              <div className="storefront-product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
