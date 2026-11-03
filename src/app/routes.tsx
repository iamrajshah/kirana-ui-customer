import React, { Suspense, lazy } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { IonSpinner } from "@ionic/react";
import { useTranslation } from "react-i18next";

const StorefrontEntryPage = lazy(
  () => import("@features/storefront/StorefrontEntryPage"),
);
const StorefrontLandingPage = lazy(
  () => import("@features/storefront/StorefrontLandingPage"),
);

const AppRoutes: React.FC = () => {
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
      <Switch>
        <Route path="/shop/:slug" component={StorefrontEntryPage} />
        <Route exact path="/" component={StorefrontLandingPage} />
        <Redirect to="/" />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
