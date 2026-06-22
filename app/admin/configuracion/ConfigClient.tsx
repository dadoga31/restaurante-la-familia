"use client";

import { useState } from "react";
import { Settings, Users, CalendarX, Plus, Trash2, Info, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const TIME_SLOTS = [
  "13:00","13:30","14:00","14:30","15:00","15:30",
  "20:00","20:30","21:00","21:30","22:00","22:30",
];

type BlockedSlot = { id: number; date: string; time: string | null };
type Props = { initialMaxGuests: string; initialBlockedSlots: BlockedSlot[] };

function formatDate(d: string) {
  try { return format(new Date(d + "T12:00:00"), "EEE d MMM yyyy", { locale: es }); }
  catch { return d; }
}

export default function ConfigClient({ initialMaxGuests, initialBlockedSlots }: Props) {
  const [maxGuests, setMaxGuests] = useState(initialMaxGuests);
  const [savingMax, setSavingMax] = useState(false);
  const [savedMax, setSavedMax] = useState(false);

  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>(initialBlockedSlots);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState(""); // empty = whole day
  const [addingBlock, setAddingBlock] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const saveMaxGuests = async () => {
    setSavingMax(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "max_guests_per_slot", value: maxGuests }),
    });
    setSavingMax(false);
    setSavedMax(true);
    setTimeout(() => setSavedMax(false), 2000);
  };

  const addBlock = async () => {
    if (!newDate) return;
    setAddingBlock(true);
    const res = await fetch("/api/admin/blocked-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, time: newTime || null }),
    });
    if (res.ok) {
      const slot = await res.json();
      setBlockedSlots((prev) => [...prev, slot].sort((a, b) => a.date.localeCompare(b.date)));
      setNewDate("");
      setNewTime("");
    }
    setAddingBlock(false);
  };

  const removeBlock = async (id: number) => {
    setDeletingId(id);
    await fetch(`/api/admin/blocked-slots/${id}`, { method: "DELETE" });
    setBlockedSlots((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
  };

  const inputClass = "bg-carbon-700 border border-carbon-600 focus:border-gold-400 text-cream-100 rounded-lg px-3 py-2.5 text-sm outline-none transition-all";

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-cream-50 flex items-center gap-2">
          <Settings size={22} className="text-gold-400" /> Configuración
        </h1>
        <p className="text-cream-400 text-sm mt-1">Gestión del aforo y disponibilidad</p>
      </div>

      {/* ── CÓMO USAR EL SISTEMA ── */}
      <div className="p-6 rounded-2xl border border-gold-400/20 bg-gold-400/5 space-y-4">
        <h2 className="font-display font-semibold text-gold-400 flex items-center gap-2 text-sm tracking-wider uppercase">
          <Info size={16} /> Cómo funciona el sistema de reservas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-cream-300 leading-relaxed">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-cream-100 mb-1">1. El cliente reserva online</p>
              <p className="text-cream-400 text-xs">El sistema comprueba automáticamente si hay plaza según el aforo que configures. Si no hay hueco, el cliente ve el horario en gris y un mensaje para llamar al restaurante.</p>
            </div>
            <div>
              <p className="font-semibold text-cream-100 mb-1">2. La reserva entra como PENDIENTE</p>
              <p className="text-cream-400 text-xs">Cada nueva reserva ocupa plaza inmediatamente para evitar sobreventas, aunque quede en estado pendiente.</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-cream-100 mb-1">3. Tú confirmas o cancelas</p>
              <p className="text-cream-400 text-xs">En la sección <strong className="text-cream-200">Reservas</strong> puedes confirmar o cancelar cada solicitud. Al cancelar, esa plaza queda libre automáticamente para otros clientes.</p>
            </div>
            <div>
              <p className="font-semibold text-cream-100 mb-1">4. Bloquea días festivos o eventos</p>
              <p className="text-cream-400 text-xs">Usa la sección de abajo para bloquear días completos (vacaciones, festivos) o franjas horarias concretas (evento privado en comida, etc.). Los lunes están cerrados automáticamente.</p>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-gold-400/15">
          <p className="text-xs text-gold-400/70">
            ⚠️ <strong>Importante:</strong> procesa las reservas pendientes con regularidad. Una reserva cancelada tarde libera la plaza, pero si hay muchas pendientes sin gestionar el aforo puede parecer lleno cuando no lo está.
          </p>
        </div>
      </div>

      {/* ── AFORO MÁXIMO ── */}
      <div className="p-6 rounded-2xl border border-carbon-700 bg-carbon-800/30 space-y-4">
        <h2 className="font-display font-semibold text-cream-100 flex items-center gap-2">
          <Users size={18} className="text-gold-400" /> Aforo máximo por franja horaria
        </h2>
        <p className="text-cream-400 text-sm">
          Número máximo de comensales que puede haber en cada franja de 30 minutos. Cuando se alcance este número, esa hora se marcará como <span className="text-cream-200">Completo</span> para los clientes.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number" min="1" max="200" value={maxGuests}
            onChange={(e) => { setMaxGuests(e.target.value); setSavedMax(false); }}
            className={`${inputClass} w-24 text-center font-bold text-lg`}
          />
          <span className="text-cream-400 text-sm">personas por franja</span>
          <button onClick={saveMaxGuests} disabled={savingMax}
            className={`ml-auto px-5 py-2.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-all ${
              savedMax
                ? "bg-success/15 border border-success/30 text-success"
                : "bg-gold-400 hover:bg-gold-300 text-carbon-900"
            } disabled:opacity-50`}>
            {savingMax ? "Guardando..." : savedMax ? "✓ Guardado" : "Guardar"}
          </button>
        </div>
        <p className="text-cream-400/50 text-xs">
          Ejemplo: con 30, una franja de las 14:00 puede tener hasta 30 comensales entre todas sus reservas (pendientes + confirmadas).
        </p>
      </div>

      {/* ── BLOQUEAR DÍAS / HORAS ── */}
      <div className="p-6 rounded-2xl border border-carbon-700 bg-carbon-800/30 space-y-5">
        <h2 className="font-display font-semibold text-cream-100 flex items-center gap-2">
          <CalendarX size={18} className="text-gold-400" /> Bloquear días u horas
        </h2>
        <p className="text-cream-400 text-sm">
          Bloquea un día completo (festivos, vacaciones) o una hora concreta (evento privado, servicio cerrado). Los clientes no podrán reservar en las fechas bloqueadas.
        </p>

        {/* Add block form */}
        <div className="flex flex-wrap items-end gap-3 p-4 rounded-xl bg-carbon-700/30 border border-carbon-600">
          <div>
            <label className="block text-xs text-cream-400 uppercase tracking-wider mb-1.5">Fecha *</label>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
              className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-cream-400 uppercase tracking-wider mb-1.5">
              Hora <span className="text-cream-400/40 normal-case">(vacío = día completo)</span>
            </label>
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400/50" />
              <select value={newTime} onChange={(e) => setNewTime(e.target.value)}
                className={`${inputClass} pl-8 appearance-none`}>
                <option value="">— Día completo —</option>
                <optgroup label="Comida">
                  {TIME_SLOTS.slice(0, 6).map((t) => <option key={t} value={t}>{t}</option>)}
                </optgroup>
                <optgroup label="Cena">
                  {TIME_SLOTS.slice(6).map((t) => <option key={t} value={t}>{t}</option>)}
                </optgroup>
              </select>
            </div>
          </div>
          <button onClick={addBlock} disabled={!newDate || addingBlock}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold-400 hover:bg-gold-300 disabled:bg-carbon-600 disabled:text-cream-400 text-carbon-900 font-bold text-sm rounded-lg transition-all">
            <Plus size={16} /> {addingBlock ? "Añadiendo..." : "Bloquear"}
          </button>
        </div>

        {/* Blocked list */}
        {blockedSlots.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-carbon-700">
            <CalendarX size={32} className="text-cream-400/20 mx-auto mb-3" />
            <p className="text-cream-400 text-sm">No hay días ni horas bloqueados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {blockedSlots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-carbon-700 bg-carbon-800/20">
                <div className="flex items-center gap-3">
                  <CalendarX size={16} className="text-gold-400/60 shrink-0" />
                  <div>
                    <p className="text-cream-100 text-sm font-medium capitalize">{formatDate(slot.date)}</p>
                    <p className="text-cream-400 text-xs">
                      {slot.time ? `Solo la franja de las ${slot.time}` : "Día completo bloqueado"}
                    </p>
                  </div>
                </div>
                <button onClick={() => removeBlock(slot.id)} disabled={deletingId === slot.id}
                  className="p-1.5 rounded-lg hover:bg-danger/10 text-cream-400/40 hover:text-danger transition-all disabled:opacity-50">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
