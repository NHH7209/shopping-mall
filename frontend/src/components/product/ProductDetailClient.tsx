"use client";

// 상품 상세 페이지의 인터랙티브 부분
// - 이미지 갤러리: 서브 이미지 클릭 시 메인 이미지 교체
// - 수량 선택: +/- 버튼으로 수량 조절
// 서버 컴포넌트에서 product 데이터를 받아 렌더링
import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";

export default function ProductDetailClient({ product }: { product: Product }) {
  const initImage = product.images.find((i) => i.isMain) || product.images[0];

  const [selectedImg, setSelectedImg] = useState(initImage);
  const [qty, setQty] = useState(1);

  const sortedImages = [...product.images].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
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
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition-colors">
            장바구니 담기
          </button>
          <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 rounded-xl font-medium transition-colors">
            바로 구매
          </button>
        </div>
      </div>
    </div>
  );
}
