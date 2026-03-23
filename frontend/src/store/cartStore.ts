import { create } from 'zustand';
import api from '@/lib/api';
import { CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  // 서버에서 장바구니 불러오기
  fetchCart: () => Promise<void>;
  // 상품 담기
  addItem: (productId: string, quantity: number) => Promise<void>;
  // 수량 변경
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  // 아이템 삭제
  removeItem: (itemId: number) => Promise<void>;
  // 로컬 상태 초기화 (로그아웃 시)
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  fetchCart: async () => {
    const { data } = await api.get('/cart');
    set({ items: data.items ?? [] });
  },

  addItem: async (productId, quantity) => {
    const { data } = await api.post('/cart/items', { productId, quantity });
    set({ items: data.items ?? [] });
  },

  updateQuantity: async (itemId, quantity) => {
    const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
    set({ items: data.items ?? [] });
  },

  removeItem: async (itemId) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    set({ items: data.items ?? [] });
  },

  clearCart: () => set({ items: [] }),
}));

// 파생 값: 총 아이템 수 (헤더 배지 등에 사용)
export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
