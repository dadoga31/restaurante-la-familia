import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import ParallaxSection from "@/components/ParallaxSection";
import AmbientGlow from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { ChevronDown, UtensilsCrossed, Calendar, MapPin, Star } from "lucide-react";

// Unsplash photo IDs – swap for real restaurant photos any time
const HERO_IMG    = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80";
const DAILY_IMG   = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80";
const CTA_IMG     = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80";

async function getDailyMenu() {
  const dishes = await prisma.dish.findMany({
    where: { isDailyMenu: true, isActive: true },
    include: { category: true },
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
  });
  const grouped = new Map<number, { name: string; dishes: typeof dishes }>();
  for (const dish of dishes) {
    const key = dish.categoryId;
    if (!grouped.has(key)) grouped.set(key, { name: dish.category.name, dishes: [] });
    grouped.get(key)!.dishes.push(dish);
  }
  return Array.from(grouped.values());
}

async function getDailyMenuImage(): Promise<string | null> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "daily_menu_image" } });
    return setting?.value || null;
  } catch {
    return null;
  }
}

export const revalidate = 300;

export default async function HomePage() {
  const [dailyMenu, dailyMenuImage] = await Promise.all([getDailyMenu(), getDailyMenuImage()]);

  return (
    <>

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Parallax photo background */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMG}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-110"
            style={{ objectPosition: "center 40%" }}
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-carbon-950/60 via-carbon-950/55 to-carbon-950" />
          {/* Side vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-950/40 via-transparent to-carbon-950/40" />
          {/* Gold ambient orb */}
          <div
            className="orb absolute w-[600px] h-[600px] bg-gold-500/8 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3"
            style={{ "--duration": "14s" } as React.CSSProperties}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="hero-badge flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-gold-400/70" />
            <span className="text-gold-400 text-xs tracking-[0.45em] uppercase font-medium">
              Alta Cocina · Madrid
            </span>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-gold-400/70" />
          </div>

          {/* Main titles */}
          <h1 className="hero-title-1 font-display font-black text-7xl sm:text-8xl md:text-[9rem] leading-none tracking-[0.06em] uppercase text-cream-50 drop-shadow-2xl">
            La
          </h1>
          <h1 className="hero-title-2 font-display font-black text-7xl sm:text-8xl md:text-[9rem] leading-none tracking-[0.06em] uppercase text-gold-400 drop-shadow-2xl">
            Familia
          </h1>
          <p className="hero-sub font-display font-light text-base sm:text-xl text-cream-300 tracking-[0.3em] uppercase mt-3 mb-6">
            — Restaurante —
          </p>

          <p className="hero-desc text-cream-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10">
            Una experiencia gastronómica donde cada plato es un homenaje
            a los sabores mediterráneos y la tradición familiar.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/reservas"
              className="btn-gold-pulse inline-flex items-center gap-3 px-8 py-4 bg-gold-400 hover:bg-gold-300 text-carbon-900 font-bold text-sm tracking-[0.2em] uppercase rounded transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              <Calendar size={17} />
              Reservar Mesa
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 px-8 py-4 border border-cream-100/20 hover:border-gold-400/60 backdrop-blur-sm bg-carbon-950/20 text-cream-200 hover:text-gold-400 font-medium text-sm tracking-[0.2em] uppercase rounded transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              <UtensilsCrossed size={17} />
              Ver la Carta
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-8 left-1/2 flex flex-col items-center gap-1.5 text-cream-400/40">
          <span className="text-[10px] tracking-[0.35em] uppercase">Descubrir</span>
          <ChevronDown size={15} />
        </div>
      </section>

      {/* ══════════════════ MENÚ DEL DÍA ══════════════════ */}
      {(dailyMenu.length > 0 || !!dailyMenuImage) && (
        <ParallaxSection
          imageUrl={DAILY_IMG}
          overlayOpacity={0.88}
          overlayColor="10,8,6"
          speed={0.2}
          className="py-28 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <AnimateOnScroll animation="fade-up" className="text-center mb-14">
              <span className="text-gold-400 text-xs tracking-[0.45em] uppercase font-medium">Hoy en cocina</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-cream-50 mt-3 tracking-wide">
                Menú del Día
              </h2>
              <div className="mt-5 h-px w-14 bg-gold-400/50 mx-auto line-reveal" />
            </AnimateOnScroll>

            {dailyMenuImage ? (
              /* ── Foto del menú del día ── */
              <AnimateOnScroll animation="fade-up" delay={100}>
                <div className="relative max-w-2xl mx-auto">
                  {/* Corner accents */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 border-l-2 border-t-2 border-gold-400/50 rounded-tl-sm pointer-events-none" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 border-r-2 border-t-2 border-gold-400/50 rounded-tr-sm pointer-events-none" />
                  <div className="absolute -bottom-3 -left-3 w-8 h-8 border-l-2 border-b-2 border-gold-400/50 rounded-bl-sm pointer-events-none" />
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 border-r-2 border-b-2 border-gold-400/50 rounded-br-sm pointer-events-none" />
                  {/* Photo */}
                  <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dailyMenuImage}
                      alt="Menú del día"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </AnimateOnScroll>
            ) : (
              /* ── Tarjetas de platos (fallback) ── */
              <div className="space-y-8">
                {dailyMenu.map((group, gi) => (
                  <div key={group.name}>
                    {gi > 0 && (
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-white/10" />
                        <div className="w-1 h-1 rounded-full bg-gold-400/40" />
                        <div className="flex-1 h-px bg-white/10" />
                      </div>
                    )}
                    <AnimateOnScroll animation="fade-up" delay={gi * 80} className="mb-6 text-center">
                      <p className="font-display text-base tracking-[0.35em] uppercase font-semibold text-gold-400">
                        {group.name}
                      </p>
                      <div className="mt-2.5 h-px w-10 bg-gold-400/40 mx-auto" />
                    </AnimateOnScroll>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:[&>*:last-child:nth-child(odd)]:col-span-2 sm:[&>*:last-child:nth-child(odd)]:max-w-[calc(50%-0.5rem)] sm:[&>*:last-child:nth-child(odd)]:mx-auto">
                      {group.dishes.map((dish, i) => (
                        <AnimateOnScroll key={dish.id} animation="fade-up" delay={gi * 80 + i * 80}>
                          <div className="card-hover flex items-start justify-between gap-4 p-5 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm hover:border-gold-400/30">
                            <div className="flex-1 min-w-0">
                              <p className="text-cream-100 font-semibold">{dish.name}</p>
                              {dish.description && (
                                <p className="text-cream-400 text-sm mt-1 leading-relaxed line-clamp-2">
                                  {dish.description}
                                </p>
                              )}
                            </div>
                            <span className="text-gold-400 font-bold text-sm shrink-0 font-display">
                              {dish.price.toFixed(2)}€
                            </span>
                          </div>
                        </AnimateOnScroll>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <AnimateOnScroll animation="fade-up" delay={400} className="text-center mt-10">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm tracking-wider uppercase font-medium border-b border-gold-400/30 hover:border-gold-300/60 pb-0.5 transition-all"
              >
                Ver carta completa →
              </Link>
            </AnimateOnScroll>
          </div>
        </ParallaxSection>
      )}

      {/* ══════════════════ EXPERIENCIA ══════════════════ */}
      <section className="py-28 px-6 bg-carbon-950 relative z-10">
        <AmbientGlow />
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimateOnScroll animation="fade-up" className="text-center mb-16">
            <span className="text-gold-400 text-xs tracking-[0.45em] uppercase font-medium">Por qué elegirnos</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-cream-50 mt-3 tracking-wide">
              La Experiencia La Familia
            </h2>
            <div className="mt-5 h-px w-14 bg-gold-400/50 mx-auto" />
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <UtensilsCrossed size={26} />,
                title: "Cocina de Mercado",
                text: "Ingredientes seleccionados cada mañana en los mejores mercados de Madrid. Temporada en cada plato.",
              },
              {
                icon: <Star size={26} />,
                title: "Experiencia Premium",
                text: "Un ambiente íntimo donde cada detalle — desde la vajilla hasta la música — es parte del menú.",
              },
              {
                icon: <MapPin size={26} />,
                title: "Corazón de Madrid",
                text: "En plena Gran Vía. Fácil acceso, aparcamiento cercano y transporte a un paso.",
              },
            ].map(({ icon, title, text }, i) => (
              <AnimateOnScroll key={title} animation="fade-up" delay={i * 120}>
                <div className="card-hover group p-8 rounded-2xl border border-carbon-700 hover:border-gold-400/25 bg-carbon-800/30 text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gold-400/25 text-gold-400 mb-6 group-hover:bg-gold-400/10 transition-all duration-500">
                    {icon}
                  </div>
                  <h3 className="font-display font-semibold text-cream-100 text-lg mb-3">{title}</h3>
                  <p className="text-cream-400 text-sm leading-relaxed">{text}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA RESERVA (foto de fondo) ══════════════════ */}
      <ParallaxSection
        imageUrl={CTA_IMG}
        overlayOpacity={0.82}
        overlayColor="8,8,8"
        speed={0.18}
        className="py-32 px-6"
      >
        <div className="max-w-2xl mx-auto text-center">
          <AnimateOnScroll animation="blur-in">
            <span className="text-gold-400 text-xs tracking-[0.45em] uppercase font-medium">
              ¿Listo para vivir la experiencia?
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-cream-50 mt-4 mb-6 tracking-wide leading-tight">
              Reserva Tu Mesa
            </h2>
            <p className="text-cream-300 mb-10 leading-relaxed max-w-md mx-auto">
              Plazas limitadas para garantizar la calidad de cada servicio.
              Reserva con antelación y asegura tu experiencia.
            </p>
            <Link
              href="/reservas"
              className="btn-gold-pulse inline-flex items-center gap-3 px-10 py-4 bg-gold-400 hover:bg-gold-300 text-carbon-900 font-bold text-sm tracking-[0.2em] uppercase rounded transition-all duration-300 hover:-translate-y-0.5"
            >
              <Calendar size={18} />
              Hacer una Reserva
            </Link>
          </AnimateOnScroll>
        </div>
      </ParallaxSection>

    </>
  );
}
