import { create } from 'zustand';
import { storageService } from '@services/storage';
import { useCartStore } from './cart.store';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface Tenant {
  id: string;
  name: string;
  upi_id?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  customer: Customer | null;
  tenant: Tenant | null;
  login: (token: string, customer: Customer, tenant?: Tenant) => void;
  logout: () => void;
  updateCustomer: (customer: Customer) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from localStorage
  const token = storageService.getAuthToken();
  const userData = storageService.getUserData();
  const tenantData = storageService.getTenantData();

  console.log('Auth Store Init - Token:', !!token, 'User:', userData, 'Tenant:', tenantData);

  return {
    isAuthenticated: !!token,
    token,
    customer: userData,
    tenant: tenantData,
    
    login: (token: string, customer: Customer, tenant?: Tenant) => {
      console.log('Auth Store login called with:', { token: !!token, customer, tenant });
      storageService.setAuthToken(token);
      storageService.setUserData(customer);
      if (tenant) {
        storageService.setTenantData(tenant);
      }
      set({ isAuthenticated: true, token, customer, tenant: tenant || null });
      
      // Load cart from API after login
      setTimeout(() => {
        useCartStore.getState().loadCart();
      }, 100);
    },
    
    logout: () => {
      // Clear cart locally only (no API call as token will be removed)
      useCartStore.getState().clearCart(true);
      
      storageService.removeAuthToken();
      storageService.removeUserData();
      storageService.removeCart();
      storageService.removeTenantData();
      set({ isAuthenticated: false, token: null, customer: null, tenant: null });
    },
    
    updateCustomer: (customer: Customer) => {
      storageService.setUserData(customer);
      set({ customer });
    },
  };
});
