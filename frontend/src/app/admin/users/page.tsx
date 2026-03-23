'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/admin')
      .then(({ data }) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-400">불러오는 중...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">회원 관리</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">이름</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">이메일</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">권한</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">가입일</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                  회원이 없습니다.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm text-gray-500">{user.id}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role === 'admin' ? '관리자' : '일반'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
