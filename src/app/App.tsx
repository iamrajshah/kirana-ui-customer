import React, { useEffect } from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import AppRoutes from './routes';
import { ToastContainer } from '../components/ToastContainer';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useAuthStore } from '@store/auth.store';
import { useCartStore } from '@store/cart.store';

const App: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    // Load cart from API on app start if user is authenticated
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated, loadCart]);

  return (
    <ThemeProvider>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <AppRoutes />
          </IonRouterOutlet>
        </IonReactRouter>
        <ToastContainer />
      </IonApp>
    </ThemeProvider>
  );
};

export default App;
