/**
 * ProductDetailClient.tsx (상품 상세 클라이언트 컴포넌트)
 * 상품 상세 페이지의 인터랙티브 영역. 이미지 갤러리, 수량 선택, 장바구니 담기,
 * 바로 구매 기능을 제공하며 서버 컴포넌트(ProductDetailPage)로부터 product 데이터를 받아 렌더링한다.
 */
"use client";

// 상품 상세 페이지의 인터랙티브 부분
// - 이미지 갤러리: 서브 이미지 클릭 시 메인 이미지 교체
// - 수량 선택: +/- 버튼으로 수량 조절
// 서버 컴포넌트에서 product 데이터를 받아 렌더링
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export default function ProductDetailClient({ product }: { product: Product }) {
  const sortedImages = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);

  const [selectedImg, setSelectedImg] = useState(sortedImages[0]);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);

  const handleAddToCart = async () => {
    if (!user) { router.push('/auth/login'); return; }
    setAdding(true);
    try {
      await addItem(product.id, qty);
      setShowModal(true);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) { router.push('/auth/login'); return; }
    // 장바구니에 담지 않고 임시로 저장 후 바로 결제 페이지 이동
    sessionStorage.setItem('buyNow', JSON.stringify({ product, quantity: qty }));
    router.push('/checkout?mode=buyNow');
  };


  return (
    <>
    {/* 장바구니 담기 완료 모달 */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
        <div className="relative bg-white rounded-2xl p-8 w-80 text-center shadow-xl">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">장바구니에 담았습니다</h3>
          <p className="text-sm text-gray-400 mb-6">{product.name}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              계속 쇼핑
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              장바구니 보기
            </button>
          </div>
        </div>
      </div>
    )}
    <div className="flex gap-12">
      {/* 이미지 영역 */}
      <div className="w-1/2">
        {/* 메인 이미지 */}
        <div className="relative w-full h-[480px] bg-gray-100 rounded-2xl overflow-hidden mb-3">
          {selectedImg ? (
            <Image
              src={selectedImg.url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-gray-400">
              이미지 없음
            </span>
          )}
        </div>

        {/* 서브 이미지 갤러리 */}
        {sortedImages.length > 1 && (
          <div className="flex gap-2">
            {sortedImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImg(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${
                  selectedImg?.id === img.id
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={img.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="w-1/2 flex flex-col">
        <div className="flex-1">
          {/* 카테고리 */}
          {product.category && (
            <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-3">
              {product.category}
            </span>
          )}

          {/* 상품명 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>

          {/* 가격 */}
          <p className="text-3xl font-bold text-gray-900 mb-6">
            {product.price.toLocaleString("ko-KR")}
            <span className="text-xl ml-1">원</span>
          </p>

          <hr className="border-gray-100 mb-6" />

          {/* 설명 */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* 재고 / 통계 */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
            <span>재고 {product.stock}개</span>
            <span>·</span>
            <span>조회 {product.viewCount.toLocaleString()}</span>
            <span>·</span>
            <span>판매 {product.salesCount.toLocaleString()}</span>
          </div>
        </div>

        {/* 수량 선택 */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-gray-600 w-12">수량</span>
          <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
            >
              −
            </button>
            <span className="w-12 text-center text-sm font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-400">
            총 {(product.price * qty).toLocaleString("ko-KR")}원
          </span>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-medium transition-colors"
          >
            {adding ? '담는 중...' : '장바구니 담기'}
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 rounded-xl font-medium transition-colors"
          >
            바로 구매
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
