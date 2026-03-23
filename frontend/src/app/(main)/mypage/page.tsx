'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

const menuItems = [
  { href: '/mypage/orders', label: '주문 내역', desc: '주문 현황을 확인하세요', icon: '📦' },
  { href: '/mypage/profile', label: '프로필 수정', desc: '이름, 비밀번호를 변경하세요', icon: '👤' },
  { href: '/mypage/address', label: '배송지 관리', desc: '배송지를 추가/수정하세요', icon: '📍' },
];

export default function MypagePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      {/* 유저 정보 */}
      <div className="bg-gray-50 rounded-xl px-6 py-5 mb-6">
        <p className="text-lg font-bold text-gray-900">{user?.name}</p>
        <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
      </div>

      {/* 메뉴 카드 */}
      <div className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:shadow-sm transition-shadow"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <span className="ml-auto text-gray-300">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
