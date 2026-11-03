import React, { useEffect, useState } from "react";
import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { apiService } from "@services/api";
import { storageService } from "@services/storage";
import { useAuthStore } from "@store/auth.store";
import { useCartStore } from "@store/cart.store";
import {
  hasStorefrontChanged,
  normalizeShopSlug,
  shouldResetCustomerSession,
} from "./storefront";
import { useTranslation } from "react-i18next";
import TabsLayout from "@features/layout/TabsLayout";

const StorefrontEntryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearCart = useCartStore((state) => state.clearCart);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      setReady(false);
      setError("");
      try {
        const response = await apiService.resolveStorefront(
          normalizeShopSlug(slug),
        );
        if (!active) return;
        const previous = storageService.getStorefront();
        const storefrontChanged = hasStorefrontChanged(
          previous?.tenantId,
          response.data.tenantId,
        );
        if (
          shouldResetCustomerSession(
            isAuthenticated,
            previous?.tenantId,
            response.data.tenantId,
          )
        ) {
          logout();
        } else if (storefrontChanged) {
          await clearCart(true);
        }
        storageService.setStorefront(response.data);
        document.documentElement.style.setProperty(
          "--ion-color-primary",
          response.data.brandColor,
        );
        setReady(true);
        if (
          history.location.pathname === `/shop/${slug}` ||
          history.location.pathname === `/shop/${slug}/`
        ) {
          history.replace(
            `/shop/${encodeURIComponent(response.data.slug)}/home`,
          );
        }
      } catch {
        if (active) setError(t("storefront_unavailable_message"));
      }
    };
    void bootstrap();
    return () => {
      active = false;
    };
  }, [clearCart, history, isAuthenticated, logout, slug, t]);

  if (ready) return <TabsLayout />;

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div
          style={{
            minHeight: "100%",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          {error ? (
            <div>
              <h1>{t("storefront_unavailable")}</h1>
              <p>{error}</p>
            </div>
          ) : (
            <div>
              <IonSpinner />
              <p>{t("opening_shop")}</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StorefrontEntryPage;
