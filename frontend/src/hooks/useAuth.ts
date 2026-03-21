import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, setAuth, logout: clearAuth } = useAuthStore();

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAuth(data.user, data.accessToken);
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
