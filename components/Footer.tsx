import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Share2, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-carbon-900 border-t border-carbon-700 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <p className="font-display font-bold text-2xl tracking-[0.15em] text-cream-50 uppercase mb-4">
              La <span className="text-gold-400">Familia</span>
            </p>
            <p className="text-cream-400 text-sm leading-relaxed">
              Alta cocina con alma mediterránea. Cada plato es una historia,
              cada visita, un recuerdo.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-2 rounded-full border border-carbon-600 text-cream-400 hover:text-gold-400 hover:border-gold-400 transition-all"
                aria-label="Instagram"
              >
                <Share2 size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-full border border-carbon-600 text-cream-400 hover:text-gold-400 hover:border-gold-400 transition-all"
                aria-label="Facebook"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-cream-100 tracking-wider uppercase text-sm mb-6">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-cream-400 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" />
                <span>Calle Gran Vía 42, Planta 2<br />28013 Madrid</span>
              </li>
              <li className="flex items-center gap-3 text-cream-400 text-sm">
                <Phone size={16} className="shrink-0 text-gold-400" />
                <a href="tel:+34912345678" className="hover:text-cream-100 transition-colors">
                  +34 912 345 678
                </a>
              </li>
              <li className="flex items-center gap-3 text-cream-400 text-sm">
                <Mail size={16} className="shrink-0 text-gold-400" />
                <a href="mailto:hola@lafamilia.es" className="hover:text-cream-100 transition-colors">
                  hola@lafamilia.es
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-display font-semibold text-cream-100 tracking-wider uppercase text-sm mb-6">
              Horario
            </h3>
            <ul className="space-y-2">
              {[
                { day: "Lunes", hours: "Cerrado" },
                { day: "Mar — Vie", hours: "13:00 – 16:00 · 20:00 – 23:30" },
                { day: "Sábado", hours: "13:00 – 16:30 · 20:00 – 00:00" },
                { day: "Domingo", hours: "13:00 – 16:30" },
              ].map(({ day, hours }) => (
                <li key={day} className="flex items-start gap-3 text-sm">
                  <Clock size={14} className="mt-0.5 shrink-0 text-gold-400" />
                  <span>
                    <span className="text-cream-200 font-medium">{day}: </span>
                    <span className={hours === "Cerrado" ? "text-danger" : "text-cream-400"}>{hours}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-carbon-700 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <p>© {new Date().getFullYear()} La Familia Restaurante. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-cream-100 transition-colors">Aviso legal</Link>
            <Link href="#" className="hover:text-cream-100 transition-colors">Privacidad</Link>
            <Link href="/admin/login" className="hover:text-gold-400 transition-colors">Acceso equipo</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
