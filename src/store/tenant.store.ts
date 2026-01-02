import { create } from 'zustand';
import { storage } from '@/utils/storage';

interface TenantState {
  tenantId: string | null;
  tenantName: string | null;
  
  setTenant: (tenantId: string, tenantName: string) => Promise<void>;
  clearTenant: () => Promise<void>;
  loadTenant: () => Promise<void>;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenantId: null,
  tenantName: null,

  setTenant: async (tenantId, tenantName) => {
    await storage.setItem('tenant_id', tenantId);
    await storage.setItem('tenant_name', tenantName);
    set({ tenantId, tenantName });
  },

  clearTenant: async () => {
    await storage.deleteItem('tenant_id');
    await storage.deleteItem('tenant_name');
    set({ tenantId: null, tenantName: null });
  },

  loadTenant: async () => {
    try {
      const tenantId = await storage.getItem('tenant_id');
      const tenantName = await storage.getItem('tenant_name');
      
      if (tenantId && tenantName) {
        set({ tenantId, tenantName });
      }
    } catch (error) {
      console.error('Failed to load tenant:', error);
    }
  },
}));
