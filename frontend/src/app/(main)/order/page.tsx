/**
 * page.tsx (주문·배송 조회)
 * 로그인 사용자의 주문 목록을 보여주는 페이지. 각 주문의 배송 상태를 스텝 UI로 시각화하고
 * 클릭 시 상세 페이지(mypage/orders/[id])로 이동한다.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Order, ORDER_STATUS_LABEL, OrderStatus } from '@/types/order';

const statusColor: Record<OrderStatus, string> = {
  pending:   'bg-blue-100 text-blue-700',
  paid:      'bg-indigo-100 text-indigo-700',
  shipping:  'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const statusStep: Record<OrderStatus, number> = {
  pending:   1,
  paid:      2,
  shipping:  3,
  delivered: 4,
  cancelled: 0,
};

const steps = ['주문완료', '결제완료', '배송중', '배송완료'];

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-8" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 mb-4 animate-pulse">
            <div className="h-4 w-48 bg-gray-100 rounded mb-3" />
            <div className="h-3 w-full bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-xl font-bold text-gray-900 mb-8">주문·배송 조회</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-sm">주문 내역이 없습니다.</p>
          <Link href="/products" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
            쇼핑 시작하기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => {
            const step = statusStep[order.status];
            const isCancelled = order.status === 'cancelled';
            return (
              <Link
                key={order.id}
                href={`/mypage/orders/${order.id}`}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                {/* 주문 기본 정보 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    {/* 대표 상품 이미지 */}
                    {(() => {
                      const mainImage = order.items[0]?.product?.images?.[0]?.url;
                      return (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {mainImage && (
                            <img src={mainImage} alt={order.items[0]?.productName} className="w-full h-full object-cover" />
                          )}
                        </div>
                      );
                    })()}
                    <div>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleString('ko-KR')}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        주문번호: {order.id}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {order.items[0]?.productName}
                        {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusColor[order.status]}`}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>

                {/* 배송 스텝 */}
                {!isCancelled && (
                  <div className="flex items-center gap-0 mt-2">
                    {steps.map((label, idx) => {
                      const num = idx + 1;
                      const isActive = step >= num;
                      const isCurrent = step === num;
                      return (
                        <div key={label} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                              ${isCurrent ? 'bg-blue-600 text-white' : isActive ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                              {num}
                            </div>
                            <span className={`text-[10px] mt-1 whitespace-nowrap ${isCurrent ? 'text-blue-600 font-semibold' : isActive ? 'text-blue-400' : 'text-gray-400'}`}>
                              {label}
                            </span>
                          </div>
                          {idx < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mb-4 mx-1 ${step > num ? 'bg-blue-300' : 'bg-gray-100'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="text-right text-sm font-bold text-gray-900 mt-4">
                  {(order.totalPrice + order.shippingFee).toLocaleString()}원
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
