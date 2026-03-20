'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ImageInput {
  url: string;
  isMain: boolean;
  sortOrder: number;
  preview: string; // 로컬 미리보기용 (업로드 전 브라우저에서만 보임)
  uploading: boolean; // 업로드 진행 중 여부
}

export default function AdminProductNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
  });
  const [images, setImages] = useState<ImageInput[]>([]);

  // 파일 선택 시 호출 — Cloudinary에 업로드하고 URL을 images 상태에 저장
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 로컬 미리보기 URL 생성 (업로드 전에 화면에 표시)
    const preview = URL.createObjectURL(file);

    // 해당 이미지를 "업로드 중" 상태로 변경
    setImages((prev) =>
      prev.map((img, idx) =>
        idx === i ? { ...img, preview, uploading: true } : img,
      ),
    );

    // FormData로 파일 전송 — multipart/form-data 형식
    const formData = new FormData();
    formData.append('file', file); // 백엔드 FileInterceptor('file')과 키 이름 맞춰야 함

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    // 업로드 완료 — Cloudinary URL로 교체
    setImages((prev) =>
      prev.map((img, idx) =>
        idx === i ? { ...img, url: data.url, uploading: false } : img,
      ),
    );
  };

  const addImage = () => {
    setImages([
      ...images,
      { url: '', isMain: images.length === 0, sortOrder: images.length, preview: '', uploading: false },
    ]);
  };

  const removeImage = (i: number) => {
    const updated = images.filter((_, idx) => idx !== i);
    if (images[i].isMain && updated.length > 0) updated[0].isMain = true;
    setImages(updated);
  };

  const setMainImage = (i: number) =>
    setImages(images.map((img, idx) => ({ ...img, isMain: idx === i })));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validImages = images.filter((img) => img.url.trim() !== '');

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        images: validImages.map(({ url, isMain, sortOrder }) => ({ url, isMain, sortOrder })),
      }),
    });

    setLoading(false);
    router.push('/admin/products');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">상품 등록</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* 기본 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">기본 정보</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상품명 *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                placeholder="상품명을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">가격 *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">재고 *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상품 설명</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900 resize-none"
                placeholder="상품 설명을 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">이미지</h2>
            <button
              type="button"
              onClick={addImage}
              className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              + 이미지 추가
            </button>
          </div>

          {images.length === 0 && (
            <p className="text-sm text-gray-400">+ 이미지 추가 버튼을 눌러 이미지를 추가하세요.</p>
          )}

          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative">
                {/* 이미지 미리보기 박스 */}
                <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {img.uploading ? (
                    <p className="text-xs text-gray-400">업로드 중...</p>
                  ) : img.preview || img.url ? (
                    <img
                      src={img.preview || img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-xs text-gray-400">파일 선택</p>
                  )}
                </div>

                {/* 파일 선택 input — 실제로는 숨기고 박스 클릭으로 트리거 */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, i)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                {/* 대표 이미지 뱃지 */}
                <button
                  type="button"
                  onClick={() => setMainImage(i)}
                  className={`absolute bottom-1 left-1 text-xs px-1.5 py-0.5 rounded font-medium ${
                    img.isMain ? 'bg-gray-900 text-white' : 'bg-white/80 text-gray-500'
                  }`}
                >
                  대표
                </button>

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  ✕
                </button>
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
            disabled={loading || images.some((img) => img.uploading)}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-700 text-sm font-medium disabled:opacity-50"
          >
            {loading ? '등록 중...' : '상품 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
