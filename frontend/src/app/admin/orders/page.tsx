'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Order, OrderStatus, ORDER_STATUS_LABEL } from '@/types/order';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'paid', 'shipping', 'delivered', 'cancelled'];

const statusColor: Record<OrderStatus, string> = {
  pending:   'bg-blue-100 text-blue-700',
  paid:      'bg-indigo-100 text-indigo-700',
  shipping:  'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get('/orders/admin/all')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    fetchOrders();
  };

  if (loading) return <p className="text-sm text-gray-400">불러오는 중...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">주문 관리</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">주문번호</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">주문자</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">상품</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">금액</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">일시</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                  주문 내역이 없습니다.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                  <td className="px-5 py-4 text-xs text-gray-500 font-mono max-w-[120px] truncate">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-900">
                    {(order as any).user?.name ?? '-'}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {order.items[0]?.productName}
                    {order.items.length > 1 && (
                      <span className="text-gray-400"> 외 {order.items.length - 1}건</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {(order.totalPrice + order.shippingFee).toLocaleString()}원
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${statusColor[order.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
