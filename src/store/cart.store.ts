import { create } from 'zustand';
import { storageService } from '@services/storage';
import { apiService } from '@services/api';
import { toast } from '@services/toast';

export interface CartItem {
  variant_id: string;
  product_id: string;
  product_name: string;
  brand?: string;
  unit?: string;
  price: number;
  quantity: number;
  image_url?: string;
  max_quantity: number; // Stock limit
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  removeItem: (variant_id: string) => Promise<void>;
  updateQuantity: (variant_id: string, quantity: number) => Promise<void>;
  clearCart: (localOnly?: boolean) => Promise<void>;
  loadCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => {
  // Initialize from localStorage
  const savedCart = storageService.getCart();

  const saveToStorage = (items: CartItem[]) => {
    storageService.setCart(items);
  };

  return {
    items: savedCart || [],

    addItem: async (item, quantity = 1) => {
      const items = get().items;
      const existingItem = items.find((i) => i.variant_id === item.variant_id);

      let newItems: CartItem[];
      if (existingItem) {
        // Update quantity
        const newQty = Math.min(existingItem.quantity + quantity, item.max_quantity);
        newItems = items.map((i) =>
          i.variant_id === item.variant_id ? { ...i, quantity: newQty } : i
        );
      } else {
        // Add new item
        newItems = [...items, { ...item, quantity: Math.min(quantity, item.max_quantity) }];
      }
      
      // Update UI immediately (optimistic update)
      saveToStorage(newItems);
      set({ items: newItems });
      
      // Call API in background
      try {
        await apiService.addToCart(item.variant_id, quantity);
      } catch (error) {
        console.error('Failed to sync cart with server:', error);
        toast.error('Failed to sync with server');
      }
    },

    removeItem: async (variant_id) => {
      const newItems = get().items.filter((i) => i.variant_id !== variant_id);
      
      // Update UI immediately
      saveToStorage(newItems);
      set({ items: newItems });
      
      // Call API in background
      try {
        await apiService.removeFromCart(variant_id);
      } catch (error) {
        console.error('Failed to sync remove with server:', error);
        toast.error('Failed to sync with server');
      }
    },

    updateQuantity: async (variant_id, quantity) => {
      const items = get().items;
      const item = items.find((i) => i.variant_id === variant_id);
      
      if (!item) return;

      if (quantity <= 0) {
        await get().removeItem(variant_id);
        return;
      }

      const newQty = Math.min(quantity, item.max_quantity);
      const newItems = items.map((i) =>
        i.variant_id === variant_id ? { ...i, quantity: newQty } : i
      );
      
      // Update UI immediately
      saveToStorage(newItems);
      set({ items: newItems });

      // Call API in background
      try {
        await apiService.updateCartItem(variant_id, quantity);
      } catch (error) {
        console.error('Failed to sync update with server:', error);
        toast.error('Failed to sync with server');
      }
    },

    clearCart: async (localOnly = false) => {
      // If localOnly mode (e.g., during logout), skip API call
      if (localOnly) {
        storageService.removeCart();
        set({ items: [] });
        return;
      }
      
      try {
        await apiService.clearCart();
        storageService.removeCart();
        set({ items: [] });
      } catch (error) {
        console.error('Failed to clear cart:', error);
        toast.error('Failed to clear cart');
        // Still clear locally
        storageService.removeCart();
        set({ items: [] });
      }
    },

    loadCart: async () => {
      try {
        const response = await apiService.getCart();
        console.log('Cart API Response:', response);
        
        if (response.success && response.data && response.data.items && response.data.items.length > 0) {
          // Transform API data to CartItem format
          const cartItems: CartItem[] = response.data.items.map((item: any) => ({
            variant_id: item.variant_id.toString(),
            product_id: item.product_id?.toString() || '',
            product_name: item.product_name || '',
            brand: item.brand || '',
            unit: item.size || item.packaging || '',
            price: Number(item.selling_price_snapshot || item.price || 0),
            quantity: item.quantity || 1,
            image_url: item.variant_image_url || item.product_image_url || '',
            max_quantity: item.stock_quantity || 999,
          }));
          console.log('Transformed cart items:', cartItems);
          saveToStorage(cartItems);
          set({ items: cartItems });
        } else {
          // Cart is empty on server, clear local data
          storageService.removeCart();
          set({ items: [] });
        }
      } catch (error) {
        console.error('Failed to load cart from API:', error);
        // Keep local storage data on error
      }
    },

    getTotal: () => {
      return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    getItemCount: () => {
      return get().items.reduce((count, item) => count + item.quantity, 0);
    },
  };
});
