import Link from 'next/link';

const navItems = [
  { href: '/mypage', label: '마이페이지 홈' },
  { href: '/mypage/profile', label: '프로필 수정' },
  { href: '/mypage/orders', label: '주문 내역' },
  { href: '/mypage/address', label: '배송지 관리' },
];

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">마이페이지</h1>
      <div className="flex gap-8">
        {/* 사이드 메뉴 */}
        <aside className="w-44 flex-shrink-0">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* 콘텐츠 영역 */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
