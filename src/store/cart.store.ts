import { create } from 'zustand';
import type { Cart, CartItem } from '@/types/cart';

interface LocalCartState {
  items: Map<string, CartItem>;
  
  addItem: (variantId: string, productName: string, variantName: string | null, price: number, quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
  getItemCount: (variantId: string) => number;
}

export const useLocalCartStore = create<LocalCartState>((set, get) => ({
  items: new Map(),

  addItem: (variantId, productName, variantName, price, quantity) => {
    set((state) => {
      const newItems = new Map(state.items);
      const existingItem = Array.from(newItems.values()).find(
        (item) => item.variant_id === variantId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        newItems.set(existingItem.id, existingItem);
      } else {
        const newItem: CartItem = {
          id: Date.now().toString(),
          variant_id: variantId,
          product_name: productName,
          variant_name: variantName,
          quantity,
          selling_price_snapshot: price,
        };
        newItems.set(newItem.id, newItem);
      }

      return { items: newItems };
    });
  },

  updateQuantity: (itemId, quantity) => {
    set((state) => {
      const newItems = new Map(state.items);
      const item = newItems.get(itemId);
      
      if (item) {
        if (quantity <= 0) {
          newItems.delete(itemId);
        } else {
          item.quantity = quantity;
          newItems.set(itemId, item);
        }
      }

      return { items: newItems };
    });
  },

  removeItem: (itemId) => {
    set((state) => {
      const newItems = new Map(state.items);
      newItems.delete(itemId);
      return { items: newItems };
    });
  },

  clearCart: () => {
    set({ items: new Map() });
  },

  getTotalAmount: () => {
    const items = get().items;
    return Array.from(items.values()).reduce(
      (sum, item) => sum + item.selling_price_snapshot * item.quantity,
      0
    );
  },

  getTotalItems: () => {
    const items = get().items;
    return Array.from(items.values()).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  },

  getItemCount: (variantId) => {
    const items = get().items;
    const item = Array.from(items.values()).find(
      (item) => item.variant_id === variantId
    );
    return item?.quantity || 0;
  },
}));
