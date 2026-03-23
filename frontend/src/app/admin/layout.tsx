'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/products', label: '상품 관리', icon: '📦' },
  { href: '/admin/orders', label: '주문 관리', icon: '📋' },
  { href: '/admin/users', label: '회원 관리', icon: '👥' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 세션 복원 대기 (AuthInitializer가 /auth/refresh 호출하는 시간)
    const timer = setTimeout(() => {
      if (!user || (user as any).role !== 'admin') {
        router.replace('/');
      } else {
        setChecking(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [user, router]);

  if (checking) return null;

  return (
    <div className="flex">
      {/* 사이드바 — 어드민은 Header/Nav 없으므로 top-0 부터 시작 */}
      <aside className="w-56 fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Admin</p>
          <h2 className="text-base font-bold text-gray-900 mt-0.5">관리자 패널</h2>
        </div>
        <nav className="flex-1 px-3 py-3 flex flex-col gap-1">
          {navItems.map((item) => {
            // 대시보드는 정확히 '/admin'일 때만 활성화
            // 나머지는 해당 경로로 시작하면 활성화 (하위 페이지 포함)
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 메인 콘텐츠 — 사이드바 너비(w-56)만큼 왼쪽 여백, 상단 여백도 추가 */}
      <div className="ml-56 flex-1 p-8 min-h-screen bg-gray-50">
        {children}
      </div>
    </div>
  );
}
