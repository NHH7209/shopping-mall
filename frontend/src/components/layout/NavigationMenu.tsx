"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { label: "스킨케어", href: "/categories/skincare" },
  { label: "클렌징", href: "/categories/cleansing" },
  { label: "선케어", href: "/categories/suncare" },
  { label: "마스크팩", href: "/categories/mask" },
  { label: "세럼/에센스", href: "/categories/serum" },
  { label: "립/아이", href: "/categories/lip-eye" },
];

const menus = [
  { label: "신상품", href: "/products?sort=latest" },
  { label: "베스트", href: "/products?sort=popular" },
  { label: "특가/세일", href: "/sale" },
  { label: "기획전", href: "/exhibition" },
  { label: "브랜드", href: "/brands" },
  { label: "이벤트", href: "/event" },
];

export default function NavigationMenu() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="min-w-[1024px] w-full h-14 border-b border-gray-200 bg-white fixed top-24 z-40 flex items-center">
      <div className="w-full max-w-[1200px] mx-auto px-8 flex items-center h-11">
        {/* 카테고리 드롭다운 */}
        <div
          className="relative pr-12"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors pr-8">
            {/* 햄버거 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            카테고리
          </button>

          {open && (
            // 바깥 div: top-full에 바로 붙어서 hover 영역 끊김 방지
            // pt-2로 시각적 간격만 줌 — mt-2 쓰면 그 gap에서 mouseLeave 발생
            <div className="absolute top-full -left-4 pt-2 z-50">
              <div className="bg-white border border-gray-200 rounded-md shadow-md w-36">
                {categories.map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 나머지 메뉴 */}
        <div className="flex items-center gap-6">
          {menus.map((menu) => (
            <Link
              key={menu.label}
              href={menu.href}
              className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all hover:after:w-full"
            >
              {menu.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
