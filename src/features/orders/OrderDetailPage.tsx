import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonButton,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '@services/api';
import { formatCurrency } from '@utils/currency';

const OrderDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const response = await apiService.getOrderById(id);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await apiService.cancelOrder(id);
      loadOrder();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/orders" />
            </IonButtons>
            <IonTitle>{t('order_details')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/orders" />
          </IonButtons>
          <IonTitle>{t('order_details')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {order && (
          <>
            <IonCard>
              <IonCardContent>
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {t('order_id')}: #{order.invoice_number || order.id}
                  </h2>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <IonBadge color="primary" style={{ marginTop: '8px' }}>
                    {order.status}
                  </IonBadge>
                </div>

                <IonList>
                  {order.items?.map((item: any) => (
                    <IonItem key={item.id}>
                      <IonLabel>
                        <h3>{item.variant?.product?.name}</h3>
                        <p>
                          {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </IonLabel>
                      <IonLabel slot="end" className="ion-text-right">
                        {formatCurrency(item.quantity * item.unit_price)}
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>

                <div style={{ borderTop: '1px solid #ddd', paddingTop: '16px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>{t('subtotal')}:</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
                    <span>{t('total')}:</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {order.status === 'DRAFT' && (
              <IonButton
                expand="block"
                color="danger"
                onClick={handleCancelOrder}
                style={{ margin: '16px' }}
              >
                {t('cancel_order')}
              </IonButton>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OrderDetailPage;
