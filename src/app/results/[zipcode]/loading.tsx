export default function ResultsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Disclaimer skeleton */}
      <div className="bg-gray-100 rounded-xl h-16" />

      {/* Header skeleton */}
      <div className="text-center py-12 px-6 bg-gray-50 rounded-3xl">
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
        <div className="h-16 bg-gray-200 rounded w-48 mx-auto mt-4" />
        <div className="h-4 bg-gray-200 rounded w-40 mx-auto mt-4" />
      </div>

      {/* Chart skeleton */}
      <div>
        <div className="h-6 bg-gray-200 rounded w-40 mb-6" />
        <div className="space-y-4">
          {[80, 65, 45, 30, 25].map((w, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-8 bg-gray-100 rounded" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Weird items skeleton */}
      <div>
        <div className="h-6 bg-gray-200 rounded w-60 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-5 h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}
