import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';

// Layouts
import TabsLayout from '@features/layout/TabsLayout';

// Auth Pages
import LoginPage from '@features/auth/LoginPage';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="*">
          <Redirect to="/login" />
        </Route>
      </>
    );
  }

  return (
    <>
      <Route exact path="/login">
        <Redirect to="/home" />
      </Route>
      
      <Route path="/" render={() => <TabsLayout />} />
    </>
  );
};

export default AppRoutes;
