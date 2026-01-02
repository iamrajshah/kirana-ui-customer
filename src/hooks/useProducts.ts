import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/api/product.api';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productApi.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProducts = (params?: {
  category_id?: string;
  search?: string;
  skip?: number;
  take?: number;
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getProducts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProductSearch = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productApi.searchProducts(query),
    enabled: query.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
  });
};
