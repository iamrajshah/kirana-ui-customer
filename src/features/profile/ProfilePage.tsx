import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/react';
import { logOut, language, person } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/auth.store';

const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { customer, logout } = useAuthStore();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t('my_profile')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <IonIcon
                icon={person}
                style={{ fontSize: '64px', color: '#3880ff', marginBottom: '16px' }}
              />
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                {customer?.name}
              </h2>
              <p style={{ fontSize: '16px', color: '#666' }}>{customer?.phone}</p>
              {customer?.email && (
                <p style={{ fontSize: '14px', color: '#666' }}>{customer.email}</p>
              )}
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonItem button onClick={toggleLanguage}>
            <IonIcon icon={language} slot="start" />
            <IonLabel>
              <h3>{t('language')}</h3>
              <p>{i18n.language === 'en' ? 'English' : 'हिंदी'}</p>
            </IonLabel>
          </IonItem>
        </IonCard>

        <IonButton
          expand="block"
          color="danger"
          onClick={logout}
          style={{ marginTop: '32px' }}
        >
          <IonIcon icon={logOut} slot="start" />
          {t('logout')}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
