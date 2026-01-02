import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/api/order.api';

export const useOrders = (params?: { skip?: number; take?: number }) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrders(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for status updates
  });
};

export const useOrderStatus = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId, 'status'],
    queryFn: () => orderApi.getOrderStatus(orderId),
    enabled: !!orderId,
    refetchInterval: 15 * 1000, // Refetch every 15 seconds
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
  });
};
