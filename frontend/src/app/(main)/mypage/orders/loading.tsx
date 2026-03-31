export default function OrdersLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-24 bg-gray-100 rounded mb-6" />
      <div className="flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col gap-1.5">
                <div className="h-3 w-28 bg-gray-100 rounded" />
                <div className="h-4 w-40 bg-gray-100 rounded" />
              </div>
              <div className="h-6 w-16 bg-gray-100 rounded-full" />
            </div>
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-1.5">
              <div className="h-3 w-48 bg-gray-100 rounded" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
            </div>
            <div className="h-4 w-24 bg-gray-100 rounded ml-auto mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
