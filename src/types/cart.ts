export interface CartItem {
  id: string;
  variant_id: string;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  selling_price_snapshot: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_amount: number;
  total_items: number;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
  message?: string;
}

export interface AddToCartRequest {
  variant_id: string;
  quantity: number;
}

export interface UpdateCartRequest {
  item_id: string;
  quantity: number;
}
