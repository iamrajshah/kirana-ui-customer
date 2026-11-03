import React, { useState, useEffect, useRef } from "react";
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { apiService } from "@services/api";
import ProductCard from "@components/ProductCard";
import EmptyState from "@components/EmptyState";
import AppHeader from "@components/AppHeader";
import ImageWithFallback from "@components/ImageWithFallback";
import { toast } from "@services/toast";
import { storageService } from "@services/storage";
import { storefrontPath } from "@features/storefront/storefrontPath";
import {
  getOfferImageFallback,
  getOfferImageSource,
} from "@features/catalog/offerMedia";
import CategoryNavigator from "./CategoryNavigator";
import type { StorefrontCategory } from "./categoryNavigation";
import { formatCurrency } from "@utils/currency";

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
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<StorefrontCategory[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offersOnly, setOffersOnly] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchSequenceRef = useRef(0);
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
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    const sequence = searchSequenceRef.current + 1;
    searchSequenceRef.current = sequence;
    void loadProducts(sequence);
  }, [selectedCategory]);

  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchSequenceRef.current += 1;
    },
    [],
  );

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

  const loadProducts = async (sequence = searchSequenceRef.current) => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== "all") {
        params.category_id = selectedCategory;
      }

      const response = await apiService.getProducts(params);
      if (
        sequence === searchSequenceRef.current &&
        response.success &&
        response.data.products
      ) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      if (sequence === searchSequenceRef.current) {
        toast.error(t("load_products_failed"));
      }
    } finally {
      if (sequence === searchSequenceRef.current) setLoading(false);
    }
  };

  const runSearch = async (query: string, sequence: number) => {
    if (!query.trim()) {
      await loadProducts(sequence);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.searchProducts(query);
      if (
        sequence === searchSequenceRef.current &&
        response.success &&
        response.data.products
      ) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Search failed:", error);
      if (sequence === searchSequenceRef.current) {
        toast.error(t("search_failed"));
      }
    } finally {
      if (sequence === searchSequenceRef.current) setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const sequence = searchSequenceRef.current + 1;
    searchSequenceRef.current = sequence;
    searchTimerRef.current = setTimeout(() => {
      searchTimerRef.current = null;
      void runSearch(query, sequence);
    }, 500);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    const sequence = searchSequenceRef.current + 1;
    searchSequenceRef.current = sequence;
    await loadCategories();
    await loadOffers();
    await loadProducts(sequence);
    event.detail.complete();
  };

  useEffect(() => {
    if (location.hash !== "#catalog" || loading) return;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById("catalog")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [loading, location.hash]);

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
  const featuredProduct = discountedProducts[0] ?? products[0];
  const featuredVariant = featuredProduct?.variants?.[0];

  return (
    <IonPage>
      <AppHeader />
      <IonContent className="bazaar-page">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="storefront-content">
          <section
            className="bazaar-search-shell"
            aria-label={t("search_products")}
          >
            <IonSearchbar
              className="bazaar-search"
              value={searchQuery}
              onIonChange={(event) => {
                const value = event.detail.value || "";
                setSearchQuery(value);
                handleSearch(value);
              }}
              placeholder={t("search_products")}
            />
          </section>

          <CategoryNavigator
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <section className="bazaar-hero-layout">
            <div
              className="storefront-hero"
              style={
                {
                  "--storefront-brand": storefront?.brandColor || "#087F5B",
                } as React.CSSProperties
              }
            >
              <div className="storefront-hero__glow" aria-hidden="true" />
              <span className="storefront-hero__eyebrow">
                {t("your_neighbourhood_bazaar")}
              </span>
              <p>{t("shop_online_from")}</p>
              <h1>{storefront?.name || t("app_name")}</h1>
              <span className="storefront-hero__message">
                {t("storefront_hero_message")}
              </span>
              <button
                type="button"
                onClick={() => setOffersOnly((value) => !value)}
                className="storefront-hero__action"
              >
                {offersOnly
                  ? t("show_all_products")
                  : t("view_offers", { count: discountedProducts.length })}
              </button>
            </div>

            {featuredProduct && featuredVariant && (
              <button
                type="button"
                className="bazaar-featured-deal"
                onClick={() => handleProductClick(String(featuredProduct.id))}
              >
                <span className="bazaar-featured-deal__copy">
                  <small>{t("featured_deal")}</small>
                  <strong>{featuredProduct.name}</strong>
                  <span>
                    {formatCurrency(featuredVariant.selling_price)}
                    {Number(featuredVariant.mrp_price) >
                      Number(featuredVariant.selling_price) && (
                      <del>{formatCurrency(featuredVariant.mrp_price)}</del>
                    )}
                  </span>
                  <b>{t("shop_now")} →</b>
                </span>
                <ImageWithFallback
                  src={featuredProduct.image_url || featuredVariant.image_url}
                  alt={featuredProduct.name}
                />
              </button>
            )}
          </section>

          <section
            className="storefront-benefits"
            aria-label={t("shopping_benefits")}
          >
            <span>
              <b>✓</b>
              {t("benefit_shop_prices")}
            </span>
            <span>
              <b>◷</b>
              {t("benefit_quick_order")}
            </span>
            <span>
              <b>⌂</b>
              {t("benefit_pickup_delivery")}
            </span>
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
            <section
              className="storefront-products"
              aria-label={t("shop_products")}
            >
              <div className="storefront-section-heading" id="catalog">
                <div>
                  <small>{t("fresh_picks")}</small>
                  <h2>{t("shop_products")}</h2>
                </div>
                <span>
                  {t("product_count", { count: visibleProducts.length })}
                </span>
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
