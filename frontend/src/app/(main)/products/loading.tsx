export default function ProductsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 필터 스켈레톤 */}
      <div className="flex gap-2 mb-8 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-100 rounded-full" />
        ))}
      </div>

      {/* 상품 그리드 스켈레톤 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-100 rounded-xl mb-3" />
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
