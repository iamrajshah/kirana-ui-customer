import React, { useState, useEffect } from 'react';
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
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { apiService } from '@services/api';
import EmptyState from '@components/EmptyState';
import AppHeader from '@components/AppHeader';
import { formatCurrency } from '@utils/currency';
import { toast } from '@services/toast';

const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await apiService.getOrders();
      if (response.success && response.data.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadOrders();
    event.detail.complete();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'medium',
      PENDING: 'warning',
      CONFIRMED: 'primary',
      PREPARING: 'tertiary',
      READY: 'success',
      COMPLETED: 'success',
      CANCELLED: 'danger',
    };
    return colors[status] || 'medium';
  };

  return (
    <IonPage>
      <AppHeader />
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t('my_orders')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <IonSpinner />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📋"
            message={t('no_orders')}
            actionLabel={t('continue_shopping')}
            onAction={() => history.push('/home')}
          />
        ) : (
          <IonList>
            {orders.map((order) => (
              <IonItem
                key={order.id}
                button
                onClick={() => history.push(`/order/${order.id}`)}
              >
                <IonLabel>
                  <h2 style={{ fontWeight: 'bold' }}>
                    {t('order_id')}: #{order.invoice_number || order.id}
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--ion-color-medium, #666)' }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
                    {formatCurrency(order.total_amount)}
                  </p>
                </IonLabel>
                <IonBadge slot="end" color={getStatusColor(order.status)}>
                  {t(`order_status_${order.status.toLowerCase()}`)}
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
