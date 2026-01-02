import { axiosInstance } from './client';
import type {
  OrderResponse,
  OrderListResponse,
  OrderStatusResponse,
} from '@/types/order';

export const orderApi = {
  /**
   * Create order (handled via cart checkout)
   */
  createOrder: async (): Promise<OrderResponse> => {
    const response = await axiosInstance.post<OrderResponse>('/orders');
    return response.data;
  },

  /**
   * Get customer's orders
   */
  getOrders: async (params?: {
    skip?: number;
    take?: number;
  }): Promise<OrderListResponse> => {
    const response = await axiosInstance.get<OrderListResponse>('/orders', {
      params,
    });
    return response.data;
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id: string): Promise<OrderResponse> => {
    const response = await axiosInstance.get<OrderResponse>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Cancel order
   */
  cancelOrder: async (id: string): Promise<OrderResponse> => {
    const response = await axiosInstance.post<OrderResponse>(
      `/orders/${id}/cancel`
    );
    return response.data;
  },

  /**
   * Get order status
   */
  getOrderStatus: async (id: string): Promise<OrderStatusResponse> => {
    const response = await axiosInstance.get<OrderStatusResponse>(
      `/orders/${id}/status`
    );
    return response.data;
  },
};
