'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CompleteContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">주문이 완료됐습니다</h1>
        {orderId && (
          <p className="text-xs text-gray-400 mb-2">주문번호: {orderId}</p>
        )}
        <p className="text-gray-500 text-sm mb-8">
          주문해주셔서 감사합니다. <br />
          배송 준비가 되면 알려드릴게요.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/mypage/orders"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            주문 내역 보기
          </Link>
          <Link
            href="/"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense>
      <CompleteContent />
    </Suspense>
  );
}
