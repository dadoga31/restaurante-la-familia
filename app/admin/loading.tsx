export default function AdminLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 bg-carbon-700 rounded-lg w-44" />
        <div className="h-4 bg-carbon-800 rounded-lg w-60" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-xl border border-carbon-700 bg-carbon-800/30 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-carbon-700" />
            <div className="h-8 bg-carbon-700 rounded-lg w-14" />
            <div className="h-3 bg-carbon-800 rounded-lg w-28" />
            <div className="h-3 bg-carbon-800 rounded-lg w-20" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-14 bg-carbon-800/30 rounded-xl border border-carbon-700" />
        ))}
      </div>
    </div>
  );
}
