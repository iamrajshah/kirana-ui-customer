import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { trash } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useCartStore } from '@store/cart.store';
import QuantitySelector from '@components/QuantitySelector';
import ImageWithFallback from '@components/ImageWithFallback';
import EmptyState from '@components/EmptyState';
import AppHeader from '@components/AppHeader';
import { formatCurrency } from '@utils/currency';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const handleCheckout = () => {
    // Navigate to checkout flow
    history.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t('my_cart')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <EmptyState
            icon="🛒"
            message={t('cart_empty')}
            actionLabel={t('continue_shopping')}
            onAction={() => history.push('/home')}
          />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader />
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t('my_cart')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {items.map((item) => (
            <IonItem key={item.variant_id}>
              <IonThumbnail slot="start">
                <ImageWithFallback
                  src={item.image_url}
                  alt={item.product_name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              </IonThumbnail>
              
              <IonLabel>
                <h2 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.product_name}</h2>
                {item.brand && <p style={{ fontSize: '12px', color: 'var(--ion-color-medium, #666)' }}>{item.brand}</p>}
                {item.unit && <p style={{ fontSize: '12px', color: 'var(--ion-color-medium, #666)' }}>{item.unit}</p>}
                <p style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
                  {formatCurrency(item.price * item.quantity)}
                </p>
                
                <div style={{ marginTop: '8px' }}>
                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => updateQuantity(item.variant_id, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.variant_id, item.quantity - 1)}
                    max={item.max_quantity}
                  />
                </div>
              </IonLabel>

              <IonButton
                slot="end"
                fill="clear"
                color="danger"
                onClick={() => removeItem(item.variant_id)}
              >
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {/* Cart Summary */}
        <IonCard style={{ position: 'sticky', bottom: 0, margin: '16px' }}>
          <IonCardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{t('total')}</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--ion-text-color, #000)' }}>
                {formatCurrency(getTotal())}
              </span>
            </div>
            <IonButton expand="block" size="large" onClick={handleCheckout}>
              {t('proceed_to_checkout')}
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default CartPage;
