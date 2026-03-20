"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort) params.set("sort", sort);
    else params.delete("sort");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex justify-end mb-8">
      <select
        value={searchParams.get("sort") || "latest"}
        onChange={(e) => updateSort(e.target.value)}
        className="text-sm border-2 border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-gray-400 transition-colors bg-white"
      >
        <option value="latest">최신순</option>
        <option value="price_asc">낮은 가격순</option>
        <option value="price_desc">높은 가격순</option>
        <option value="popular">인기순</option>
      </select>
    </div>
  );
}
