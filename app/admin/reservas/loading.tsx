export default function ReservasLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-carbon-700 rounded-lg w-36" />
        <div className="h-4 bg-carbon-800 rounded-lg w-52" />
      </div>
      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 bg-carbon-800 rounded-lg w-28" />
        ))}
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-16 bg-carbon-800/30 rounded-xl border border-carbon-700" />
        ))}
      </div>
    </div>
  );
}
