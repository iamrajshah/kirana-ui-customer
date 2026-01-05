import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@store/auth.store';

// Configure your backend base URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Configure your tenant ID here (each shop has unique tenant)
const TENANT_ID = import.meta.env.VITE_TENANT_ID || '1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': TENANT_ID,
      },
    });

    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth APIs
  async login(phone: string, otp: string) {
    const response = await this.api.post('/customer-auth/login', { phone, otp });
    return response.data;
  }

  async register(data: { name: string; phone: string; email?: string }) {
    const response = await this.api.post('/customer-auth/register', data);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/customer-auth/me');
    return response.data;
  }

  // Catalog APIs
  async getCategories() {
    const response = await this.api.get('/catalog/categories');
    return response.data;
  }

  async getProducts(params?: { category_id?: string; search?: string; skip?: number; take?: number }) {
    const response = await this.api.get('/catalog/products', { params });
    return response.data;
  }

  async getProductById(id: string) {
    const response = await this.api.get(`/catalog/products/${id}`);
    return response.data;
  }

  async searchProducts(query: string) {
    const response = await this.api.get('/catalog/search', { params: { q: query } });
    return response.data;
  }

  // Cart APIs (if backend supports)
  async getCart() {
    const response = await this.api.get('/cart');
    return response.data;
  }

  async addToCart(variantId: string, quantity: number) {
    const response = await this.api.post('/cart/add', { variant_id: variantId, quantity });
    return response.data;
  }

  async updateCartItem(variantId: string, quantity: number) {
    const response = await this.api.put('/cart/update', { variant_id: variantId, quantity });
    return response.data;
  }

  async removeFromCart(variantId: string) {
    const response = await this.api.delete(`/cart/${variantId}`);
    return response.data;
  }

  async clearCart() {
    const response = await this.api.delete('/cart/clear');
    return response.data;
  }

  // Order APIs
  async createOrder(items: Array<{ variant_id: string; quantity: number; price: number }>) {
    const response = await this.api.post('/orders', { items });
    return response.data;
  }

  async getOrders() {
    const response = await this.api.get('/orders');
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  async getOrderStatus(id: string) {
    const response = await this.api.get(`/orders/${id}/status`);
    return response.data;
  }

  async cancelOrder(id: string) {
    const response = await this.api.post(`/orders/${id}/cancel`);
    return response.data;
  }

  // Payment APIs
  async initiatePayment(orderId: string, method: string) {
    const response = await this.api.post('/payments/initiate', { order_id: orderId, method });
    return response.data;
  }

  async confirmPayment(orderId: string) {
    const response = await this.api.post('/payments/confirm', { order_id: orderId });
    return response.data;
  }
}

export const apiService = new ApiService();
