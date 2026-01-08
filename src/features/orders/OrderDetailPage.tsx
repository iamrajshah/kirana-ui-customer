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
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonThumbnail,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '@services/api';
import { formatCurrency } from '@utils/currency';
import { toast } from '@services/toast';
import ImageWithFallback from '@components/ImageWithFallback';

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
      toast.error(t('failed_to_load') || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await apiService.cancelOrder(id);
      toast.success(t('order_cancelled_success') || 'Order cancelled successfully');
      loadOrder();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error(t('order_cancel_failed') || 'Failed to cancel order');
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
            {/* Order Header */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  {t('order_id')}: #{order.invoice_number || order.id}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: 'var(--ion-color-medium)', margin: '0 0 8px 0' }}>
                      {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                    <IonBadge color={
                      order.status === 'CANCELLED' ? 'danger' :
                      order.status === 'DELIVERED' ? 'success' :
                      order.status === 'PLACED' ? 'primary' : 'medium'
                    }>
                      {order.status}
                    </IonBadge>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Order Items */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{t('order_summary')}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {order.items?.map((item: any) => (
                    <IonItem key={item.id} lines="full">
                      <IonThumbnail slot="start" style={{ width: '60px', height: '60px' }}>
                        <ImageWithFallback
                          src={item.variant_image_url || item.product_image_url}
                          alt={item.product_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </IonThumbnail>
                      <IonLabel>
                        <h2 style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                          {item.product_name?.replace(/_/g, ' ')}
                        </h2>
                        <p style={{ fontSize: '13px', color: 'var(--ion-color-medium)', marginBottom: '2px' }}>
                          {item.brand && `${item.brand} • `}{item.size} {item.packaging && `• ${item.packaging}`}
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--ion-color-medium)' }}>
                          SKU: {item.sku}
                        </p>
                        <p style={{ fontSize: '14px', marginTop: '4px' }}>
                          {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </IonLabel>
                      <IonLabel slot="end" style={{ textAlign: 'right' }}>
                        <h2 style={{ fontWeight: 'bold', fontSize: '16px' }}>
                          {formatCurrency(item.total_price)}
                        </h2>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>

                {/* Totals */}
                <div style={{ borderTop: '2px solid var(--ion-color-light)', paddingTop: '16px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--ion-color-medium)' }}>{t('subtotal')}:</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
                    <span>{t('total')}:</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Payment Status */}
            <IonCard>
              <IonCardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: 'var(--ion-color-medium)', margin: '0 0 4px 0' }}>
                      {t('payment_status')}
                    </p>
                    <IonBadge color={
                      order.invoice_status === 'PAID' ? 'success' :
                      order.invoice_status === 'CANCELLED' ? 'danger' :
                      'warning'
                    }>
                      {order.invoice_status}
                    </IonBadge>
                  </div>
                  {order.status !== 'CANCELLED' && (
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: 'var(--ion-color-medium)', margin: '0 0 4px 0' }}>
                        Paid: {formatCurrency(order.paid_amount || 0)}
                      </p>
                      {order.paid_amount < order.total_amount && (
                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--ion-color-danger)', margin: 0 }}>
                          Due: {formatCurrency(order.total_amount - (order.paid_amount || 0))}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </IonCardContent>
            </IonCard>

            {order.status === 'PLACED' && (
              <IonButton
                expand="block"
                color="danger"
                onClick={handleCancelOrder}
                style={{ margin: '16px 0' }}
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
