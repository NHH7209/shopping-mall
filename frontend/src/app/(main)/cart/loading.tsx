export default function CartLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse">
      <div className="h-8 w-32 bg-gray-100 rounded mb-8" />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 border border-gray-100 rounded-xl p-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-between">
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-72">
          <div className="border border-gray-100 rounded-xl p-6 flex flex-col gap-4">
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-10 bg-gray-100 rounded-xl mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
