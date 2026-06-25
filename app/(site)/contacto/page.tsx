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
                    <p><span className="text-cream-200 font-medium">Dirección:</span> C/ Doctor Juan Francisco de Higueras Payo, 45<br />Yuncos, Toledo</p>
                    <p><span className="text-cream-200 font-medium">En coche:</span> A-42 dirección Toledo, salida Yuncos</p>
                    <p><span className="text-cream-200 font-medium">Parking:</span> Aparcamiento gratuito en la puerta</p>
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
                      { href: "tel:+34671091781", icon: <Phone size={14} />, label: "Teléfono", val: "671 091 781" },
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

                  <a
                    href="https://wa.me/34671091781?text=Hola%2C%20me%20gustar%C3%ADa%20hacer%20una%20consulta%20o%20reserva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center gap-3 w-full px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Escríbenos por WhatsApp
                  </a>

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
                      { day: "Lunes",              hours: "Cerrado",        closed: true  },
                      { day: "Martes",             hours: "9:00 – 18:00",   closed: false },
                      { day: "Miércoles",          hours: "9:00 – 18:00",   closed: false },
                      { day: "Jueves",             hours: "9:00 – 00:00",   closed: false },
                      { day: "Viernes",            hours: "9:00 – 00:00",   closed: false },
                      { day: "Sábado",             hours: "9:00 – 00:00",   closed: false },
                      { day: "Domingo",            hours: "9:00 – 18:00",   closed: false },
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
                    src="https://maps.google.com/maps?q=C%2F+Doctor+Juan+Francisco+de+Higueras+Payo+45+Yuncos+Toledo&output=embed"
                    width="100%" height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.25) brightness(0.9)" }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación Restaurante La Familia — Yuncos, Toledo"
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
