import { axiosInstance } from './client';
import type {
  ProductListResponse,
  CategoryListResponse,
  Product,
} from '@/types/product';

export const productApi = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<CategoryListResponse> => {
    const response = await axiosInstance.get<CategoryListResponse>(
      '/catalog/categories'
    );
    return response.data;
  },

  /**
   * Get products with optional filters
   */
  getProducts: async (params?: {
    category_id?: string;
    search?: string;
    skip?: number;
    take?: number;
  }): Promise<ProductListResponse> => {
    const response = await axiosInstance.get<ProductListResponse>(
      '/catalog/products',
      { params }
    );
    return response.data;
  },

  /**
   * Search products
   */
  searchProducts: async (query: string, params?: {
    skip?: number;
    take?: number;
  }): Promise<ProductListResponse> => {
    const response = await axiosInstance.get<ProductListResponse>(
      '/catalog/search',
      { params: { q: query, ...params } }
    );
    return response.data;
  },

  /**
   * Get product details by ID
   */
  getProductById: async (id: string): Promise<{ success: boolean; data: Product }> => {
    const response = await axiosInstance.get<{ success: boolean; data: Product }>(
      `/catalog/products/${id}`
    );
    return response.data;
  },
};
