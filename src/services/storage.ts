const STORAGE_KEYS = {
  AUTH_TOKEN: "kirana_auth_token",
  USER_DATA: "kirana_user_data",
  TENANT_DATA: "kirana_tenant_data",
  STOREFRONT: "kirana_storefront",
  CART: "kirana_cart",
  LANGUAGE: "kirana_language",
};

interface StoredCart<T = unknown> {
  tenantId: string;
  items: T;
}

class StorageService {
  private readJson<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }
  // Auth
  setAuthToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  removeAuthToken() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // User Data
  setUserData(data: any) {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
  }

  getUserData(): any | null {
    return this.readJson(STORAGE_KEYS.USER_DATA);
  }

  removeUserData() {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Tenant Data
  setTenantData(data: any) {
    localStorage.setItem(STORAGE_KEYS.TENANT_DATA, JSON.stringify(data));
  }

  getTenantData(): any | null {
    return this.readJson(STORAGE_KEYS.TENANT_DATA);
  }

  removeTenantData() {
    localStorage.removeItem(STORAGE_KEYS.TENANT_DATA);
  }

  setStorefront(data: StorefrontSelection) {
    localStorage.setItem(STORAGE_KEYS.STOREFRONT, JSON.stringify(data));
  }

  getStorefront(): StorefrontSelection | null {
    return this.readJson<StorefrontSelection>(STORAGE_KEYS.STOREFRONT);
  }

  removeStorefront() {
    localStorage.removeItem(STORAGE_KEYS.STOREFRONT);
  }

  // Cart
  setCart<T>(cart: T) {
    const tenantId = this.getStorefront()?.tenantId;
    if (!tenantId) {
      this.removeCart();
      return;
    }
    localStorage.setItem(
      STORAGE_KEYS.CART,
      JSON.stringify({ tenantId, items: cart }),
    );
  }

  getCart<T>(): T | null {
    const stored = this.readJson<StoredCart<T>>(STORAGE_KEYS.CART);
    const activeTenantId = this.getStorefront()?.tenantId;
    if (!stored || !activeTenantId || stored.tenantId !== activeTenantId) {
      this.removeCart();
      return null;
    }
    return stored.items;
  }

  removeCart() {
    localStorage.removeItem(STORAGE_KEYS.CART);
  }

  // Language
  setLanguage(lang: string) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  getLanguage(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  }

  // Clear all
  clearAll() {
    localStorage.clear();
  }
}

export interface StorefrontSelection {
  tenantId: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  brandColor: string;
  phone: string | null;
}

export const storageService = new StorageService();
