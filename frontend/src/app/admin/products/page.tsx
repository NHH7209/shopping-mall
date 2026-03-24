/**
 * page.tsx (관리자 상품 목록)
 * 관리자 상품 목록 페이지. 비활성 상품 포함 전체 상품을 테이블로 표시하며
 * 수정 페이지 이동 및 상품 삭제 기능을 제공한다.
 */
'use client';

// 삭제 버튼 등 인터랙션이 필요해서 클라이언트 컴포넌트로 작성
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 상품 목록 불러오기 — 함수로 분리해서 삭제 후 재호출 가능하게
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/admin`,
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      // 에러 메시지를 화면에 표시해서 원인을 알 수 있게
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      // try/catch 어디서 끝나든 반드시 로딩 해제
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    // confirm(): 브라우저 기본 확인 다이얼로그
    if (!confirm(`"${name}" 상품을 삭제하시겠습니까?`)) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
      method: 'DELETE',
    });

    // 삭제 후 목록 새로고침
    fetchProducts();
  };

  if (loading) return <p className="text-gray-400 text-sm">로딩 중...</p>;
  if (error) return <p className="text-red-500 text-sm">오류: {error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
        <Link
          href="/admin/products/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          + 상품 등록
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-50 border-b border-blue-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">재고</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">판매수</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
              >
                {/* 썸네일 + 상품명 */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.price.toLocaleString()}원
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.viewCount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.salesCount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {product.isActive ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="text-xs px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 text-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            등록된 상품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
