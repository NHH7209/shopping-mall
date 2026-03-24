/**
 * page.tsx (관리자 상품 수정)
 * 기존 상품을 수정하는 관리자 페이지. URL의 [id]로 상품 데이터를 불러와 폼에 채우고,
 * 이미지 URL 관리 및 활성/비활성 토글 기능을 제공한다.
 */
'use client';

import { useState, useEffect } from 'react';
// useRouter: 페이지 이동 / useParams: URL의 [id] 값 읽기
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { Product } from '@/types/product';

interface ImageInput {
  url: string;
  sortOrder: number;
}

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // URL의 [id] 부분 추출

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const CATEGORIES = ["스킨케어", "클렌징", "선케어", "메이크업", "마스크팩", "에센스/세럼", "헤어케어", "바디케어"];

  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    isActive: true,
    category: '',
  });
  const [images, setImages] = useState<ImageInput[]>([]);

  // 컴포넌트가 마운트될 때 기존 상품 데이터를 불러와서 폼에 채움
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        { cache: 'no-store' },
      );
      const product: Product = await res.json();

      setForm({
        name: product.name,
        price: String(product.price),
        stock: String(product.stock),
        description: product.description || '',
        isActive: product.isActive,
        category: product.category || '',
      });

      // 이미지가 있으면 기존 이미지로 채우고, 없으면 빈 입력칸 하나
      setImages(
        product.images.length > 0
          ? product.images.map((img) => ({
              url: img.url,
              sortOrder: img.sortOrder,
            }))
          : [{ url: '', sortOrder: 0 }],
      );
      setFetching(false);
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validImages = images.filter((img) => img.url.trim() !== '');

    try {
      await api.patch(`/products/${id}`, {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        isActive: form.isActive,
        category: form.category || undefined,
        images: validImages,
      });
      router.push('/admin/products');
    } catch (err: any) {
      alert(err.response?.data?.message ?? '수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const addImage = () =>
    setImages([...images, { url: '', sortOrder: images.length }]);

  const removeImage = (i: number) => {
    setImages(images.filter((_, idx) => idx !== i));
  };

  const updateImageUrl = (i: number, url: string) =>
    setImages(images.map((img, idx) => (idx === i ? { ...img, url } : img)));

  if (fetching) return <p className="text-gray-400 text-sm">로딩 중...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">상품 수정</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* 기본 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">기본 정보</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상품명 *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  가격 *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  재고 *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900 bg-white"
              >
                <option value="">카테고리 선택</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상품 설명
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900 resize-none"
              />
            </div>

            {/* 활성/비활성 토글 — 등록 폼엔 없고 수정 폼에만 있음 */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-medium text-gray-700">상품 활성화</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  비활성 시 고객 화면에 노출되지 않습니다
                </p>
              </div>
              {/* 토글 버튼 — CSS로 구현한 스위치 */}
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, isActive: !form.isActive })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.isActive ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    form.isActive ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 이미지 URL */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">이미지 URL</h2>
            <button
              type="button"
              onClick={addImage}
              className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              + 이미지 추가
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={img.url}
                  onChange={(e) => updateImageUrl(i, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                  placeholder="https://example.com/image.jpg"
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="text-gray-300 hover:text-red-400 flex-shrink-0 text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-700 text-sm font-medium disabled:opacity-50"
          >
            {loading ? '수정 중...' : '상품 수정'}
          </button>
        </div>
      </form>
    </div>
  );
}
