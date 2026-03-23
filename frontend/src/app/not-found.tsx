import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-bold text-gray-100">404</p>
      <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-sm text-gray-400 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
