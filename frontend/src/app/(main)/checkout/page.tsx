'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// TODO: cart/orders API 연동 후 실제 데이터로 교체
const MOCK_ITEMS = [
  { id: '1', name: '상품 예시 A', price: 35000, quantity: 1 },
  { id: '2', name: '상품 예시 B', price: 12000, quantity: 2 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    recipient: '',
    phone: '',
    address: '',
    memo: '',
    payMethod: 'card',
  });

  const totalPrice = MOCK_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = totalPrice >= 30000 ? 0 : 3000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: orders API 연동 — 주문 생성 후 완료 페이지로 이동
    router.push('/checkout/complete');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">주문 / 결제</h1>

      <form onSubmit={handleSubmit} className="flex gap-8">
        <div className="flex-1 flex flex-col gap-5">
          {/* 주문 상품 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">주문 상품</h2>
            {MOCK_ITEMS.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-700 py-2 border-b border-gray-100 last:border-b-0">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString()}원</span>
              </div>
            ))}
          </div>

          {/* 배송지 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">배송지</h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">받는 분 *</label>
                  <input
                    type="text"
                    required
                    value={form.recipient}
                    onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연락처 *</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주소 *</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                  placeholder="주소를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">배송 메모</label>
                <select
                  value={form.memo}
                  onChange={(e) => setForm({ ...form, memo: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                >
                  <option value="">선택하세요</option>
                  <option value="문 앞에 놔주세요">문 앞에 놔주세요</option>
                  <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                  <option value="벨 눌러주세요">벨 눌러주세요</option>
                </select>
              </div>
            </div>
          </div>

          {/* 결제 수단 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">결제 수단</h2>
            <div className="flex gap-3">
              {[
                { value: 'card', label: '신용카드' },
                { value: 'transfer', label: '계좌이체' },
                { value: 'phone', label: '휴대폰' },
              ].map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setForm({ ...form, payMethod: method.value })}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    form.payMethod === method.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {method.label}
                </button>
              ))}
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
                <span>{(totalPrice + shippingFee).toLocaleString()}원</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700"
            >
              결제하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
