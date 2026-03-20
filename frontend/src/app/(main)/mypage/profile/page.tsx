'use client';

import { useState } from 'react';

export default function ProfilePage() {
  // TODO: auth 구현 후 실제 유저 정보로 교체
  const [form, setForm] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.newPasswordConfirm) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    // TODO: users API 연동
    alert('저장됐습니다.');
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">프로필 수정</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* 기본 정보 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">기본 정보</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              {/* 이메일은 변경 불가 */}
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">비밀번호 변경</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                placeholder="새 비밀번호를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
              <input
                type="password"
                value={form.newPasswordConfirm}
                onChange={(e) => setForm({ ...form, newPasswordConfirm: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900"
                placeholder="새 비밀번호를 다시 입력하세요"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-700 text-sm font-medium"
        >
          저장하기
        </button>
      </form>
    </div>
  );
}
