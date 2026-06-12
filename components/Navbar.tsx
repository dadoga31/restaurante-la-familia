"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Carta" },
  { href: "/reservas", label: "Reservar" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => setProgress(Math.min(window.scrollY / 160, 1));
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: `rgba(10,8,6,${progress * 0.93})`,
        backdropFilter: `blur(${progress * 14}px)`,
        WebkitBackdropFilter: `blur(${progress * 14}px)`,
        borderBottom: `1px solid rgba(42,42,42,${progress * 0.85})`,
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-xl tracking-[0.15em] text-cream-50 uppercase"
        >
          La <span className="text-gold-400">Familia</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`nav-link text-sm font-medium tracking-wider uppercase transition-colors ${
                  pathname === href
                    ? "text-gold-400 active"
                    : "text-cream-300 hover:text-cream-50"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/reservas"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gold-400 hover:bg-gold-300 text-carbon-900 font-semibold text-sm tracking-wider uppercase rounded transition-all duration-200 hover:shadow-lg hover:shadow-gold-400/20"
        >
          Reservar Mesa
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-cream-200 hover:text-gold-400 transition-colors"
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        } bg-carbon-900/98 backdrop-blur-md border-b border-carbon-700`}
      >
        <ul className="flex flex-col px-6 py-4 gap-1">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={`block py-3 text-sm font-medium tracking-wider uppercase border-b border-carbon-700 transition-colors ${
                  pathname === href ? "text-gold-400" : "text-cream-300"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-3">
            <Link
              href="/reservas"
              onClick={() => setOpen(false)}
              className="block text-center py-3 bg-gold-400 hover:bg-gold-300 text-carbon-900 font-bold text-sm tracking-wider uppercase rounded transition-all"
            >
              Reservar Mesa
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
