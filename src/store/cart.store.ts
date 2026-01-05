import { create } from 'zustand';
import { storageService } from '@services/storage';

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
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (variant_id: string) => void;
  updateQuantity: (variant_id: string, quantity: number) => void;
  clearCart: () => void;
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

    addItem: (item, quantity = 1) => {
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
      
      saveToStorage(newItems);
      set({ items: newItems });
    },

    removeItem: (variant_id) => {
      const newItems = get().items.filter((i) => i.variant_id !== variant_id);
      saveToStorage(newItems);
      set({ items: newItems });
    },

    updateQuantity: (variant_id, quantity) => {
      const items = get().items;
      const item = items.find((i) => i.variant_id === variant_id);
      
      if (!item) return;

      if (quantity <= 0) {
        get().removeItem(variant_id);
        return;
      }

      const newQty = Math.min(quantity, item.max_quantity);
      const newItems = items.map((i) =>
        i.variant_id === variant_id ? { ...i, quantity: newQty } : i
      );
      
      saveToStorage(newItems);
      set({ items: newItems });
    },

    clearCart: () => {
      storageService.removeCart();
      set({ items: [] });
    },

    getTotal: () => {
      return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    getItemCount: () => {
      return get().items.reduce((count, item) => count + item.quantity, 0);
    },
  };
});
