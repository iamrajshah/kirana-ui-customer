import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonBackButton,
  IonButtons,
  IonLoading,
  IonToast,
  IonText,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useCartStore } from '@store/cart.store';
import { useAuthStore } from '@store/auth.store';
import { apiService } from '@services/api';
import QRCode from 'qrcode';
import { formatCurrency } from '@utils/currency';

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const loadCart = useCartStore((state) => state.loadCart);
  const { customer, tenant } = useAuthStore();
  
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'ONLINE' | 'UPI'>('CASH');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Generate QR code when payment method is UPI/ONLINE
  useEffect(() => {
    if ((paymentMethod === 'UPI' || paymentMethod === 'ONLINE') && tenant?.upi_id) {
      generateQRCode();
    } else {
      setQrCodeUrl('');
    }
  }, [paymentMethod, tenant, total]);

  const generateQRCode = async () => {
    if (!tenant?.upi_id) return;
    
    try {
      // UPI payment string format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR
      const upiString = `upi://pay?pa=${tenant.upi_id}&pn=${encodeURIComponent(tenant.name)}&am=${total.toFixed(2)}&cu=INR`;
      const qrUrl = await QRCode.toDataURL(upiString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setError(t('cart_empty'));
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerId: customer?.id ? parseInt(customer.id) : undefined,
        items: items.map(item => ({
          productId: parseInt(item.product_id),
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod,
        total: total,
      };

      const response = await apiService.createOrder(orderData);
      
      if (response.success) {
        // Clear cart and refresh from API to ensure sync
        await clearCart();
        await loadCart();
        
        setSuccess(t('order_placed_successfully') || 'Order placed successfully!');
        setTimeout(() => {
          history.push('/orders');
        }, 2500);
      } else {
        setError(response.message || t('order_failed'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('order_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/cart" />
          </IonButtons>
          <IonTitle>{t('checkout')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {/* Customer Details */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{t('customer_details')}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h2>{customer?.name}</h2>
                  <p>{customer?.phone}</p>
                  {tenant && <p>{t('store')}: {tenant.name}</p>}
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Order Summary */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{t('order_summary')}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {items.map((item) => (
                <IonItem key={item.variant_id}>
                  <IonLabel>
                    <h3>{item.product_name}</h3>
                    <p>
                      {t('quantity')}: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </IonLabel>
                  <IonLabel slot="end" style={{ textAlign: 'right' }}>
                    <h2 style={{ fontWeight: 'bold', color: 'var(--ion-text-color, #000)' }}>
                      {formatCurrency(item.quantity * item.price)}
                    </h2>
                  </IonLabel>
                </IonItem>
              ))}
              
              <IonItem>
                <IonLabel>
                  <h2 style={{ fontWeight: 'bold' }}>{t('total')}</h2>
                </IonLabel>
                <IonLabel slot="end" style={{ textAlign: 'right' }}>
                  <h2 style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--ion-text-color, #000)' }}>
                    {formatCurrency(total)}
                  </h2>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Payment Method */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{t('payment_method')}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>{t('payment_method')}</IonLabel>
              <IonSelect 
                value={paymentMethod} 
                onIonChange={(e) => setPaymentMethod(e.detail.value as 'CASH' | 'ONLINE' | 'UPI')}
                interface="action-sheet"
              >
                <IonSelectOption value="CASH">
                  {t('cash')} - {t('payment_cash')}
                </IonSelectOption>
                <IonSelectOption value="UPI">
                  {t('upi')} - {t('payment_upi')}
                </IonSelectOption>
                <IonSelectOption value="ONLINE">
                  Online - {t('payment_at_shop')}
                </IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* QR Code for UPI/Online Payment */}
        {(paymentMethod === 'UPI' || paymentMethod === 'ONLINE') && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{t('payment_upi')}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {tenant?.upi_id && qrCodeUrl ? (
                <div style={{ textAlign: 'center' }}>
                  <img 
                    src={qrCodeUrl} 
                    alt="UPI QR Code" 
                    style={{ 
                      maxWidth: '300px', 
                      width: '100%',
                      border: '2px solid var(--ion-color-light)',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: 'white'
                    }} 
                  />
                  <IonText color="medium">
                    <p style={{ marginTop: '16px', fontSize: '14px' }}>
                      Scan this QR code with any UPI app
                    </p>
                    <p style={{ fontSize: '12px', marginTop: '8px' }}>
                      UPI ID: {tenant.upi_id}
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px', color: 'var(--ion-color-primary)' }}>
                      Amount: {formatCurrency(total)}
                    </p>
                  </IonText>
                  <IonText color="warning">
                    <p style={{ marginTop: '16px', fontSize: '13px' }}>
                      ⚠️ {t('i_have_paid')}
                    </p>
                  </IonText>
                </div>
              ) : (
                <IonText color="danger">
                  <p style={{ textAlign: 'center', padding: '20px' }}>
                    UPI payment not available. Please contact store owner.
                  </p>
                </IonText>
              )}
            </IonCardContent>
          </IonCard>
        )}

        {/* Place Order Button */}
        <IonButton
          expand="block"
          onClick={handlePlaceOrder}
          disabled={loading || items.length === 0}
          style={{ marginTop: '20px', fontSize: '18px', height: '50px' }}
        >
          {t('place_order')} - {formatCurrency(total)}
        </IonButton>

        <IonLoading isOpen={loading} message={t('placing_order') || 'Placing your order...'} />
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError('')}
          color="danger"
        />
        <IonToast
          isOpen={!!success}
          message={success}
          duration={2500}
          onDidDismiss={() => setSuccess('')}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default CheckoutPage;
