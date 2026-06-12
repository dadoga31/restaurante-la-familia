"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search, Filter, Check, X, RotateCcw, Trash2,
  CalendarDays, Users, ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Reservation = {
  id: number; name: string; email: string; phone: string;
  date: string; time: string; guests: number;
  specialRequest: string | null; status: string; confirmCode: string;
  createdAt: string;
};

const STATUSES = ["", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
const STATUS_LABELS: Record<string, string> = {
  "": "Todos", PENDING: "Pendiente", CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada", COMPLETED: "Completada",
};
const STATUS_CLASS: Record<string, string> = {
  PENDING: "badge-pending", CONFIRMED: "badge-confirmed",
  CANCELLED: "badge-cancelled", COMPLETED: "badge-completed",
};

function formatDate(dateStr: string) {
  try {
    return format(new Date(dateStr + "T12:00:00"), "EEE d MMM yyyy", { locale: es });
  } catch { return dateStr; }
}

export default function AdminReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateFilter) params.set("date", dateFilter);
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/reservas?${params}`);
    const data = await res.json();
    setReservations(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [dateFilter, statusFilter]);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    await fetch(`/api/reservas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setUpdating(null);
  };

  const deleteReservation = async (id: number) => {
    if (!confirm("¿Eliminar esta reserva permanentemente?")) return;
    await fetch(`/api/reservas/${id}`, { method: "DELETE" });
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = reservations.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.confirmCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-cream-50 flex items-center gap-2">
            <CalendarDays size={24} className="text-gold-400" /> Gestión de Reservas
          </h1>
          <p className="text-cream-400 text-sm mt-1">{filtered.length} reservas encontradas</p>
        </div>
        <button onClick={fetchReservations}
          className="flex items-center gap-2 px-4 py-2 border border-carbon-600 text-cream-300 hover:text-cream-50 text-sm rounded-lg transition-all">
          <RotateCcw size={15} /> Actualizar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400/50" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o código..."
            className="w-full bg-carbon-800 border border-carbon-600 focus:border-gold-400 text-cream-100 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none transition-all placeholder:text-cream-400/30"
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400/50" />
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-carbon-800 border border-carbon-600 focus:border-gold-400 text-cream-100 rounded-lg pl-9 pr-8 py-2.5 text-sm outline-none transition-all appearance-none"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400/50 pointer-events-none" />
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2 bg-carbon-800 border border-carbon-600 rounded-lg px-3 py-2.5 overflow-hidden transition-all focus-within:border-gold-400">
          <CalendarDays size={15} className="text-cream-400/50 shrink-0" />
          <input
            type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
            className="w-full min-w-0 bg-transparent text-cream-100 text-sm outline-none border-none"
          />
        </div>
        {(dateFilter || statusFilter) && (
          <button onClick={() => { setDateFilter(""); setStatusFilter(""); }}
            className="w-full sm:w-auto px-4 py-2.5 border border-carbon-600 text-cream-400 hover:text-cream-100 text-sm rounded-lg transition-all">
            Limpiar
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="h-16 skeleton rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-carbon-700">
          <CalendarDays size={40} className="text-cream-400/20 mx-auto mb-4" />
          <p className="text-cream-400">No se encontraron reservas</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className={`rounded-xl border border-carbon-700 bg-carbon-800/30 overflow-hidden ${r.status === "CANCELLED" ? "opacity-60" : ""}`}>
                <div className="p-4 space-y-3">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-gold-400 font-bold font-display text-lg">{r.time}</span>
                      <p className="text-cream-400 text-xs capitalize mt-0.5">{formatDate(r.date)}</p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${STATUS_CLASS[r.status]}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                  {/* Client */}
                  <div>
                    <p className="text-cream-100 font-medium">{r.name}</p>
                    <p className="text-cream-400 text-xs">{r.email}</p>
                    <p className="text-cream-400 text-xs">{r.phone}</p>
                  </div>
                  {/* Meta row */}
                  <div className="flex items-center gap-4 text-xs text-cream-400">
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {r.guests} personas
                    </span>
                    <span className="font-display tracking-widest ml-auto">{r.confirmCode}</span>
                  </div>
                  {r.specialRequest && (
                    <p className="text-cream-400 text-xs bg-carbon-700/40 rounded-lg px-3 py-2 line-clamp-2">{r.specialRequest}</p>
                  )}
                </div>
                {/* Actions */}
                <div className="flex border-t border-carbon-700">
                  {r.status === "PENDING" && (
                    <button onClick={() => updateStatus(r.id, "CONFIRMED")} disabled={updating === r.id}
                      className="flex-1 py-3 bg-success/10 hover:bg-success/20 text-success text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50">
                      <Check size={14} /> Confirmar
                    </button>
                  )}
                  {r.status === "CONFIRMED" && (
                    <button onClick={() => updateStatus(r.id, "COMPLETED")} disabled={updating === r.id}
                      className="flex-1 py-3 bg-carbon-700 hover:bg-carbon-600 text-cream-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50">
                      <Check size={14} /> Completar
                    </button>
                  )}
                  {r.status === "CANCELLED" && (
                    <button onClick={() => updateStatus(r.id, "PENDING")} disabled={updating === r.id}
                      className="flex-1 py-3 bg-carbon-700 hover:bg-carbon-600 text-cream-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50">
                      <RotateCcw size={14} /> Reactivar
                    </button>
                  )}
                  {r.status !== "CANCELLED" && (
                    <button onClick={() => updateStatus(r.id, "CANCELLED")} disabled={updating === r.id}
                      className="flex-1 py-3 bg-danger/10 hover:bg-danger/20 text-danger text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 border-l border-carbon-700">
                      <X size={14} /> Cancelar
                    </button>
                  )}
                  <button onClick={() => deleteReservation(r.id)}
                    className="px-4 py-3 hover:bg-danger/10 text-cream-400/40 hover:text-danger transition-all border-l border-carbon-700">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden lg:block rounded-xl border border-carbon-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-carbon-700 bg-carbon-800/60">
                    {["Fecha / Hora", "Cliente", "Personas", "Estado", "Código", "Petición", "Acciones"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-cream-400 tracking-wider uppercase whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-carbon-700/50">
                  {filtered.map((r) => (
                    <tr key={r.id} className={`hover:bg-carbon-800/30 transition-colors ${r.status === "CANCELLED" ? "opacity-60" : ""}`}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-gold-400 font-semibold font-display">{r.time}</p>
                        <p className="text-cream-400 text-xs capitalize">{formatDate(r.date)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-cream-100 font-medium whitespace-nowrap">{r.name}</p>
                        <p className="text-cream-400 text-xs">{r.email}</p>
                        <p className="text-cream-400 text-xs">{r.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-cream-200 whitespace-nowrap">
                          <Users size={14} className="text-cream-400" /> {r.guests}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_CLASS[r.status]}`}>
                          {STATUS_LABELS[r.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-display text-cream-400 tracking-widest text-xs font-medium">
                        {r.confirmCode}
                      </td>
                      <td className="px-4 py-3 max-w-[160px]">
                        <p className="text-cream-400 text-xs truncate">{r.specialRequest || "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {r.status === "PENDING" && (
                            <button onClick={() => updateStatus(r.id, "CONFIRMED")} disabled={updating === r.id}
                              title="Confirmar" className="p-1.5 rounded-lg bg-success/10 hover:bg-success/20 text-success transition-all disabled:opacity-50">
                              <Check size={15} />
                            </button>
                          )}
                          {r.status === "CONFIRMED" && (
                            <button onClick={() => updateStatus(r.id, "COMPLETED")} disabled={updating === r.id}
                              title="Completar" className="p-1.5 rounded-lg bg-carbon-700 hover:bg-carbon-600 text-cream-300 transition-all disabled:opacity-50">
                              <Check size={15} />
                            </button>
                          )}
                          {r.status !== "CANCELLED" && (
                            <button onClick={() => updateStatus(r.id, "CANCELLED")} disabled={updating === r.id}
                              title="Cancelar" className="p-1.5 rounded-lg bg-danger/10 hover:bg-danger/20 text-danger transition-all disabled:opacity-50">
                              <X size={15} />
                            </button>
                          )}
                          {r.status === "CANCELLED" && (
                            <button onClick={() => updateStatus(r.id, "PENDING")} disabled={updating === r.id}
                              title="Reactivar" className="p-1.5 rounded-lg bg-carbon-700 hover:bg-carbon-600 text-cream-300 transition-all disabled:opacity-50">
                              <RotateCcw size={15} />
                            </button>
                          )}
                          <button onClick={() => deleteReservation(r.id)} title="Eliminar"
                            className="p-1.5 rounded-lg hover:bg-danger/10 text-cream-400/50 hover:text-danger transition-all">
                            <Trash2 size={15} />
                          </button>
                        </div>
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
  );
}
