import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import Banner from '@/components/layout/Banner';

async function getRanking(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/ranking`, {
    cache: 'no-store',
  });
  return res.json();
}

async function getTrending(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/trending`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export default async function HomePage() {
  const [ranking, trending] = await Promise.all([getRanking(), getTrending()]);

  return (
    <>
      {/* 배너 — 화면 전체 너비, 최소 1024px */}
      <div className="w-full min-w-[1024px]">
        <Banner />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* 실시간 랭킹 섹션 */}
        <section className="px-4">
          {/* 타이틀 — 양쪽 라인으로 포인트 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-sky-200" />
            <h2 className="text-2xl font-bold text-gray-800 whitespace-nowrap">실시간 랭킹</h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-sky-200" />
          </div>

          <div className="grid grid-cols-5 gap-5">
            {ranking.map((product, index) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    {product.images.find((img) => img.isMain) && (
                      <Image
                        src={product.images.find((img) => img.isMain)!.url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}
                    {/* 순위 뱃지 */}
                    <span className="absolute top-2 left-2 z-10 text-white text-xs font-bold px-2 h-6 flex items-center justify-center rounded-md bg-gray-400/40 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_2px_6px_rgba(0,0,0,0.25)] [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-gray-900 font-bold text-sm mt-0.5">{product.price.toLocaleString()}원</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 요즘 주목 받는 상품 섹션 */}
        <section className="mt-14 px-4 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-sky-200" />
            <h2 className="text-2xl font-bold text-gray-800 whitespace-nowrap">요즘 주목 받는 상품</h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-sky-200" />
          </div>

          <div className="grid grid-cols-5 gap-5">
            {trending.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                    {product.images.find((img) => img.isMain) && (
                      <Image
                        src={product.images.find((img) => img.isMain)!.url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-gray-900 font-bold text-sm mt-0.5">{product.price.toLocaleString()}원</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
