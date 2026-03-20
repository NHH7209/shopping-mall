import Link from 'next/link';
import { Product } from '@/types/product';

// 서버 컴포넌트에서 직접 API 호출 — 어드민용 전체 상품 목록
async function getAdminProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/admin`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function AdminDashboardPage() {
  const products = await getAdminProducts();

  // 간단한 통계 계산
  const total = products.length;
  const active = products.filter((p) => p.isActive).length;
  const inactive = total - active;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-5 mb-10">
        <StatCard label="전체 상품" value={total} bg="bg-blue-50" color="text-blue-700" />
        <StatCard label="활성 상품" value={active} bg="bg-green-50" color="text-green-700" />
        <StatCard label="비활성 상품" value={inactive} bg="bg-red-50" color="text-red-700" />
        {/* 주문 기능 미구현 — 추후 연결 */}
        <StatCard label="전체 주문" value="미구현" bg="bg-gray-50" color="text-gray-500" />
      </div>

      {/* 최근 등록 상품 5개 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">최근 등록 상품</h2>
        <Link
          href="/admin/products"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          전체 보기 →
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">재고</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.price.toLocaleString()}원
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.stock}개
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 통계 카드 컴포넌트
function StatCard({
  label,
  value,
  bg,
  color,
}: {
  label: string;
  value: number | string;
  bg: string;
  color: string;
}) {
  return (
    <div className={`rounded-xl p-6 ${bg}`}>
      <p className={`text-sm font-medium mb-2 ${color} opacity-80`}>{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
