"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = ["스킨케어", "클렌징", "선케어", "메이크업", "마스크팩", "에센스/세럼", "헤어케어", "바디케어"];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "latest";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  }

  function handleCategory(category: string) {
    updateParam("category", currentCategory === category ? null : category);
  }

  return (
    <div className="mb-8">
      {/* 카테고리 버튼 */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <button
          onClick={() => updateParam("category", null)}
          className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
            !currentCategory
              ? "bg-gray-900 text-white border-gray-900"
              : "border-gray-300 text-gray-600 hover:border-gray-500"
          }`}
        >
          전체
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              currentCategory === cat
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-300 text-gray-600 hover:border-gray-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 정렬 */}
      <div className="flex justify-end">
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="text-sm border-2 border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-gray-400 transition-colors bg-white"
        >
          <option value="latest">최신순</option>
          <option value="price_asc">낮은 가격순</option>
          <option value="price_desc">높은 가격순</option>
          <option value="popular">인기순</option>
        </select>
      </div>
    </div>
  );
}
