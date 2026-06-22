export default function MenusLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-carbon-700 rounded-lg w-36" />
        <div className="h-4 bg-carbon-800 rounded-lg w-52" />
      </div>
      {/* Photo upload block */}
      <div className="p-6 rounded-xl border border-carbon-700 bg-carbon-800/30 space-y-4">
        <div className="h-5 bg-carbon-700 rounded w-48" />
        <div className="h-40 bg-carbon-800 rounded-xl" />
      </div>
      {/* Filter row */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 bg-carbon-800 rounded-lg w-24" />
        ))}
      </div>
      {/* Dish cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-carbon-700 bg-carbon-800/20 space-y-3">
            <div className="h-5 bg-carbon-700 rounded w-3/4" />
            <div className="h-3 bg-carbon-800 rounded w-full" />
            <div className="h-3 bg-carbon-800 rounded w-2/3" />
            <div className="flex justify-between pt-1">
              <div className="h-4 bg-carbon-700 rounded w-16" />
              <div className="h-6 bg-carbon-800 rounded w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
