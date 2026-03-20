import { Suspense } from "react";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import { Product } from "@/types/product";
import Banner from "@/components/layout/Banner";

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  });
  return res.json();
}

interface Props {
  searchParams: Promise<{ sort?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { sort = "latest" } = await searchParams;

  let products = await getProducts();

  // 정렬
  switch (sort) {
    case "price_asc":
      products = [...products].sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      products = [...products].sort((a, b) => b.price - a.price);
      break;
    case "popular":
      products = [...products].sort((a, b) => b.salesCount - a.salesCount);
      break;
    // latest: 기본값 — API가 이미 최신순으로 내려줌
  }

  return (
    <>
      {/* 배너 — 전체 너비 */}
      <div className="w-full min-w-[1024px]">
        <Banner />
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* 타이틀 + 상품 수 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            상품 목록
            <span className="ml-2 text-base font-normal text-gray-400">
              {products.length}개
            </span>
          </h1>
        </div>

        {/* 검색/정렬 필터 — useSearchParams 사용으로 Suspense 필요 */}
        <Suspense>
          <ProductFilters />
        </Suspense>

        {/* 상품 그리드 */}
        {products.length > 0 ? (
          <div className="grid grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-sm">등록된 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </>
  );
}
