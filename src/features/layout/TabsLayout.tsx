import React, { Suspense, lazy } from "react";
import { Route, Redirect, useParams } from "react-router-dom";
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
import { cart, compassOutline, home, receipt } from "ionicons/icons";
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
const LoginPage = lazy(() => import("@features/auth/LoginPage"));
const RegisterPage = lazy(() => import("@features/auth/RegisterPage"));

const TabsLayout: React.FC = () => {
  const { t } = useTranslation();
  const itemCount = useCartStore((state) => state.getItemCount());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { slug } = useParams<{ slug: string }>();
  const base = `/shop/${encodeURIComponent(slug)}`;

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
          <Route exact path={`${base}/home`} component={HomePage} />
          <Route
            exact
            path={`${base}/product/:id`}
            component={ProductDetailPage}
          />
          <Route exact path={`${base}/cart`} component={CartPage} />
          <Route exact path={`${base}/checkout`} component={CheckoutPage} />
          <Route exact path={`${base}/login`}>
            {isAuthenticated ? <Redirect to={`${base}/home`} /> : <LoginPage />}
          </Route>
          <Route exact path={`${base}/register`}>
            {isAuthenticated ? (
              <Redirect to={`${base}/home`} />
            ) : (
              <RegisterPage />
            )}
          </Route>
          <Route exact path={`${base}/orders`}>
            {isAuthenticated ? (
              <OrdersPage />
            ) : (
              <Redirect to={`${base}/home`} />
            )}
          </Route>
          <Route exact path={`${base}/order/:id`}>
            {isAuthenticated ? (
              <OrderDetailPage />
            ) : (
              <Redirect to={`${base}/home`} />
            )}
          </Route>
          <Route exact path={`${base}/profile`}>
            {isAuthenticated ? (
              <ProfilePage />
            ) : (
              <Redirect to={`${base}/home`} />
            )}
          </Route>
          <Route exact path={base}>
            <Redirect to={`${base}/home`} />
          </Route>
        </Suspense>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="storefront-bottom-nav">
        <IonTabButton tab="home" href={`${base}/home`}>
          <IonIcon icon={home} />
          <IonLabel>{t("home")}</IonLabel>
        </IonTabButton>

        <IonTabButton
          tab="browse"
          href={`${base}/home#catalog`}
          onClick={() =>
            document
              .getElementById("catalog")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <IonIcon icon={compassOutline} />
          <IonLabel>{t("browse")}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="orders" href={`${base}/orders`}>
          <IonIcon icon={receipt} />
          <IonLabel>{t("orders")}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="cart" href={`${base}/cart`}>
          <IonIcon icon={cart} />
          <IonLabel>{t("basket")}</IonLabel>
          {itemCount > 0 && (
            <IonBadge color="danger" className="storefront-bottom-nav__badge">
              {itemCount}
            </IonBadge>
          )}
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsLayout;
