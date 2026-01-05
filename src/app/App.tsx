import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <AppRoutes />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
