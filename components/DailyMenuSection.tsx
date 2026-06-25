"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import ParallaxSection from "@/components/ParallaxSection";

type Dish = { id: number; name: string; description: string | null; price: number };
type MenuGroup = { name: string; dishes: Dish[] };

type Props = {
  initialImage: string | null;
  initialMenu: MenuGroup[];
};

const DAILY_IMG = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80";

export default function DailyMenuSection({ initialImage, initialMenu }: Props) {
  const [image, setImage] = useState(initialImage);
  const [menu, setMenu] = useState(initialMenu);

  // Re-fetch on every page load — bypasses ISR/CDN cache so updates are instant.
  useEffect(() => {
    fetch("/api/site/daily-menu", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setImage(data.image ?? null);
        setMenu(data.menu ?? []);
      })
      .catch(() => {});
  }, []);

  if (!image && menu.length === 0) return null;

  return (
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

        {image ? (
          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute -top-3 -left-3 w-8 h-8 border-l-2 border-t-2 border-gold-400/50 rounded-tl-sm pointer-events-none" />
              <div className="absolute -top-3 -right-3 w-8 h-8 border-r-2 border-t-2 border-gold-400/50 rounded-tr-sm pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-8 h-8 border-l-2 border-b-2 border-gold-400/50 rounded-bl-sm pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-r-2 border-b-2 border-gold-400/50 rounded-br-sm pointer-events-none" />
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Menú del día" className="w-full h-auto object-cover" />
              </div>
            </div>
          </AnimateOnScroll>
        ) : (
          <div className="space-y-8">
            {menu.map((group, gi) => (
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
  );
}
