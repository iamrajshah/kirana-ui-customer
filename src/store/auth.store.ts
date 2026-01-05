import { create } from 'zustand';
import { storageService } from '@services/storage';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  customer: Customer | null;
  login: (token: string, customer: Customer) => void;
  logout: () => void;
  updateCustomer: (customer: Customer) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize from localStorage
  const token = storageService.getAuthToken();
  const userData = storageService.getUserData();

  return {
    isAuthenticated: !!token,
    token,
    customer: userData,
    
    login: (token: string, customer: Customer) => {
      storageService.setAuthToken(token);
      storageService.setUserData(customer);
      set({ isAuthenticated: true, token, customer });
    },
    
    logout: () => {
      storageService.removeAuthToken();
      storageService.removeUserData();
      storageService.removeCart();
      set({ isAuthenticated: false, token: null, customer: null });
    },
    
    updateCustomer: (customer: Customer) => {
      storageService.setUserData(customer);
      set({ customer });
    },
  };
});
