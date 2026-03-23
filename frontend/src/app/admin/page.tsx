'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Product } from '@/types/product';
import { Order, ORDER_STATUS_LABEL } from '@/types/order';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const handleLogout = async () => {
    await api.post('/auth/logout').catch(() => {});
    logout();
    router.replace('/auth/login');
  };

  useEffect(() => {
    api.get(`${process.env.NEXT_PUBLIC_API_URL}/products/admin`).then(({ data }) => setProducts(data)).catch(() => {});
    api.get('/orders/admin/all').then(({ data }) => setRecentOrders(data.slice(0, 5))).catch(() => {});
    api.get('/orders/admin/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const inactiveProducts = totalProducts - activeProducts;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
          로그아웃
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-5 mb-10">
        <StatCard label="전체 상품" value={totalProducts} bg="bg-blue-50" color="text-blue-700" />
        <StatCard label="활성 상품" value={activeProducts} bg="bg-green-50" color="text-green-700" />
        <StatCard label="전체 주문" value={stats?.totalOrders ?? '-'} bg="bg-indigo-50" color="text-indigo-700" />
        <StatCard label="처리 대기" value={stats?.pendingOrders ?? '-'} bg="bg-yellow-50" color="text-yellow-700" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 최근 상품 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">최근 등록 상품</h2>
            <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">전체 보기 →</Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">상품명</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">가격</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">상태</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900 max-w-[150px] truncate">{product.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{product.price.toLocaleString()}원</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 최근 주문 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">최근 주문</h2>
            <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-900">전체 보기 →</Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">주문자</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">금액</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">상태</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={3} className="px-5 py-6 text-center text-sm text-gray-400">주문 없음</td></tr>
                ) : recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm text-gray-900">{(order as any).user?.name ?? '-'}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{(order.totalPrice + order.shippingFee).toLocaleString()}원</td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-600">{ORDER_STATUS_LABEL[order.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, bg, color }: { label: string; value: number | string; bg: string; color: string }) {
  return (
    <div className={`rounded-xl p-6 ${bg}`}>
      <p className={`text-sm font-medium mb-2 ${color} opacity-80`}>{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
}
