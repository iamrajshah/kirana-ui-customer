const STORAGE_KEYS = {
  AUTH_TOKEN: 'kirana_auth_token',
  USER_DATA: 'kirana_user_data',
  TENANT_DATA: 'kirana_tenant_data',
  CART: 'kirana_cart',
  LANGUAGE: 'kirana_language',
};

class StorageService {
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
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  removeUserData() {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Tenant Data
  setTenantData(data: any) {
    localStorage.setItem(STORAGE_KEYS.TENANT_DATA, JSON.stringify(data));
  }

  getTenantData(): any | null {
    const data = localStorage.getItem(STORAGE_KEYS.TENANT_DATA);
    return data ? JSON.parse(data) : null;
  }

  removeTenantData() {
    localStorage.removeItem(STORAGE_KEYS.TENANT_DATA);
  }

  // Cart
  setCart(cart: any) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }

  getCart(): any | null {
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : null;
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

export const storageService = new StorageService();
