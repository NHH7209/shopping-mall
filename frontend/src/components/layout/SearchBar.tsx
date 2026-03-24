/**
 * SearchBar.tsx
 * 헤더 검색바 컴포넌트. 입력값으로 /products?q=검색어 URL을 생성해
 * 상품 목록 페이지로 이동한다. Enter 키와 검색 버튼 모두 지원한다.
 */
"use client";

// 검색바 — useRouter가 필요해서 클라이언트 컴포넌트로 분리
// Header는 서버 컴포넌트로 유지하고 이 부분만 클라이언트로 분리
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSearch() {
    const q = value.trim();
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/products");
    }
  }

  return (
    <div className="w-40 sm:w-64 md:w-80 lg:w-96 relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="상품을 검색해보세요"
        className="w-full px-4 py-2 pr-10 border-2 border-blue-300 rounded-full text-sm outline-none focus:border-blue-600 transition-colors"
      />
      {/* pointer-events-none으로 SVG가 클릭 이벤트를 가로채지 않게 함 */}
      {/* cursor-pointer는 button에만 설정 — SVG 위에서도 항상 손 모양 유지 */}
      <button
        onClick={handleSearch}
        className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-blue-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </button>
    </div>
  );
}
