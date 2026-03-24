/**
 * AuthInitializer.tsx
 * 앱 최초 로드 시 Refresh Token 쿠키로 세션을 자동 복원하는 컴포넌트.
 * 루트 layout.tsx에 배치되어 페이지 새로고침 후에도 로그인 상태를 유지한다.
 */
'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

// 페이지 리로드 시 HttpOnly 쿠키의 refresh token으로 세션 복원
export default function AuthInitializer() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .then(({ data }) => {
        setAuth(data.user, data.accessToken);
        fetchCart(); // 세션 복원 시 장바구니도 같이 불러오기
      })
      .catch(() => {
        // 로그인 상태 아님 — 무시
      });
  }, [setAuth, fetchCart]);

  return null;
}
