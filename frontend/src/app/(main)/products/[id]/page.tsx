/**
 * page.tsx (상품 상세)
 * 상품 상세 페이지. 서버에서 상품 데이터를 fetch하고(viewCount +1),
 * 이미지·장바구니 담기는 클라이언트 컴포넌트(ProductDetailClient)로 분리된다.
 */
import { Product } from "@/types/product";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ReviewSection from "@/components/product/ReviewSection";
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

      <ReviewSection productId={id} />
    </div>
  );
}
