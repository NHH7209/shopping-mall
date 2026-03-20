'use client';

import { useState } from 'react';

interface Address {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

// TODO: users/address API 연동 후 실제 데이터로 교체
const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    label: '집',
    recipient: '홍길동',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    isDefault: true,
  },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: '',
    recipient: '',
    phone: '',
    address: '',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: Address = {
      id: String(Date.now()),
      ...form,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, newAddress]);
    setForm({ label: '', recipient: '', phone: '', address: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id })),
    );
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
          <div className="grid grid-cols-2 gap-3">
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
              className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-gray-700"
            >
              저장
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
            <div
              key={addr.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">
                      기본
                    </span>
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
