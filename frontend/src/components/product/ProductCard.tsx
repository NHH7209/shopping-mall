import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const mainImage = product.images.find((img) => img.isMain) || product.images[0];

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
              이미지 없음
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="font-medium text-gray-800 truncate mb-1">{product.name}</p>
          <p className="text-gray-900 font-bold">{product.price.toLocaleString("ko-KR")}원</p>
        </div>
      </div>
    </Link>
  );
}
