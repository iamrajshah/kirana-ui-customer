import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonLoading,
  IonToast,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { eye, eyeOff, language as languageIcon, contrast } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { apiService } from '@services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from '@services/toast';

const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const { login } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
  ];

  const handleLogin = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login(phone, password);
      
      console.log('Login response:', response);
      console.log('Tenant data:', response.data?.tenant);
      
      if (response.success) {
        login(response.data.token, response.data.customer, response.data.tenant);
        toast.success(t('login_success') || 'Login successful!');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100%' 
        }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              {t('app_name')}
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ion-color-medium, #666)' }}>
              {t('welcome')}
            </p>
          </div>

          {/* Language and Theme Settings */}
          <IonCard style={{ width: '100%', maxWidth: '400px', marginBottom: '16px' }}>
            <IonItem lines="none">
              <IonIcon icon={languageIcon} slot="start" />
              <IonLabel>{t('language')}</IonLabel>
              <IonSelect
                value={i18n.language}
                placeholder={t('select_language')}
                onIonChange={(e) => i18n.changeLanguage(e.detail.value)}
                interface="action-sheet"
              >
                {languages.map((lang) => (
                  <IonSelectOption key={lang.code} value={lang.code}>
                    {lang.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem lines="none">
              <IonIcon icon={contrast} slot="start" />
              <IonLabel>{t('theme')}</IonLabel>
              <IonToggle
                checked={theme === 'dark'}
                onIonChange={toggleTheme}
                slot="end"
              />
            </IonItem>
          </IonCard>

          <IonCard style={{ width: '100%', maxWidth: '400px' }}>
            <IonCardContent>
              <IonInput
                type="tel"
                placeholder={t('enter_mobile')}
                value={phone}
                onIonChange={(e) => setPhone(e.detail.value || '')}
                maxlength={10}
                style={{ fontSize: '18px', marginBottom: '20px' }}
              />
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <IonInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('enter_password')}
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value || '')}
                  style={{ fontSize: '18px' }}
                />
                <IonIcon
                  icon={showPassword ? eyeOff : eye}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: 'var(--ion-color-medium, #666)',
                  }}
                />
              </div>
              <IonButton
                expand="block"
                onClick={handleLogin}
                disabled={loading}
                style={{ fontSize: '16px', height: '48px' }}
              >
                {t('login')}
              </IonButton>
              <IonButton
                expand="block"
                fill="clear"
                onClick={() => history.push('/register')}
                style={{ marginTop: '8px' }}
              >
                {t('create_account')}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={loading} message={t('loading')} />
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError('')}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
