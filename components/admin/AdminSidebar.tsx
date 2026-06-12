"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, UtensilsCrossed, CalendarDays,
  LogOut, Menu, X, ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/menus", label: "Gestión Carta", icon: UtensilsCrossed, exact: false },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarDays, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-carbon-700">
        <p className="font-display font-bold text-lg tracking-[0.15em] text-cream-50 uppercase">
          La <span className="text-gold-400">Familia</span>
        </p>
        <p className="text-cream-400 text-xs tracking-widest mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
              isActive(href, exact)
                ? "bg-gold-400/15 text-gold-400 border border-gold-400/20"
                : "text-cream-400 hover:text-cream-100 hover:bg-carbon-700/50"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-carbon-700 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream-400 hover:text-cream-100 hover:bg-carbon-700/50 transition-all"
        >
          <ExternalLink size={16} />
          Ver web pública
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream-400 hover:text-danger hover:bg-danger/10 transition-all"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-carbon-900 border-r border-carbon-700 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-carbon-900 border-b border-carbon-700 flex items-center justify-between px-4 h-14">
        <p className="font-display font-bold text-base tracking-widest text-cream-50 uppercase">
          La <span className="text-gold-400">Familia</span>
        </p>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-cream-300 hover:text-gold-400 transition-colors"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-carbon-950/80 backdrop-blur-sm" />
          <aside className="relative w-64 h-full bg-carbon-900 border-r border-carbon-700 flex flex-col pt-14">
            <SidebarContent />
          </aside>
        </div>
      )}

    </>
  );
}
