/**
 * useAuth.ts
 * 인증 커스텀 훅. 로그인·회원가입·로그아웃 액션과 현재 사용자 정보를 제공한다.
 * 로그인 성공 시 장바구니도 함께 서버에서 불러온다.
 */
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { User } from '@/types/user';

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, setAuth, logout: clearAuth } = useAuthStore();
  const fetchCart = useCartStore((s) => s.fetchCart);

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { email, password });
    setAuth(data.user, data.accessToken);
    await fetchCart();
    return data.user;
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    setAuth(data.user, data.accessToken);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
      router.push('/');
    }
  };

  return { user, accessToken, isLoggedIn: !!user, login, signup, logout };
}
