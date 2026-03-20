import { Product } from "@/types/product";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          홈
        </Link>
        <span>›</span>
        <Link href="/products" className="hover:text-blue-600 transition-colors">
          상품 목록
        </Link>
        <span>›</span>
        <span className="text-gray-600 truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* 이미지 갤러리 + 상품 정보 (클라이언트 컴포넌트) */}
      <ProductDetailClient product={product} />

      {/* 상품 상세 설명 섹션 */}
      <section className="mt-16 pt-10 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">상품 상세</h2>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </section>

      {/* 리뷰 섹션 */}
      <section className="mt-12 pt-10 border-t border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          리뷰{" "}
          <span className="text-gray-400 font-normal text-base">(0)</span>
        </h2>
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 mb-3 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
            />
          </svg>
          <p className="text-sm">아직 리뷰가 없습니다.</p>
        </div>
      </section>
    </div>
  );
}
