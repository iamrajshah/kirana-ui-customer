import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { logOut } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@store/auth.store";
import { storageService } from "@services/storage";
import { getAppHeaderView } from "./appHeaderView";

const AppHeader: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, customer, tenant, logout } = useAuthStore();
  const storefront = storageService.getStorefront();
  const view = getAppHeaderView({
    isAuthenticated,
    storefrontName: storefront?.name,
    tenantName: tenant?.name,
    customerName: customer?.name,
    fallbackName: t("app_name"),
    welcome: t("welcome"),
    guestNote: t("guest_browsing_note"),
  });

  return (
    <IonHeader>
      <IonToolbar className="storefront-app-toolbar">
        <IonTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              {view.title}
            </span>
            <span
              style={{ fontSize: "12px", fontWeight: "normal", opacity: 0.7 }}
            >
              {view.subtitle}
            </span>
          </div>
        </IonTitle>
        {view.showLogout && (
          <IonButtons slot="end">
            <IonButton onClick={logout} color="danger">
              <IonIcon icon={logOut} slot="start" />
              {t("logout")}
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
