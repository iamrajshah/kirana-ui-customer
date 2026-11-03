import React, { Suspense, lazy } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthStore } from "@store/auth.store";
import { IonSpinner } from "@ionic/react";
import { useTranslation } from "react-i18next";

const TabsLayout = lazy(() => import("@features/layout/TabsLayout"));
const LoginPage = lazy(() => import("@features/auth/LoginPage"));
const RegisterPage = lazy(() => import("@features/auth/RegisterPage"));
const StorefrontEntryPage = lazy(
  () => import("@features/storefront/StorefrontEntryPage"),
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const loading = (
    <div
      role="status"
      style={{ minHeight: "100%", display: "grid", placeItems: "center" }}
    >
      <div style={{ textAlign: "center" }}>
        <IonSpinner />
        <p>{t("loading")}</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={loading}>
      <Route exact path="/shop/:slug" component={StorefrontEntryPage} />
      <Route exact path="/login" component={isAuthenticated ? undefined : LoginPage}>
        {isAuthenticated && <Redirect to="/home" />}
      </Route>
      <Route exact path="/register" component={isAuthenticated ? undefined : RegisterPage}>
        {isAuthenticated && <Redirect to="/home" />}
      </Route>

      <Route path="/" render={() => <TabsLayout />} />
    </Suspense>
  );
};

export default AppRoutes;
