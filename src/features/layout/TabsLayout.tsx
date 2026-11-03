import React, { Suspense, lazy } from "react";
import { Route, Redirect } from "react-router-dom";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
  IonSpinner,
} from "@ionic/react";
import { home, cart, receipt, person } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@store/cart.store";
import { useAuthStore } from "@store/auth.store";

const HomePage = lazy(() => import("@features/catalog/HomePage"));
const ProductDetailPage = lazy(
  () => import("@features/catalog/ProductDetailPage"),
);
const CartPage = lazy(() => import("@features/cart/CartPage"));
const CheckoutPage = lazy(() => import("@features/checkout/CheckoutPage"));
const OrdersPage = lazy(() => import("@features/orders/OrdersPage"));
const OrderDetailPage = lazy(() => import("@features/orders/OrderDetailPage"));
const ProfilePage = lazy(() => import("@features/profile/ProfilePage"));

const TabsLayout: React.FC = () => {
  const { t } = useTranslation();
  const itemCount = useCartStore((state) => state.getItemCount());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Suspense
          fallback={
            <div
              role="status"
              style={{
                minHeight: "100%",
                display: "grid",
                placeItems: "center",
              }}
            >
              <IonSpinner aria-label={t("loading")} />
            </div>
          }
        >
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/product/:id" component={ProductDetailPage} />
          <Route exact path="/cart" component={CartPage} />
          <Route exact path="/checkout" component={CheckoutPage} />
          <Route exact path="/orders">
            {isAuthenticated ? <OrdersPage /> : <Redirect to="/home" />}
          </Route>
          <Route exact path="/order/:id">
            {isAuthenticated ? <OrderDetailPage /> : <Redirect to="/home" />}
          </Route>
          <Route exact path="/profile">
            {isAuthenticated ? <ProfilePage /> : <Redirect to="/home" />}
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </Suspense>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={home} />
          <IonLabel>{t("home")}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="cart" href="/cart">
          <IonIcon icon={cart} />
          <IonLabel>{t("cart")}</IonLabel>
          {itemCount > 0 && (
            <IonBadge
              color="danger"
              style={{ position: "absolute", top: "4px", right: "20px" }}
            >
              {itemCount}
            </IonBadge>
          )}
        </IonTabButton>

        {isAuthenticated && (
          <IonTabButton tab="orders" href="/orders">
            <IonIcon icon={receipt} />
            <IonLabel>{t("orders")}</IonLabel>
          </IonTabButton>
        )}

        {isAuthenticated && (
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={person} />
            <IonLabel>{t("profile")}</IonLabel>
          </IonTabButton>
        )}
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsLayout;
