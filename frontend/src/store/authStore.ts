import { create } from 'zustand';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

// 미들웨어가 읽을 수 있도록 프론트엔드 도메인에 쿠키 설정
function setAuthCookie() {
  document.cookie = 'is_authenticated=1; path=/; max-age=604800; SameSite=Lax';
}

function clearAuthCookie() {
  document.cookie = 'is_authenticated=; path=/; max-age=0';
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => {
    setAuthCookie();
    set({ user, accessToken });
  },
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => {
    clearAuthCookie();
    set({ user: null, accessToken: null });
  },
}));
