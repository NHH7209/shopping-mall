/**
 * authStore.ts
 * Zustand 인증 전역 상태. 사용자 정보와 Access Token을 메모리에 저장하고,
 * 로그인/로그아웃 시 미들웨어가 읽을 수 있도록 브라우저 쿠키도 함께 동기화한다.
 */
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
