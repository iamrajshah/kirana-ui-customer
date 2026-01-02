export type OrderStatus = 
  | 'PLACED' 
  | 'CONFIRMED' 
  | 'READY' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number?: string;
  status: OrderStatus;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrderListResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      total: number;
      skip: number;
      take: number;
    };
  };
}

export interface OrderStatusResponse {
  success: boolean;
  data: {
    order_id: string;
    status: OrderStatus;
    created_at: string;
    updated_at: string;
  };
}
