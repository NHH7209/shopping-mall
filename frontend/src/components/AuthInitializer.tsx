'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// 페이지 리로드 시 HttpOnly 쿠키의 refresh token으로 세션 복원
export default function AuthInitializer() {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .then(({ data }) => setAuth(data.user, data.accessToken))
      .catch(() => {
        // 로그인 상태 아님 — 무시
      });
  }, [setAuth]);

  return null;
}
