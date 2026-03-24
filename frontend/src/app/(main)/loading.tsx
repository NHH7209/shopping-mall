/**
 * loading.tsx (메인)
 * 메인 페이지 로딩 스켈레톤 UI. Next.js의 스트리밍 기능으로 데이터 로딩 중 표시된다.
 */
export default function MainLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
      {/* 배너 스켈레톤 */}
      <div className="h-64 bg-gray-100 rounded-2xl mb-12" />

      {/* 섹션 타이틀 */}
      <div className="h-6 w-32 bg-gray-100 rounded mb-6" />

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i}>
            <div className="aspect-square bg-gray-100 rounded-xl mb-3" />
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
