import { create } from 'zustand';
import { storage } from '@/utils/storage';
import type { Customer } from '@/types/auth';

interface AuthState {
  token: string | null;
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (token: string, customer: Customer) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  customer: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (token, customer) => {
    await storage.setItem('auth_token', token);
    await storage.setItem('customer', JSON.stringify(customer));
    set({ token, customer, isAuthenticated: true });
  },

  clearAuth: async () => {
    await storage.deleteItem('auth_token');
    await storage.deleteItem('customer');
    set({ token: null, customer: null, isAuthenticated: false });
  },

  loadAuth: async () => {
    try {
      const token = await storage.getItem('auth_token');
      const customerStr = await storage.getItem('customer');
      
      if (token && customerStr) {
        const customer = JSON.parse(customerStr);
        set({ token, customer, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
      set({ isLoading: false });
    }
  },
}));
