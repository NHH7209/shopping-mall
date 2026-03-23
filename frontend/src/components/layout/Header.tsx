'use client';

import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore, selectCartCount } from "@/store/cartStore";

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const cartCount = useCartStore(selectCartCount);

  return (
    <header className="min-w-[1024px] w-full h-24 bg-white fixed top-0 z-50 flex items-center border-b border-gray-200">
      <div className="w-full max-w-[1200px] mx-auto px-8 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/">
          <Image src="/logo.png" alt="로고" width={150} height={50} />
        </Link>

        {/* 검색바 — 클라이언트 컴포넌트로 분리 (useRouter 사용) */}
        <SearchBar />

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-700">{user.name}님</span>
              <Link
                href="/mypage"
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                마이페이지
              </Link>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                회원가입
              </Link>
            </>
          )}

          {/* 장바구니 */}
          <Link
            href="/cart"
            className="relative text-sm text-gray-500 hover:text-blue-600"
          >
            장바구니
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-sky-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/order"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            주문 배송
          </Link>

          <Link
            href="/customer-service"
            className="text-sm text-gray-700 hover:text-gray-800"
          >
            고객센터
          </Link>
        </div>
      </div>
    </header>
  );
}
