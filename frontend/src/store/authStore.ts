import { create } from 'zustand';
import { User } from '@/types/user';
import { useCartStore } from './cartStore';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

// 미들웨어가 읽을 수 있도록 프론트엔드 도메인에 쿠키 설정
function setAuthCookie(role: string) {
  document.cookie = 'is_authenticated=1; path=/; max-age=604800; SameSite=Lax';
  document.cookie = `user_role=${role}; path=/; max-age=604800; SameSite=Lax`;
}

function clearAuthCookie() {
  document.cookie = 'is_authenticated=; path=/; max-age=0';
  document.cookie = 'user_role=; path=/; max-age=0';
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => {
    setAuthCookie(user.role);
    set({ user, accessToken });
  },
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => {
    clearAuthCookie();
    useCartStore.getState().clearCart();
    set({ user: null, accessToken: null });
  },
}));
