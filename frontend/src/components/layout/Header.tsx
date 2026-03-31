/**
 * Header.tsx
 * 전역 헤더 컴포넌트. 로고, 검색바, 로그인/마이페이지/로그아웃 메뉴,
 * 장바구니 아이콘(수량 뱃지 포함), 주문배송·고객센터 링크를 제공한다.
 * 모바일: 로고 + 장바구니 아이콘 + 햄버거 메뉴
 * 데스크톱: 로고 + 검색바 + 전체 메뉴
 */
'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SearchBar from "./SearchBar";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore, selectCartCount } from "@/store/cartStore";

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const cartCount = useCartStore(selectCartCount);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="w-full bg-white fixed top-0 z-[60] border-b border-gray-200 h-14 md:h-24">

      {/* 데스크톱 헤더 */}
      <div className="hidden md:flex h-full items-center w-full max-w-[1200px] mx-auto px-8 justify-between gap-6">
        <div className="flex items-center gap-8 flex-shrink-0">
          <Link href="/">
            <Image src="/logo.png" alt="로고" width={150} height={50} />
          </Link>
          <div className="w-80 lg:w-96">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 whitespace-nowrap">
          {user ? (
            <>
              <span className="text-sm text-gray-700">{user.name}님</span>
              <Link href="/mypage" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                마이페이지
              </Link>
              <button onClick={logout} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                로그인
              </Link>
              <Link href="/auth/signup" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                회원가입
              </Link>
            </>
          )}
          <Link href="/cart" prefetch={false} className="relative text-sm text-gray-500 hover:text-blue-600">
            장바구니
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-sky-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          <Link href="/order" prefetch={false} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            주문 배송
          </Link>
          <Link href="/support" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            고객센터
          </Link>
        </div>
      </div>

      {/* 모바일 헤더 */}
      <div className="flex md:hidden h-full items-center px-4 gap-2">
        <Link href="/" onClick={closeMenu} className="flex-shrink-0">
          <Image src="/logo.png" alt="로고" width={80} height={27} />
        </Link>

        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* 장바구니 아이콘 */}
          <Link href="/cart" prefetch={false} className="relative p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-sky-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* 햄버거 버튼 */}
          <button onClick={() => setMenuOpen((v) => !v)} className="p-2" aria-label="메뉴">
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-800 py-1">{user.name}님</span>
                <Link href="/mypage" className="text-sm text-gray-600 py-2 hover:text-blue-600" onClick={closeMenu}>
                  마이페이지
                </Link>
                <button onClick={() => { logout(); closeMenu(); }} className="text-sm text-gray-600 py-2 text-left hover:text-blue-600">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-600 py-2 hover:text-blue-600" onClick={closeMenu}>
                  로그인
                </Link>
                <Link href="/auth/signup" className="text-sm text-gray-600 py-2 hover:text-blue-600" onClick={closeMenu}>
                  회원가입
                </Link>
              </>
            )}
            <Link href="/order" prefetch={false} className="text-sm text-gray-600 py-2 hover:text-blue-600" onClick={closeMenu}>
              주문 배송
            </Link>
            <Link href="/support" className="text-sm text-gray-600 py-2 hover:text-blue-600" onClick={closeMenu}>
              고객센터
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
