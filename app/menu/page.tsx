import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import ParallaxSection from "@/components/ParallaxSection";
import AmbientGlow from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { UtensilsCrossed } from "lucide-react";

const HEADER_IMG = "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1920&q=80";

async function getMenu() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      dishes: { where: { isActive: true }, orderBy: { order: "asc" } },
    },
  });
}

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const categories = await getMenu();

  return (
    <>
      <Navbar />

      {/* Header con foto de fondo */}
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

      {/* Menu categories */}
      <main className="flex-1 bg-carbon-950 pb-28 relative z-10">
        <AmbientGlow />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {categories.map((cat, idx) => (
            <section
              key={cat.id}
              id={cat.slug}
              className={`py-20 ${idx > 0 ? "border-t border-carbon-800" : ""}`}
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
                        </div>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
