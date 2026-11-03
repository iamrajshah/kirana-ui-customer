import React from "react";
import { IonButton, IonContent, IonPage } from "@ionic/react";
import { useTranslation } from "react-i18next";

const StorefrontLandingPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <main className="storefront-landing">
          <div className="storefront-landing__mark">K</div>
          <h1>{t("storefront_landing_title")}</h1>
          <p>{t("storefront_landing_message")}</p>
          <IonButton routerLink="/shop/shop-2" size="large">
            {t("open_demo_shop")}
          </IonButton>
          <small>{t("storefront_link_hint")}</small>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default StorefrontLandingPage;
