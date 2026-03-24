/**
 * page.tsx (상품 목록)
 * 상품 목록 페이지. 검색어·카테고리로 필터링하고 가격·인기순으로 정렬한다.
 * 서버 컴포넌트로 구현되어 SEO와 초기 로딩 성능에 유리하다.
 */
import { Suspense } from "react";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import { Product } from "@/types/product";
import Banner from "@/components/layout/Banner";

async function getProducts(q?: string, category?: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`,
    { cache: "no-store" },
  );
  return res.json();
}

interface Props {
  searchParams: Promise<{ sort?: string; q?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { sort = "latest", q, category } = await searchParams;

  let products = await getProducts(q, category);

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
  }

  return (
    <>
      {/* 배너 */}
      <div className="w-full">
        <Banner />
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12 w-full">
        {/* 타이틀 + 상품 수 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {q ? `"${q}" 검색 결과` : "상품 목록"}
            <span className="ml-2 text-base font-normal text-gray-400">
              {products.length}개
            </span>
          </h1>
        </div>

        {/* 카테고리 + 정렬 필터 */}
        <Suspense>
          <ProductFilters />
        </Suspense>

        {/* 상품 그리드 */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-sm">상품이 없습니다.</p>
          </div>
        )}
      </div>
    </>
  );
}
