import { create } from 'zustand';
import { MenuItem, MenuAddOn, OrderMode } from '../types/database';

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  selectedAddOns: MenuAddOn[];
  notes?: string;
  itemTotalCents: number;
}

interface CartState {
  shopId: string | null;
  items: CartItem[];
  mode: OrderMode;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  
  // Actions
  setShopId: (shopId: string) => void;
  addItem: (item: MenuItem, selectedAddOns?: MenuAddOn[], notes?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  setMode: (mode: OrderMode) => void;
  setTableNumber: (tableNumber: string) => void;
  setCustomerName: (customerName: string) => void;
  setCustomerPhone: (customerPhone: string) => void;
  
  // Getters
  getTotalCount: () => number;
  getTotalAmountCents: () => number;
}

const computeItemTotal = (item: MenuItem, addOns: MenuAddOn[], quantity: number) => {
  const addOnsSum = addOns.reduce((acc, ao) => acc + ao.price_cents, 0);
  return (item.price_cents + addOnsSum) * quantity;
};

export const useCartStore = create<CartState>((set, get) => ({
  shopId: null,
  items: [],
  mode: 'TOKEN',
  tableNumber: '',
  customerName: '',
  customerPhone: '',

  setShopId: (shopId) => {
    const current = get().shopId;
    if (current && current !== shopId) {
      // Clear cart if switching shops to prevent cross-shop mixing
      set({ shopId, items: [] });
    } else {
      set({ shopId });
    }
  },

  addItem: (item, selectedAddOns = [], notes = '') => {
    const addOnIds = selectedAddOns.map(a => a.id).sort().join(',');
    const cartItemId = `${item.id}-${addOnIds}-${notes.trim()}`;
    const items = get().items;
    const existingIndex = items.findIndex(i => i.cartItemId === cartItemId);

    if (existingIndex > -1) {
      const updated = [...items];
      const newQty = updated[existingIndex].quantity + 1;
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].itemTotalCents = computeItemTotal(item, selectedAddOns, newQty);
      set({ items: updated });
    } else {
      const newItem: CartItem = {
        cartItemId,
        item,
        quantity: 1,
        selectedAddOns,
        notes,
        itemTotalCents: computeItemTotal(item, selectedAddOns, 1),
      };
      set({ items: [...items, newItem] });
    }
  },

  removeItem: (cartItemId) => {
    set({ items: get().items.filter(i => i.cartItemId !== cartItemId) });
  },

  updateQuantity: (cartItemId, delta) => {
    const items = get().items;
    const existing = items.find(i => i.cartItemId === cartItemId);
    if (!existing) return;

    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      set({ items: items.filter(i => i.cartItemId !== cartItemId) });
    } else {
      set({
        items: items.map(i => {
          if (i.cartItemId === cartItemId) {
            return {
              ...i,
              quantity: newQty,
              itemTotalCents: computeItemTotal(i.item, i.selectedAddOns, newQty),
            };
          }
          return i;
        }),
      });
    }
  },

  clearCart: () => {
    set({ items: [], tableNumber: '', customerName: '', customerPhone: '' });
  },

  setMode: (mode) => set({ mode }),
  setTableNumber: (tableNumber) => set({ tableNumber }),
  setCustomerName: (customerName) => set({ customerName }),
  setCustomerPhone: (customerPhone) => set({ customerPhone }),

  getTotalCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalAmountCents: () => {
    return get().items.reduce((sum, item) => sum + item.itemTotalCents, 0);
  },
}));
