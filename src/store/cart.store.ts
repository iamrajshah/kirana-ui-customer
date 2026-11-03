import { create } from "zustand";
import { storageService } from "@services/storage";

export interface CartItem {
  variant_id: string;
  product_id: string;
  product_name: string;
  brand?: string;
  unit?: string;
  price: number;
  quantity: number;
  image_url?: string;
  max_quantity?: number; // Present only when the shop publicly shares exact stock.
}

interface CartState {
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, "quantity">,
    quantity?: number,
  ) => Promise<void>;
  removeItem: (variant_id: string) => Promise<void>;
  updateQuantity: (variant_id: string, quantity: number) => Promise<void>;
  clearCart: (localOnly?: boolean) => Promise<void>;
  loadCart: () => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => {
  // Initialize from localStorage
  const savedCart = storageService.getCart<CartItem[]>();

  const saveToStorage = (items: CartItem[]) => {
    storageService.setCart(items);
  };

  const capToKnownStock = (quantity: number, maximum?: number) =>
    typeof maximum === "number" ? Math.min(quantity, maximum) : quantity;

  return {
    items: savedCart || [],

    addItem: async (item, quantity = 1) => {
      const items = get().items;
      const existingItem = items.find((i) => i.variant_id === item.variant_id);

      let newItems: CartItem[];
      if (existingItem) {
        // Update quantity
        const newQty = capToKnownStock(
          existingItem.quantity + quantity,
          item.max_quantity,
        );
        newItems = items.map((i) =>
          i.variant_id === item.variant_id ? { ...i, quantity: newQty } : i,
        );
      } else {
        // Add new item
        newItems = [
          ...items,
          { ...item, quantity: capToKnownStock(quantity, item.max_quantity) },
        ];
      }

      // Update UI immediately (optimistic update)
      saveToStorage(newItems);
      set({ items: newItems });
    },

    removeItem: async (variant_id) => {
      const newItems = get().items.filter((i) => i.variant_id !== variant_id);

      // Update UI immediately
      saveToStorage(newItems);
      set({ items: newItems });
    },

    updateQuantity: async (variant_id, quantity) => {
      const items = get().items;
      const item = items.find((i) => i.variant_id === variant_id);

      if (!item) return;

      if (quantity <= 0) {
        await get().removeItem(variant_id);
        return;
      }

      const newQty = capToKnownStock(quantity, item.max_quantity);
      const newItems = items.map((i) =>
        i.variant_id === variant_id ? { ...i, quantity: newQty } : i,
      );

      // Update UI immediately
      saveToStorage(newItems);
      set({ items: newItems });
    },

    clearCart: async (localOnly = false) => {
      // If localOnly mode (e.g., during logout), skip API call
      if (localOnly) {
        storageService.removeCart();
        set({ items: [] });
        return;
      }

      storageService.removeCart();
      set({ items: [] });
    },

    loadCart: async () => {
      set({ items: storageService.getCart<CartItem[]>() || [] });
    },

    getTotal: () => {
      return get().items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },

    getItemCount: () => {
      return get().items.reduce((count, item) => count + item.quantity, 0);
    },
  };
});
