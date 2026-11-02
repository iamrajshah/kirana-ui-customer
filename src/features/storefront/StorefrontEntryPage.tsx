import React, { useEffect, useState } from "react";
import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { apiService } from "@services/api";
import { storageService } from "@services/storage";
import { useAuthStore } from "@store/auth.store";
import { normalizeShopSlug, shouldResetCustomerSession } from "./storefront";
import { useTranslation } from "react-i18next";

const StorefrontEntryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      try {
        const response = await apiService.resolveStorefront(
          normalizeShopSlug(slug),
        );
        if (!active) return;
        const previous = storageService.getStorefront();
        if (
          shouldResetCustomerSession(
            isAuthenticated,
            previous?.tenantId,
            response.data.tenantId,
          )
        ) {
          logout();
        }
        storageService.setStorefront(response.data);
        document.documentElement.style.setProperty(
          "--ion-color-primary",
          response.data.brandColor,
        );
        history.replace(
          isAuthenticated && previous?.tenantId === response.data.tenantId
            ? "/home"
            : "/login",
        );
      } catch {
        if (active) setError(t("storefront_unavailable_message"));
      }
    };
    void bootstrap();
    return () => {
      active = false;
    };
  }, [history, isAuthenticated, logout, slug, t]);

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
