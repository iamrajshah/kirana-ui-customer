import { axiosInstance } from './client';
import type {
  CartResponse,
  AddToCartRequest,
  UpdateCartRequest,
} from '@/types/cart';

export const cartApi = {
  /**
   * Get customer's cart
   */
  getCart: async (): Promise<CartResponse> => {
    const response = await axiosInstance.get<CartResponse>('/cart');
    return response.data;
  },

  /**
   * Add item to cart
   */
  addItem: async (data: AddToCartRequest): Promise<CartResponse> => {
    const response = await axiosInstance.post<CartResponse>('/cart/add', data);
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  updateItem: async (data: UpdateCartRequest): Promise<CartResponse> => {
    const response = await axiosInstance.put<CartResponse>('/cart/update', data);
    return response.data;
  },

  /**
   * Remove item from cart
   */
  removeItem: async (itemId: string): Promise<CartResponse> => {
    const response = await axiosInstance.delete<CartResponse>(
      `/cart/remove/${itemId}`
    );
    return response.data;
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<CartResponse> => {
    const response = await axiosInstance.delete<CartResponse>('/cart/clear');
    return response.data;
  },

  /**
   * Checkout - create order from cart
   */
  checkout: async (): Promise<CartResponse> => {
    const response = await axiosInstance.post<CartResponse>('/cart/checkout');
    return response.data;
  },
};
