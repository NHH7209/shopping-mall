'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const { items, fetchCart, updateQuantity, removeItem } = useCartStore();

  // 페이지 진입 시 최신 장바구니 불러오기
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shippingFee = totalPrice >= 30000 ? 0 : 3000;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">장바구니</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 mb-6">장바구니가 비어있습니다.</p>
          <Link
            href="/products"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm hover:bg-gray-700"
          >
            쇼핑 계속하기
          </Link>
        </div>
      ) : (
        <div className="flex gap-8">
          {/* 상품 목록 */}
          <div className="flex-1 flex flex-col gap-4">
            {items.map((item) => {
              const mainImage = item.product.images?.find((img) => img.isMain)?.url
                ?? item.product.images?.[0]?.url;
              return (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4"
                >
                  {/* 상품 이미지 */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {mainImage && (
                      <img
                        src={mainImage}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-400 text-lg"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      {/* 수량 조절 */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="w-7 h-7 border border-gray-300 rounded-full text-sm hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 border border-gray-300 rounded-full text-sm hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {(item.product.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 주문 요약 */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-[160px]">
              <h2 className="text-base font-semibold text-gray-900 mb-4">주문 요약</h2>
              <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>상품 금액</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>
                    {shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                  <span>총 결제 금액</span>
                  <span>{(totalPrice + shippingFee).toLocaleString()}원</span>
                </div>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-gray-400 mb-4">
                  {(30000 - totalPrice).toLocaleString()}원 더 담으면 무료배송!
                </p>
              )}
              <Link
                href="/checkout"
                className="block w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium text-center hover:bg-gray-700"
              >
                주문하기
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
