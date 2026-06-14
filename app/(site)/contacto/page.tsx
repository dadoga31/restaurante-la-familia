import AnimateOnScroll from "@/components/AnimateOnScroll";
import ParallaxSection from "@/components/ParallaxSection";
import AmbientGlow from "@/components/AmbientGlow";
import { MapPin, Phone, Mail, Clock, Share2, Globe } from "lucide-react";

const HEADER_IMG = "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1920&q=80";

export default function ContactoPage() {
  return (
    <>

      {/* Header con foto */}
      <ParallaxSection
        imageUrl={HEADER_IMG}
        overlayOpacity={0.80}
        overlayColor="8,8,8"
        speed={0.15}
        className="pt-36 pb-20 px-6"
      >
        <AnimateOnScroll animation="blur-in" className="text-center">
          <span className="text-gold-400 text-xs tracking-[0.45em] uppercase font-medium">Estamos para atenderte</span>
          <h1 className="font-display font-bold text-5xl sm:text-6xl text-cream-50 mt-3 tracking-wide drop-shadow-2xl">
            Contacto
          </h1>
          <div className="mt-5 h-px w-14 bg-gold-400/60 mx-auto" />
        </AnimateOnScroll>
      </ParallaxSection>

      <main className="flex-1 bg-carbon-950 pb-28 px-6 relative z-10">
        <AmbientGlow />
        <div className="relative z-10 max-w-5xl mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Left column */}
            <div className="space-y-5">
              <AnimateOnScroll animation="fade-right" delay={0}>
                <div className="card-hover p-6 rounded-2xl border border-carbon-700 bg-carbon-800/30">
                  <h2 className="font-display font-semibold text-cream-100 text-sm tracking-widest uppercase mb-5 flex items-center gap-2">
                    <MapPin size={15} className="text-gold-400" /> Cómo llegar
                  </h2>
                  <div className="space-y-3 text-sm text-cream-400 leading-relaxed">
                    <p><span className="text-cream-200 font-medium">Dirección:</span> Calle Gran Vía 42, Planta 2ª<br />28013 Madrid, España</p>
                    <p><span className="text-cream-200 font-medium">Metro:</span> Gran Vía (L1/L5), 2 min a pie</p>
                    <p><span className="text-cream-200 font-medium">Bus:</span> Líneas 1, 2, 74, 146, 147</p>
                    <p><span className="text-cream-200 font-medium">Parking:</span> Parking Callao (5 min)</p>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll animation="fade-right" delay={120}>
                <div className="card-hover p-6 rounded-2xl border border-carbon-700 bg-carbon-800/30">
                  <h2 className="font-display font-semibold text-cream-100 text-sm tracking-widest uppercase mb-5 flex items-center gap-2">
                    <Phone size={15} className="text-gold-400" /> Contacto directo
                  </h2>
                  <div className="space-y-4">
                    {[
                      { href: "tel:+34912345678", icon: <Phone size={14} />, label: "Teléfono", val: "+34 912 345 678" },
                      { href: "mailto:hola@lafamilia.es", icon: <Mail size={14} />, label: "Email", val: "hola@lafamilia.es" },
                    ].map(({ href, icon, label, val }) => (
                      <a key={label} href={href}
                        className="flex items-center gap-3 text-cream-300 hover:text-gold-400 transition-colors group">
                        <div className="w-9 h-9 rounded-full border border-carbon-600 group-hover:border-gold-400/40 group-hover:bg-gold-400/10 flex items-center justify-center transition-all duration-300">
                          {icon}
                        </div>
                        <div>
                          <p className="text-[10px] text-cream-400 uppercase tracking-widest">{label}</p>
                          <p className="font-medium text-sm">{val}</p>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-carbon-700">
                    <p className="text-[10px] text-cream-400 uppercase tracking-widest mb-3">Redes sociales</p>
                    <div className="flex gap-3">
                      {[
                        { icon: <Share2 size={15} />, label: "Instagram" },
                        { icon: <Globe size={15} />, label: "Facebook" },
                      ].map(({ icon, label }) => (
                        <a key={label} href="#"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-carbon-600 hover:border-gold-400/40 hover:bg-gold-400/5 text-cream-300 hover:text-gold-400 text-sm transition-all duration-300">
                          {icon} {label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll animation="fade-right" delay={240}>
                <div className="card-hover p-6 rounded-2xl border border-carbon-700 bg-carbon-800/30">
                  <h2 className="font-display font-semibold text-cream-100 text-sm tracking-widest uppercase mb-5 flex items-center gap-2">
                    <Clock size={15} className="text-gold-400" /> Horario
                  </h2>
                  <div className="space-y-2.5">
                    {[
                      { day: "Lunes", hours: "Cerrado", closed: true },
                      { day: "Martes — Viernes", hours: "13:00 – 16:00 · 20:00 – 23:30", closed: false },
                      { day: "Sábado", hours: "13:00 – 16:30 · 20:00 – 00:00", closed: false },
                      { day: "Domingo", hours: "13:00 – 16:30", closed: false },
                    ].map(({ day, hours, closed }) => (
                      <div key={day} className="flex justify-between items-center py-2 border-b border-carbon-700 last:border-0 text-sm">
                        <span className="text-cream-200 font-medium">{day}</span>
                        <span className={closed ? "text-danger font-semibold" : "text-cream-400"}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right: Map + CTA */}
            <div className="space-y-5">
              <AnimateOnScroll animation="fade-left" delay={80}>
                <div className="rounded-2xl overflow-hidden border border-carbon-700 h-[400px] lg:h-[480px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.406395785174!2d-3.7073695!3d40.4200166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422880e3dcab61%3A0x9ec8a1e8c73b1523!2sGran%20V%C3%ADa%2C%2042%2C%20Madrid!5e0!3m2!1ses!2ses!4v1234567890"
                    width="100%" height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.25) brightness(0.9)" }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación La Familia Restaurante"
                  />
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll animation="fade-left" delay={200}>
                <div className="p-7 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/8 to-transparent text-center">
                  <p className="text-cream-200 font-semibold font-display mb-2">¿Prefieres reservar online?</p>
                  <p className="text-cream-400 text-sm mb-5">Confirmación inmediata, sin esperas.</p>
                  <a href="/reservas"
                    className="btn-gold-pulse inline-flex items-center gap-2 px-7 py-3 bg-gold-400 hover:bg-gold-300 text-carbon-900 font-bold text-sm tracking-wider uppercase rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                    Reservar Mesa
                  </a>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </main>

    </>
  );
}
