/**
 * page.tsx (결제 실패)
 * Toss 결제 실패 시 리다이렉트되는 페이지. URL의 message 파라미터로 실패 사유를 표시한다.
 */
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function FailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') ?? '결제에 실패했습니다.';

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제에 실패했습니다</h1>
        <p className="text-gray-500 text-sm mb-8">{message}</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/cart"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            장바구니로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense>
      <FailContent />
    </Suspense>
  );
}
