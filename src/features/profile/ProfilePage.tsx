import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from '@ionic/react';
import { language as languageIcon, person, contrast } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/auth.store';
import { useTheme } from '../../contexts/ThemeContext';
import AppHeader from '@components/AppHeader';

const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { customer } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <IonPage>
      <AppHeader />
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
              <p style={{ fontSize: '16px', color: 'var(--ion-color-medium, #666)' }}>{customer?.phone}</p>
              {customer?.email && (
                <p style={{ fontSize: '14px', color: 'var(--ion-color-medium, #666)' }}>{customer.email}</p>
              )}
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonIcon icon={languageIcon} slot="start" />
            <IonLabel>{t('language')}</IonLabel>
            <IonSelect
              value={i18n.language}
              placeholder={t('select_language')}
              onIonChange={(e) => handleLanguageChange(e.detail.value)}
            >
              {languages.map((lang) => (
                <IonSelectOption key={lang.code} value={lang.code}>
                  {lang.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonIcon icon={contrast} slot="start" />
            <IonLabel>{t('theme')}</IonLabel>
            <IonToggle
              checked={theme === 'dark'}
              onIonChange={toggleTheme}
              slot="end"
            >
              {theme === 'dark' ? t('dark_mode') : t('light_mode')}
            </IonToggle>
          </IonItem>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
