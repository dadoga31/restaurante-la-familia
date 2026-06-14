export default function Loading() {
  return (
    <div className="min-h-screen bg-carbon-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-gold-400/20 border-t-gold-400/80 rounded-full animate-spin" />
        <p className="text-cream-400/40 text-xs tracking-[0.3em] uppercase">Cargando</p>
      </div>
    </div>
  );
}
