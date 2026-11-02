import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { apiService } from '@services/api';
import { storageService } from '@services/storage';
import { useAuthStore } from '@store/auth.store';
import { normalizeShopSlug, shouldResetCustomerSession } from './storefront';

const StorefrontEntryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      try {
        const response = await apiService.resolveStorefront(normalizeShopSlug(slug));
        if (!active) return;
        const previous = storageService.getStorefront();
        if (shouldResetCustomerSession(isAuthenticated, previous?.tenantId, response.data.tenantId)) {
          logout();
        }
        storageService.setStorefront(response.data);
        document.documentElement.style.setProperty('--ion-color-primary', response.data.brandColor);
        history.replace(isAuthenticated && previous?.tenantId === response.data.tenantId ? '/home' : '/login');
      } catch {
        if (active) setError('This shop link is unavailable. Ask the shopkeeper for the latest link.');
      }
    };
    void bootstrap();
    return () => {
      active = false;
    };
  }, [history, isAuthenticated, logout, slug]);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{ minHeight: '100%', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          {error ? (
            <div>
              <h1>Shop unavailable</h1>
              <p>{error}</p>
            </div>
          ) : (
            <div>
              <IonSpinner />
              <p>Opening shop…</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StorefrontEntryPage;
