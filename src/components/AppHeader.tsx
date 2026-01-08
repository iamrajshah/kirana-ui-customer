import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { logOut } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/auth.store';

const AppHeader: React.FC = () => {
  const { t } = useTranslation();
  const { customer, tenant, logout } = useAuthStore();

  console.log('AppHeader - Tenant:', tenant, 'Customer:', customer);

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {tenant?.name || 'Kirana Store'}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 'normal', opacity: 0.7 }}>
              Welcome, {customer?.name}
            </span>
          </div>
        </IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={logout} color="danger">
            <IonIcon icon={logOut} slot="start" />
            {t('logout')}
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
