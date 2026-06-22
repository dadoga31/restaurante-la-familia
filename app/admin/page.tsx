import { prisma } from "@/lib/prisma";
import { CalendarDays, Users, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente", CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada", COMPLETED: "Completada",
};
const STATUS_CLASS: Record<string, string> = {
  PENDING: "badge-pending", CONFIRMED: "badge-confirmed",
  CANCELLED: "badge-cancelled", COMPLETED: "badge-completed",
};

export const revalidate = 30;

export default async function AdminDashboard() {
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const [todayReservations, pending, confirmed, allReservations, totalDishes] =
    await Promise.all([
      prisma.reservation.findMany({
        where: { date: todayStr },
        orderBy: { time: "asc" },
      }),
      prisma.reservation.count({ where: { status: "PENDING" } }),
      prisma.reservation.count({ where: { status: "CONFIRMED", date: todayStr } }),
      prisma.reservation.count(),
      prisma.dish.count({ where: { isActive: true } }),
    ]);

  const todayGuests = todayReservations
    .filter((r) => r.status !== "CANCELLED")
    .reduce((s, r) => s + r.guests, 0);

  const stats = [
    { label: "Reservas hoy", value: todayReservations.length, icon: CalendarDays, sub: `${todayGuests} comensales esperados` },
    { label: "Pendientes de confirmar", value: pending, icon: Clock, sub: "Requieren acción", alert: pending > 0 },
    { label: "Confirmadas hoy", value: confirmed, icon: CheckCircle, sub: "Listas para hoy" },
    { label: "Platos activos", value: totalDishes, icon: TrendingUp, sub: `${allReservations} reservas en total` },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-cream-50">Dashboard</h1>
        <p className="text-cream-400 text-sm mt-1">
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, sub, alert }) => (
          <div
            key={label}
            className={`p-5 rounded-xl border ${
              alert ? "border-gold-400/30 bg-gold-400/5" : "border-carbon-700 bg-carbon-800/30"
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
              alert ? "bg-gold-400/20 text-gold-400" : "bg-carbon-700 text-cream-300"
            }`}>
              <Icon size={18} />
            </div>
            <p className={`font-display font-bold text-3xl ${alert ? "text-gold-400" : "text-cream-50"}`}>
              {value}
            </p>
            <p className="text-cream-200 text-sm font-medium mt-1">{label}</p>
            <p className="text-cream-400 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Today reservations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-cream-100 text-lg flex items-center gap-2">
            <CalendarDays size={20} className="text-gold-400" />
            Reservas de Hoy
          </h2>
          <Link href="/admin/reservas"
            className="text-gold-400 hover:text-gold-300 text-sm transition-colors">
            Ver todas →
          </Link>
        </div>

        {todayReservations.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-carbon-700 bg-carbon-800/20">
            <CalendarDays size={32} className="text-cream-400/30 mx-auto mb-3" />
            <p className="text-cream-400">Sin reservas para hoy</p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="lg:hidden space-y-3">
              {todayReservations.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-carbon-700 bg-carbon-800/20 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-gold-400 font-bold font-display text-base">{r.time}</span>
                      <p className="text-cream-100 font-medium text-sm mt-0.5">{r.name}</p>
                      <p className="text-cream-400 text-xs">{r.email}</p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${STATUS_CLASS[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-cream-400 border-t border-carbon-700 pt-2">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {r.guests} personas
                    </span>
                    <span>{r.phone}</span>
                    <span className="font-display tracking-widest ml-auto">{r.confirmCode}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden lg:block rounded-xl border border-carbon-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-carbon-700 bg-carbon-800/50">
                      {["Hora", "Cliente", "Personas", "Tel.", "Estado", "Código"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-cream-400 tracking-wider uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-carbon-700">
                    {todayReservations.map((r) => (
                      <tr key={r.id} className="hover:bg-carbon-800/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gold-400 font-display">{r.time}</td>
                        <td className="px-4 py-3">
                          <p className="text-cream-100 font-medium">{r.name}</p>
                          <p className="text-cream-400 text-xs">{r.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-cream-200">
                            <Users size={14} className="text-cream-400" /> {r.guests}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-cream-300">{r.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CLASS[r.status]}`}>
                            {STATUS_LABELS[r.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-display text-cream-400 font-medium tracking-widest text-xs">
                          {r.confirmCode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/menus"
          className="p-5 rounded-xl border border-carbon-700 hover:border-gold-400/30 bg-carbon-800/20 flex items-center gap-4 group transition-all">
          <div className="w-10 h-10 rounded-lg bg-carbon-700 group-hover:bg-gold-400/15 flex items-center justify-center text-cream-400 group-hover:text-gold-400 transition-all">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-cream-100 font-semibold">Gestionar Carta</p>
            <p className="text-cream-400 text-sm">Añadir o editar platos</p>
          </div>
        </Link>
        <Link href="/admin/reservas"
          className="p-5 rounded-xl border border-carbon-700 hover:border-gold-400/30 bg-carbon-800/20 flex items-center gap-4 group transition-all">
          <div className="w-10 h-10 rounded-lg bg-carbon-700 group-hover:bg-gold-400/15 flex items-center justify-center text-cream-400 group-hover:text-gold-400 transition-all">
            <CalendarDays size={20} />
          </div>
          <div>
            <p className="text-cream-100 font-semibold">Gestionar Reservas</p>
            <p className="text-cream-400 text-sm">Ver y cambiar estados</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
