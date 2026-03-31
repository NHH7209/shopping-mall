export default function MypageLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse">
      <div className="h-8 w-32 bg-gray-100 rounded mb-8" />
      <div className="hidden md:flex gap-8">
        <div className="w-44 flex-shrink-0 flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-20 bg-gray-100 rounded-xl" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="md:hidden flex flex-col gap-4">
        <div className="h-20 bg-gray-100 rounded-xl" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
