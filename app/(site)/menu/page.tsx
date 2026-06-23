import AnimateOnScroll from "@/components/AnimateOnScroll";
import ParallaxSection from "@/components/ParallaxSection";
import AmbientGlow from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { UtensilsCrossed, AlertTriangle } from "lucide-react";

const HEADER_IMG = "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1920&q=80";

// Los 14 alérgenos de declaración obligatoria — Reglamento (UE) 1169/2011, Anexo II
const ALLERGENS: Record<string, { label: string; emoji: string }> = {
  gluten:         { label: "Gluten",        emoji: "🌾" },
  crustaceos:     { label: "Crustáceos",    emoji: "🦐" },
  huevos:         { label: "Huevos",        emoji: "🥚" },
  pescado:        { label: "Pescado",       emoji: "🐟" },
  cacahuetes:     { label: "Cacahuetes",    emoji: "🥜" },
  soja:           { label: "Soja",          emoji: "🫘" },
  lacteos:        { label: "Lácteos",       emoji: "🥛" },
  frutos_cascara: { label: "Frutos secos",  emoji: "🌰" },
  apio:           { label: "Apio",          emoji: "🌿" },
  mostaza:        { label: "Mostaza",       emoji: "🌱" },
  sesamo:         { label: "Sésamo",        emoji: "🫙" },
  sulfitos:       { label: "Sulfitos",      emoji: "🍷" },
  altramuces:     { label: "Altramuces",    emoji: "🌼" },
  moluscos:       { label: "Moluscos",      emoji: "🦑" },
};

async function getMenu() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      dishes: { where: { isActive: true }, orderBy: { order: "asc" } },
    },
  });
}

export const revalidate = 300;

export default async function MenuPage() {
  const categories = await getMenu();

  return (
    <>
      <ParallaxSection
        imageUrl={HEADER_IMG}
        overlayOpacity={0.80}
        overlayColor="8,8,8"
        speed={0.15}
        className="pt-36 pb-20 px-6"
      >
        <div className="text-center">
          <AnimateOnScroll animation="blur-in">
            <span className="text-gold-400 text-xs tracking-[0.45em] uppercase font-medium">Temporada actual</span>
            <h1 className="font-display font-bold text-5xl sm:text-6xl text-cream-50 mt-3 tracking-wide drop-shadow-2xl">
              Nuestra Carta
            </h1>
            <div className="mt-5 h-px w-14 bg-gold-400/60 mx-auto" />
            <p className="text-cream-300 mt-6 max-w-xl mx-auto leading-relaxed">
              Ingredientes de temporada, técnicas de alta cocina y el alma mediterránea
              que define cada plato de La Familia.
            </p>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

      <main className="flex-1 bg-carbon-950 pb-28 relative z-10">
        <AmbientGlow />
        <div className="relative z-10 max-w-5xl mx-auto px-6">

          {/* Aviso legal alérgenos — Reglamento (UE) 1169/2011 */}
          <AnimateOnScroll animation="fade-up" className="pt-10">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-400/20 bg-amber-400/5 mb-2">
              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-200/80 text-xs leading-relaxed">
                <strong className="text-amber-300 font-semibold">Información sobre alérgenos</strong> —
                Si padece alguna alergia o intolerancia alimentaria, informe a nuestro personal antes de realizar su pedido.
                La información sobre los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011) se indica en cada plato con los iconos correspondientes.
                Nuestros platos se elaboran en cocinas donde pueden estar presentes trazas de los alérgenos indicados.
              </p>
            </div>
          </AnimateOnScroll>

          {/* Leyenda de alérgenos */}
          <AnimateOnScroll animation="fade-up">
            <div className="flex flex-wrap gap-2 py-4">
              {Object.entries(ALLERGENS).map(([id, { label, emoji }]) => (
                <span key={id} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-carbon-800/60 border border-carbon-700 text-cream-400">
                  <span className="text-sm">{emoji}</span> {label}
                </span>
              ))}
            </div>
          </AnimateOnScroll>

          {categories.map((cat, idx) => (
            <section
              key={cat.id}
              id={cat.slug}
              className={`py-16 ${idx > 0 ? "border-t border-carbon-800" : ""}`}
            >
              {/* Category header */}
              <AnimateOnScroll animation="fade-up" className="mb-12">
                <div className="flex items-center gap-5">
                  <div className="h-px flex-1 bg-gradient-to-r from-carbon-700 to-transparent" />
                  <div className="text-center px-2">
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-cream-50 tracking-[0.08em]">
                      {cat.name}
                    </h2>
                    <div className="mt-2 h-px w-8 bg-gold-400/50 mx-auto" />
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-carbon-700 to-transparent" />
                </div>
              </AnimateOnScroll>

              {cat.dishes.length === 0 ? (
                <p className="text-cream-400 text-center italic">
                  Próximamente novedades en esta categoría.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.dishes.map((dish, di) => (
                    <AnimateOnScroll key={dish.id} animation="fade-up" delay={di * 80}>
                      <div className="card-hover img-zoom group flex gap-4 p-5 rounded-2xl border border-carbon-700 hover:border-gold-400/25 bg-carbon-800/25 h-full">
                        {/* Image */}
                        {dish.image ? (
                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-carbon-700 flex items-center justify-center shrink-0 group-hover:bg-carbon-600 transition-colors duration-500">
                            <UtensilsCrossed size={18} className="text-carbon-500" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-cream-100 font-semibold leading-snug group-hover:text-cream-50 transition-colors">
                                {dish.name}
                              </p>
                              {dish.isDailyMenu && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-gold-400/12 border border-gold-400/30 text-gold-400 text-[10px] tracking-widest uppercase rounded font-medium">
                                  Menú del día
                                </span>
                              )}
                            </div>
                            <span className="text-gold-400 font-bold text-base font-display shrink-0">
                              {dish.price.toFixed(2)}€
                            </span>
                          </div>
                          {dish.description && (
                            <p className="text-cream-400 text-sm mt-2 leading-relaxed">
                              {dish.description}
                            </p>
                          )}
                          {/* Alérgenos del plato */}
                          {dish.allergens && dish.allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {dish.allergens.map((a) => {
                                const info = ALLERGENS[a];
                                return info ? (
                                  <span
                                    key={a}
                                    title={info.label}
                                    className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300/80"
                                  >
                                    <span className="text-xs">{info.emoji}</span>
                                    {info.label}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Pie legal */}
          <div className="border-t border-carbon-800 pt-10 pb-4">
            <p className="text-cream-400/40 text-xs text-center leading-relaxed">
              Información de alérgenos conforme al Reglamento (UE) 1169/2011 y el Real Decreto 126/2015.
              Para más información o si tiene dudas sobre los ingredientes de algún plato, consulte a nuestro personal.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
