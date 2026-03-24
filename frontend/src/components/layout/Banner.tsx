/**
 * Banner.tsx
 * 홈 및 상품 목록 상단 자동 슬라이드 배너. 3초 간격으로 자동 전환되며
 * 이전/다음 버튼과 인디케이터 버튼으로 수동 조작도 가능하다.
 */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const banners = [
  {
    id: 1,
    title: "봄 시즌 특가",
    description: "최대 50% 할인 이벤트 진행중",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&q=80",
    overlay: "from-rose-900/60 to-pink-900/30",
  },
  {
    id: 2,
    title: "신규 회원 혜택",
    description: "가입 즉시 10% 쿠폰 지급",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=80",
    overlay: "from-blue-900/60 to-sky-900/30",
  },
  {
    id: 3,
    title: "무료배송 이벤트",
    description: "3만원 이상 구매 시 전 상품 무료배송",
    imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1600&q=80",
    overlay: "from-emerald-900/60 to-teal-900/30",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  return (
    <div className="w-full h-[420px] relative overflow-hidden mb-12">
      {banners.map((banner, idx) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100" : "opacity-0"}`}
        >
          {/* 배경 이미지 */}
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            className="object-cover"
            priority={idx === 0}
          />
          {/* 어두운 그라데이션 오버레이 — 텍스트 가독성 확보 */}
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.overlay}`} />

          {/* 텍스트 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
              {banner.title}
            </h2>
            <p className="text-white/90 text-lg drop-shadow-sm">{banner.description}</p>
          </div>
        </div>
      ))}

      {/* 이전/다음 버튼 — max-w 컨테이너 기준으로 위치 고정 */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="w-full max-w-6xl mx-auto px-4 flex justify-between items-center">
          <button
            onClick={prev}
            className="pointer-events-auto bg-white/30 hover:bg-white/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="pointer-events-auto bg-white/30 hover:bg-white/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${idx === current ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
