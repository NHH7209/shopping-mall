'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Order, ORDER_STATUS_LABEL } from '@/types/order';

const statusColor: Record<string, string> = {
  pending:   'bg-blue-100 text-blue-700',
  paid:      'bg-indigo-100 text-indigo-700',
  shipping:  'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-400">불러오는 중...</p>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">주문 내역</h2>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-sm">주문 내역이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/mypage/orders/${order.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString('ko-KR')}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5 truncate max-w-[200px]">
                    주문번호: {order.id}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[order.status]}`}>
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-3">
                {order.items.map((item) => (
                  <p key={item.id} className="text-sm text-gray-600">
                    {item.productName} × {item.quantity}
                  </p>
                ))}
              </div>

              <p className="text-right text-sm font-bold text-gray-900 mt-3">
                {(order.totalPrice + order.shippingFee).toLocaleString()}원
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
