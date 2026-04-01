import { create } from 'zustand';
import { cart as cartApi } from '@/lib/api';
import { getAuthToken } from '@/lib/api';

export interface CartProduct {
  id: number | string;
  name: string;
  price: number;
  image: string;
  isAlcohol?: boolean;
  is_liquor?: boolean;
}

export interface CartItem {
  id?: number; // shopping_cart_item ID from API
  product: CartProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  syncFromAPI: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  addItem: (product) => {
    // Optimistic update
    set((state) => {
      const existing = state.items.find(i => String(i.product.id) === String(product.id));
      if (existing) {
        return { items: state.items.map(i => String(i.product.id) === String(product.id) ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });

    // Sync to API if logged in
    if (getAuthToken()) {
      cartApi.addItem(Number(product.id), 1).then(() => {
        get().syncFromAPI();
      }).catch(() => {});
    }
  },

  removeItem: (productId) => {
    const item = get().items.find(i => String(i.product.id) === String(productId));
    set((state) => ({
      items: state.items.filter(i => String(i.product.id) !== String(productId))
    }));

    if (getAuthToken() && item?.id) {
      cartApi.removeItem(item.id).catch(() => {});
    }
  },

  updateQuantity: (productId, quantity) => {
    const item = get().items.find(i => String(i.product.id) === String(productId));
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => ({
      items: state.items.map(i => String(i.product.id) === String(productId) ? { ...i, quantity } : i)
    }));

    if (getAuthToken() && item?.id) {
      cartApi.updateQuantity(item.id, quantity).catch(() => {});
    }
  },

  clearCart: () => {
    set({ items: [] });
    if (getAuthToken()) {
      cartApi.empty().catch(() => {});
    }
  },

  syncFromAPI: async () => {
    if (!getAuthToken()) return;
    set({ loading: true });
    try {
      const res = await cartApi.get();
      const apiItems = res.data?.attributes?.shopping_cart_items || [];
      const mapped: CartItem[] = apiItems.map((item: any) => ({
        id: item.id,
        product: {
          id: item.attributes?.product?.id || item.pid || item.item_id,
          name: item.attributes?.product?.attributes?.name || item.item_name || '',
          price: parseFloat(item.attributes?.price || item.gc_price || 0),
          image: item.attributes?.product?.attributes?.photo_url || `https://cdn.gardengrocer.com/images/products/${item.attributes?.product?.id || 0}.jpg`,
          isAlcohol: !!item.attributes?.product?.attributes?.is_liquor,
          is_liquor: !!item.attributes?.product?.attributes?.is_liquor,
        },
        quantity: item.attributes?.qty || item.qty || 1,
      }));
      set({ items: mapped, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
