'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const called = useRef(false);

  useEffect(() => {
    // accessToken이 복구될 때까지 대기
    if (!accessToken) return;
    if (called.current) return;
    called.current = true;

    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = Number(searchParams.get('amount'));

    // 백엔드에 최종 승인 요청
    api.post('/payments/confirm', { paymentKey, orderId, amount })
      .then(() => {
        clearCart();
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  }, [accessToken, searchParams, clearCart]);

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <p className="text-gray-500">결제 확인 중...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center text-center">
        <div>
          <p className="text-red-500 font-medium mb-4">결제 승인에 실패했습니다.</p>
          <button onClick={() => router.back()} className="text-sm text-gray-500 underline">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료됐습니다</h1>
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

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
