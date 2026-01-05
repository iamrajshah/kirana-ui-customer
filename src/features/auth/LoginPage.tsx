import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonText,
  IonLoading,
  IonToast,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/auth.store';
import { apiService } from '@services/api';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      // For now, just move to OTP step
      // In production, backend will send actual OTP via SMS
      setStep('otp');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login(phone, otp);
      
      if (response.success) {
        login(response.data.token, response.data.customer);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
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
            <p style={{ fontSize: '16px', color: '#666' }}>
              {t('welcome')}
            </p>
          </div>

          <IonCard style={{ width: '100%', maxWidth: '400px' }}>
            <IonCardContent>
              {step === 'phone' ? (
                <>
                  <IonInput
                    type="tel"
                    placeholder={t('enter_mobile')}
                    value={phone}
                    onIonChange={(e) => setPhone(e.detail.value || '')}
                    maxlength={10}
                    style={{ fontSize: '18px', marginBottom: '20px' }}
                  />
                  <IonButton
                    expand="block"
                    onClick={handleSendOTP}
                    disabled={loading}
                    style={{ fontSize: '16px', height: '48px' }}
                  >
                    {t('send_otp')}
                  </IonButton>
                </>
              ) : (
                <>
                  <IonText>
                    <p style={{ marginBottom: '16px' }}>
                      OTP sent to {phone}
                    </p>
                  </IonText>
                  <IonInput
                    type="number"
                    placeholder={t('enter_otp')}
                    value={otp}
                    onIonChange={(e) => setOtp(e.detail.value || '')}
                    maxlength={6}
                    style={{ fontSize: '18px', marginBottom: '20px' }}
                  />
                  <IonButton
                    expand="block"
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    style={{ fontSize: '16px', height: '48px' }}
                  >
                    {t('verify_otp')}
                  </IonButton>
                  <IonButton
                    expand="block"
                    fill="clear"
                    onClick={() => setStep('phone')}
                    style={{ marginTop: '8px' }}
                  >
                    Change Number
                  </IonButton>
                </>
              )}
            </IonCardContent>
          </IonCard>

          <p style={{ marginTop: '20px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
            For demo: Use any 10-digit number and OTP "1234"
          </p>
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
