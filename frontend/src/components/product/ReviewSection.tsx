'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  user: { id: number; name: string };
}

export default function ReviewSection({ productId }: { productId: string }) {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ rating: 5, content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = () => {
    api.get(`/reviews?productId=${productId}`)
      .then(({ data }) => setReviews(data))
      .catch(() => {});
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews', { productId, ...form });
      setForm({ rating: 5, content: '' });
      setShowForm(false);
      fetchReviews();
      toast.success('리뷰가 등록됐습니다.');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? '리뷰 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('리뷰를 삭제할까요?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      fetchReviews();
      toast.success('리뷰가 삭제됐습니다.');
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <section className="mt-12 pt-10 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          리뷰 <span className="text-gray-400 font-normal text-base">({reviews.length})</span>
        </h2>
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            리뷰 작성
          </button>
        )}
      </div>

      {/* 리뷰 작성 폼 */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">별점</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  className={`text-2xl ${star <= form.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-900 resize-none"
              placeholder="상품에 대한 솔직한 리뷰를 작성해주세요"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-gray-700 disabled:bg-gray-400"
            >
              {submitting ? '등록 중...' : '등록'}
            </button>
          </div>
        </form>
      )}

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="text-sm">아직 리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-5 last:border-b-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{review.user.name}</span>
                  <span className="text-yellow-400 text-sm">{stars(review.rating)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                  {user?.id === review.user.id && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-xs text-gray-400 hover:text-red-400"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
