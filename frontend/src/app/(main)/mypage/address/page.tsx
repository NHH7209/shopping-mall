/**
 * page.tsx (배송지 관리)
 * 배송지 목록 조회, 추가 폼, 기본 배송지 설정, 삭제 기능을 제공하는 마이페이지 탭이다.
 */
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Address {
  id: number;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ label: '', recipient: '', phone: '', address: '' });

  const fetchAddresses = () => {
    api.get('/addresses').then(({ data }) => setAddresses(data)).catch(() => {});
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/addresses', form);
      setForm({ label: '', recipient: '', phone: '', address: '' });
      setShowForm(false);
      fetchAddresses();
    } catch {
      alert('배송지 추가에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    await api.patch(`/addresses/${id}/default`);
    fetchAddresses();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('배송지를 삭제할까요?')) return;
    await api.delete(`/addresses/${id}`);
    fetchAddresses();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">배송지 관리</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          + 배송지 추가
        </button>
      </div>

      {/* 배송지 추가 폼 */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5 flex flex-col gap-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">배송지 이름</label>
              <input
                type="text"
                required
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
                placeholder="집, 회사..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">받는 분</label>
              <input
                type="text"
                required
                value={form.recipient}
                onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">연락처</label>
            <input
              type="text"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
              placeholder="010-0000-0000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">주소</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
              placeholder="주소를 입력하세요"
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
              {submitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      )}

      {/* 배송지 목록 */}
      {addresses.length === 0 ? (
        <p className="text-gray-400 text-sm">등록된 배송지가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">기본</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs text-gray-500 hover:text-gray-900"
                    >
                      기본 설정
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-xs text-gray-400 hover:text-red-400"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{addr.recipient} · {addr.phone}</p>
              <p className="text-sm text-gray-600 mt-0.5">{addr.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
