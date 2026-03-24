/**
 * page.tsx (주문 상세)
 * 주문 상세 페이지. 주문 상태, 상품 목록, 배송지, 결제 금액을 표시하며
 * PENDING/PAID 상태에서는 취소, 모든 주문에서 재주문 기능을 제공한다.
 */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Order, ORDER_STATUS_LABEL } from '@/types/order';
import { useCartStore } from '@/store/cartStore';

const statusColor: Record<string, string> = {
  pending:   'bg-blue-100 text-blue-700',
  paid:      'bg-indigo-100 text-indigo-700',
  shipping:  'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const CANCELLABLE = ['pending', 'paid'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { fetchCart, items: cartItems, removeItem } = useCartStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('주문을 취소하시겠습니까?')) return;
    setCancelling(true);
    try {
      const { data } = await api.patch(`/orders/${id}/cancel`);
      setOrder(data);
    } catch (err: any) {
      alert(err?.response?.data?.message ?? '취소에 실패했습니다.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    if (!order) return;
    setReordering(true);
    try {
      for (const cartItem of cartItems) {
        await removeItem(cartItem.id);
      }
      for (const item of order.items) {
        if (item.product) {
          await api.post('/cart/items', { productId: item.product.id, quantity: item.quantity });
        }
      }
      await fetchCart();
      router.push('/checkout');
    } catch {
      alert('장바구니 담기에 실패했습니다.');
      setReordering(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">불러오는 중...</p>;
  if (!order) return <p className="text-sm text-red-400">주문을 찾을 수 없습니다.</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">주문 상세</h2>

      {/* 주문 상태 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleString('ko-KR')}
            </p>
            <p className="text-sm font-medium text-gray-900 mt-0.5 truncate max-w-[240px]">
              주문번호: {order.id}
            </p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[order.status]}`}>
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        </div>
      </div>

      {/* 주문 상품 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">주문 상품</h3>
        {order.items.map((item) => {
          const mainImage = item.product?.images?.[0]?.url;
          return (
            <div key={item.id} className="flex gap-4 py-2 border-b border-gray-100 last:border-b-0">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {mainImage && (
                  <img src={mainImage} alt={item.productName} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.quantity}개</p>
              </div>
              <p className="text-sm font-bold text-gray-900 self-center">
                {(item.price * item.quantity).toLocaleString()}원
              </p>
            </div>
          );
        })}
      </div>

      {/* 배송지 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">배송지</h3>
        <p className="text-sm text-gray-900 font-medium">{order.recipient}</p>
        <p className="text-sm text-gray-600 mt-0.5">{order.phone}</p>
        <p className="text-sm text-gray-600 mt-0.5">{order.address}</p>
        {order.memo && (
          <p className="text-sm text-gray-400 mt-1">메모: {order.memo}</p>
        )}
      </div>

      {/* 결제 금액 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">결제 금액</h3>
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>상품 금액</span>
            <span>{order.totalPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>배송비</span>
            <span>{order.shippingFee === 0 ? '무료' : `${order.shippingFee.toLocaleString()}원`}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
            <span>총 결제 금액</span>
            <span>{(order.totalPrice + order.shippingFee).toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        {CANCELLABLE.includes(order.status) && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {cancelling ? '취소 중...' : '주문 취소'}
          </button>
        )}
        <button
          onClick={handleReorder}
          disabled={reordering}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {reordering ? '담는 중...' : '재주문'}
        </button>
      </div>
    </div>
  );
}
