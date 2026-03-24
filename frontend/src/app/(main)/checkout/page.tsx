/**
 * page.tsx (결제)
 * 결제 페이지. 저장된 배송지 또는 직접 입력으로 주문을 생성하고
 * Toss Payments SDK를 통해 카드 결제를 진행한다. 바로 구매 모드도 지원한다.
 */
'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { CartItem } from '@/types/cart';
import { Suspense } from 'react';
import { useAuthStore } from '@/store/authStore';

interface Address {
  id: number;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('mode') === 'buyNow';

  const { items: cartItems, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 저장된 배송지
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | 'new' | null>(null);

  // 직접 입력 폼
  const [form, setForm] = useState({ recipient: '', phone: '', address: '', memo: '' });

  // 바로 구매 모드면 sessionStorage에서 임시 상품 로드
  useEffect(() => {
    if (isBuyNow) {
      const raw = sessionStorage.getItem('buyNow');
      if (raw) {
        const { product, quantity } = JSON.parse(raw);
        setBuyNowItem({ id: 0, product, quantity });
      }
    }
  }, [isBuyNow]);

  // 페이지 이탈 시 buyNow 데이터 삭제
  useEffect(() => {
    return () => { sessionStorage.removeItem('buyNow'); };
  }, []);

  useEffect(() => {
    api.get('/addresses')
      .then(({ data }) => {
        setAddresses(data);
        const def = data.find((a: Address) => a.isDefault);
        if (def) setSelectedAddressId(def.id);
        else if (data.length > 0) setSelectedAddressId(data[0].id);
        else setSelectedAddressId('new');
      })
      .catch(() => setSelectedAddressId('new'));
  }, []);

  // 실제 사용할 아이템 (바로 구매 or 장바구니)
  const items = isBuyNow ? (buyNowItem ? [buyNowItem] : []) : cartItems;

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = totalPrice >= 30000 ? 0 : 3000;
  const finalAmount = totalPrice + shippingFee;

  // 최종 배송지 정보 결정
  const getDeliveryInfo = () => {
    if (selectedAddressId === 'new') return form;
    const addr = addresses.find((a) => a.id === selectedAddressId);
    if (!addr) return form;
    return { recipient: addr.recipient, phone: addr.phone, address: addr.address, memo: form.memo };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const delivery = getDeliveryInfo();
    if (!delivery.recipient || !delivery.phone || !delivery.address) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      // 바로 구매 모드면 임시로 장바구니에 담았다가 주문 후 제거
      if (isBuyNow && buyNowItem) {
        await api.post('/cart/items', {
          productId: buyNowItem.product.id,
          quantity: buyNowItem.quantity,
        });
      }

      const { data: order } = await api.post('/orders', delivery);
      sessionStorage.removeItem('buyNow');

      const toss = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);
      const payment = toss.payment({ customerKey: `user_${user?.id}` });

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: finalAmount },
        orderId: order.id,
        orderName: items.length === 1
          ? items[0].product.name
          : `${items[0].product.name} 외 ${items.length - 1}건`,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      });
    } catch (err: any) {
      // 주문 생성 실패 (재고 부족, 비활성 상품 등) → 페이지에 에러 메시지 표시
      if (err?.response?.data?.message) {
        setErrorMsg(err.response.data.message);
        setSubmitting(false);
        return;
      }
      // Toss 결제 실패 → fail 페이지로 이동
      if (err?.code !== 'USER_CANCEL') {
        const message = err?.message ?? '오류가 발생했습니다. 다시 시도해주세요.';
        router.push(`/checkout/fail?message=${encodeURIComponent(message)}`);
        return;
      }
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <p className="text-gray-400 mb-4">장바구니가 비어있습니다.</p>
        <button onClick={() => router.push('/products')} className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm hover:bg-gray-700">
          쇼핑 계속하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">주문 / 결제</h1>

      <form onSubmit={handleSubmit} className="flex gap-8">
        <div className="flex-1 flex flex-col gap-5">

          {/* 주문 상품 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">주문 상품</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-700 py-2 border-b border-gray-100 last:border-b-0">
                <span>{item.product.name} × {item.quantity}</span>
                <span className="font-medium">{(item.product.price * item.quantity).toLocaleString()}원</span>
              </div>
            ))}
          </div>

          {/* 배송지 선택 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">배송지</h2>

            <div className="flex flex-col gap-2 mb-4">
              {/* 저장된 배송지 목록 */}
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    selectedAddressId === addr.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mt-0.5"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">기본</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{addr.recipient} · {addr.phone}</p>
                    <p className="text-sm text-gray-500">{addr.address}</p>
                  </div>
                </label>
              ))}

              {/* 직접 입력 옵션 */}
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                selectedAddressId === 'new' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === 'new'}
                  onChange={() => setSelectedAddressId('new')}
                />
                <span className="text-sm text-gray-700">새 배송지 입력</span>
              </label>
            </div>

            {/* 직접 입력 폼 */}
            {selectedAddressId === 'new' && (
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">받는 분 *</label>
                    <input
                      type="text" required value={form.recipient}
                      onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">연락처 *</label>
                    <input
                      type="text" required value={form.phone} placeholder="010-0000-0000"
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">주소 *</label>
                  <input
                    type="text" required value={form.address} placeholder="주소를 입력하세요"
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            )}

            {/* 배송 메모 (공통) */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">배송 메모</label>
              <select
                value={form.memo}
                onChange={(e) => setForm({ ...form, memo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
              >
                <option value="">선택하세요</option>
                <option value="문 앞에 놔주세요">문 앞에 놔주세요</option>
                <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                <option value="벨 눌러주세요">벨 눌러주세요</option>
              </select>
            </div>
          </div>
        </div>

        {/* 결제 요약 */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-[160px]">
            <h2 className="text-base font-semibold text-gray-900 mb-4">결제 금액</h2>
            <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span>{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>총 결제 금액</span>
                <span>{finalAmount.toLocaleString()}원</span>
              </div>
            </div>
            {errorMsg && (
              <p className="text-xs text-red-500 text-center mb-3">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 disabled:bg-gray-400"
            >
              {submitting ? '처리 중...' : '결제하기'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
