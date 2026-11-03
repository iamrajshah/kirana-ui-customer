import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { storefrontPath } from "@features/storefront/storefrontPath";
import { apiService } from "@services/api";
import EmptyState from "@components/EmptyState";
import AppHeader from "@components/AppHeader";
import { formatCurrency } from "@utils/currency";
import { toast } from "@services/toast";
import { startForegroundPolling } from "@utils/foregroundPolling";
import {
  getOrderStatusColor,
  getOrderStatusTranslationKey,
} from "./orderStatus";

const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const activePage = useRef(true);

  const loadOrders = useCallback(
    async ({ showLoader = false, notifyError = false } = {}) => {
      if (showLoader) setLoading(true);
      try {
        const response = await apiService.getOrders();
        if (response.success && response.data.orders) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
        if (notifyError) toast.error(t("load_orders_failed"));
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    activePage.current = true;
    void loadOrders({ showLoader: true, notifyError: true });
    return () => {
      activePage.current = false;
    };
  }, [loadOrders]);

  useEffect(
    () =>
      startForegroundPolling({
        poll: () => loadOrders(),
        intervalMs: 5_000,
        isHidden: () => document.hidden || !activePage.current,
      }),
    [loadOrders],
  );

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadOrders({ notifyError: true });
    event.detail.complete();
  };

  return (
    <IonPage>
      <AppHeader />
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("my_orders")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

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
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📋"
            message={t("no_orders")}
            actionLabel={t("continue_shopping")}
            onAction={() => history.push(storefrontPath("/home"))}
          />
        ) : (
          <IonList>
            {orders.map((order) => (
              <IonItem
                key={order.id}
                button
                onClick={() =>
                  history.push(storefrontPath(`/order/${order.id}`))
                }
              >
                <IonLabel>
                  <h2 style={{ fontWeight: "bold" }}>
                    {t("order_id")}: #{order.invoice_number || order.id}
                  </h2>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--ion-color-medium, #666)",
                    }}
                  >
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {formatCurrency(order.total_amount)}
                  </p>
                </IonLabel>
                <IonBadge slot="end" color={getOrderStatusColor(order.status)}>
                  {t(getOrderStatusTranslationKey(order.status))}
                </IonBadge>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OrdersPage;
