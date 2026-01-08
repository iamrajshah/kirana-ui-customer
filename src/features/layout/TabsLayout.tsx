import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { 
  IonTabs, 
  IonRouterOutlet, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel, 
  IonBadge,
} from '@ionic/react';
import { home, cart, receipt, person } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@store/cart.store';

// Pages
import HomePage from '@features/catalog/HomePage';
import ProductDetailPage from '@features/catalog/ProductDetailPage';
import CartPage from '@features/cart/CartPage';
import CheckoutPage from '@features/checkout/CheckoutPage';
import OrdersPage from '@features/orders/OrdersPage';
import OrderDetailPage from '@features/orders/OrderDetailPage';
import ProfilePage from '@features/profile/ProfilePage';

const TabsLayout: React.FC = () => {
  const { t } = useTranslation();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/product/:id" component={ProductDetailPage} />
        <Route exact path="/cart" component={CartPage} />
        <Route exact path="/checkout" component={CheckoutPage} />
        <Route exact path="/orders" component={OrdersPage} />
        <Route exact path="/order/:id" component={OrderDetailPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={home} />
          <IonLabel>{t('home')}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="cart" href="/cart">
          <IonIcon icon={cart} />
          <IonLabel>{t('cart')}</IonLabel>
          {itemCount > 0 && (
            <IonBadge color="danger" style={{ position: 'absolute', top: '4px', right: '20px' }}>
              {itemCount}
            </IonBadge>
          )}
        </IonTabButton>

        <IonTabButton tab="orders" href="/orders">
          <IonIcon icon={receipt} />
          <IonLabel>{t('orders')}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={person} />
          <IonLabel>{t('profile')}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsLayout;
