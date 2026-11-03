import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBadge,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import {
  cartOutline,
  logOutOutline,
  moonOutline,
  personCircleOutline,
  sunnyOutline,
} from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@store/auth.store";
import { useCartStore } from "@store/cart.store";
import { storageService } from "@services/storage";
import { SHOPPER_LANGUAGES } from "@services/shopperPreferences";
import { useTheme } from "../contexts/ThemeContext";
import { storefrontPath } from "@features/storefront/storefrontPath";
import { getAppHeaderView } from "./appHeaderView";

const AppHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, customer, tenant, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { theme, toggleTheme } = useTheme();
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
    <IonHeader className="bazaar-app-header">
      <IonToolbar className="storefront-app-toolbar">
        <div className="bazaar-header-shell">
          <div className="bazaar-brand">
            {storefront?.logoUrl ? (
              <img src={storefront.logoUrl} alt="" />
            ) : (
              <span aria-hidden="true">{view.title.slice(0, 1)}</span>
            )}
            <div>
              <strong>{view.title}</strong>
              <small>{view.subtitle}</small>
            </div>
          </div>

          <nav className="bazaar-desktop-nav" aria-label={t("main_navigation")}>
            <IonButton fill="clear" routerLink={storefrontPath("/home")}>
              {t("home")}
            </IonButton>
            <IonButton fill="clear" routerLink={storefrontPath("/orders")}>
              {t("orders")}
            </IonButton>
          </nav>

          <IonButtons className="bazaar-header-actions">
            <IonSelect
              className="bazaar-language-select"
              interface="popover"
              aria-label={t("select_language")}
              value={i18n.resolvedLanguage || i18n.language}
              onIonChange={(event) =>
                void i18n.changeLanguage(String(event.detail.value))
              }
            >
              {SHOPPER_LANGUAGES.map((language) => (
                <IonSelectOption key={language.code} value={language.code}>
                  {language.name}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonButton
              className="bazaar-icon-action"
              aria-label={
                theme === "dark" ? t("use_light_theme") : t("use_dark_theme")
              }
              onClick={toggleTheme}
            >
              <IonIcon icon={theme === "dark" ? sunnyOutline : moonOutline} />
            </IonButton>
            <IonButton
              className="bazaar-icon-action bazaar-cart-action"
              aria-label={t("cart")}
              routerLink={storefrontPath("/cart")}
            >
              <IonIcon icon={cartOutline} />
              {itemCount > 0 && <IonBadge>{itemCount}</IonBadge>}
            </IonButton>
            <IonButton
              className="bazaar-icon-action"
              aria-label={isAuthenticated ? t("profile") : t("login")}
              routerLink={storefrontPath(
                isAuthenticated ? "/profile" : "/login",
              )}
            >
              <IonIcon icon={personCircleOutline} />
            </IonButton>
            {view.showLogout && (
              <IonButton
                className="bazaar-icon-action bazaar-logout-action"
                aria-label={t("logout")}
                onClick={logout}
              >
                <IonIcon icon={logOutOutline} />
              </IonButton>
            )}
          </IonButtons>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
