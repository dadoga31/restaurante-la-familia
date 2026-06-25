"use client";

import { useEffect, useState } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import ParallaxSection from "@/components/ParallaxSection";
import AmbientGlow from "@/components/AmbientGlow";
import { Calendar, Clock, Users, MessageSquare, CheckCircle, AlertCircle, Phone } from "lucide-react";

const HEADER_IMG = "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=1920&q=80";

const TIME_SLOTS = {
  lunch:  ["13:00","13:30","14:00","14:30","15:00","15:30"],
  dinner: ["20:00","20:30","21:00","21:30","22:00","22:30"],
};

type SlotData = { available: boolean; remaining: number };
type Availability = { date: string; slots: Record<string, SlotData>; closed: boolean };
type Status = "idle" | "loading" | "success" | "error";

function getTodayDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function ReservasPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    date: "", time: "", guests: "2", specialRequest: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [confirmCode, setConfirmCode] = useState("");
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingAvail, setLoadingAvail] = useState(false);

  // Fetch availability when date changes
  useEffect(() => {
    if (!form.date) { setAvailability(null); return; }
    setLoadingAvail(true);
    setAvailability(null);
    fetch(`/api/reservas/availability?date=${form.date}`)
      .then((r) => r.json())
      .then((data) => { setAvailability(data); setLoadingAvail(false); })
      .catch(() => setLoadingAvail(false));
  }, [form.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "date") { setForm((p) => ({ ...p, date: value, time: "" })); return; }
    // If guests change and current time becomes unavailable, clear it
    if (name === "guests" && form.time && availability) {
      const slot = availability.slots[form.time];
      if (!slot?.available || slot.remaining < parseInt(value)) {
        setForm((p) => ({ ...p, guests: value, time: "" }));
        return;
      }
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading"); setError("");
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guests: parseInt(form.guests) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      setConfirmCode(data.confirmCode);
      setStatus("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al enviar la reserva");
      setStatus("error");
    }
  };

  // Per-slot availability considering selected guests
  const guests = parseInt(form.guests);
  const getSlotState = (slot: string): "available" | "full" | "loading" => {
    if (loadingAvail) return "loading";
    if (!availability) return "available";
    const s = availability.slots[slot];
    if (!s) return "available";
    if (!s.available || s.remaining < guests) return "full";
    return "available";
  };

  const isDayClosed = !loadingAvail && availability?.closed === true;
  const allFull = !loadingAvail && !!availability && !availability.closed &&
    Object.values(availability.slots).every((s) => !s.available || s.remaining < guests);

  const inputClass = "w-full bg-carbon-800 border border-carbon-600 focus:border-gold-400 text-cream-100 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-cream-400/30 focus:bg-carbon-750";
  const labelClass = "block text-xs font-medium tracking-wider uppercase text-cream-300 mb-2";

  if (status === "success") {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-32 bg-carbon-950">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-success/40 bg-success/10 text-success mb-6" style={{ animation: "heroFadeUp 0.6s ease both" }}>
            <CheckCircle size={36} />
          </div>
          <h1 className="font-display font-bold text-3xl text-cream-50 mb-4">¡Reserva Recibida!</h1>
          <p className="text-cream-400 leading-relaxed mb-6">
            Hemos recibido tu reserva para{" "}
            <strong className="text-cream-100">{form.guests} personas</strong> el{" "}
            <strong className="text-cream-100">
              {new Date(form.date + "T12:00:00").toLocaleDateString("es-ES", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </strong>{" "}
            a las <strong className="text-cream-100">{form.time}</strong>.
          </p>
          <div className="p-5 rounded-xl border border-gold-400/30 bg-gold-400/5 mb-8">
            <p className="text-xs text-cream-400 uppercase tracking-widest mb-2">Código de reserva</p>
            <p className="text-3xl font-bold font-display text-gold-400 tracking-[0.3em]">{confirmCode}</p>
          </div>
          <p className="text-cream-400 text-sm mb-8">
            Guarda este código — lo necesitarás al llegar. Para cancelar, llámanos con al menos 24h de antelación.
          </p>
          <button
            onClick={() => { setStatus("idle"); setForm({ name:"",email:"",phone:"",date:"",time:"",guests:"2",specialRequest:"" }); setAvailability(null); }}
            className="px-6 py-3 border border-gold-400/40 text-gold-400 hover:bg-gold-400/10 text-sm tracking-wider uppercase rounded-xl transition-all"
          >
            Nueva reserva
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <ParallaxSection
        imageUrl={HEADER_IMG}
        overlayOpacity={0.82}
        overlayColor="8,8,8"
        speed={0.15}
        className="pt-36 pb-20 px-6"
      >
        <AnimateOnScroll animation="blur-in" className="text-center">
          <span className="text-gold-400 text-xs tracking-[0.45em] uppercase font-medium">Asegura tu lugar</span>
          <h1 className="font-display font-bold text-5xl sm:text-6xl text-cream-50 mt-3 tracking-wide drop-shadow-2xl">
            Reservar Mesa
          </h1>
          <div className="mt-5 h-px w-14 bg-gold-400/60 mx-auto" />
          <p className="text-cream-300 mt-5 leading-relaxed max-w-md mx-auto">
            Rellena el formulario y recibirás confirmación inmediata con tu código de reserva.
          </p>
        </AnimateOnScroll>
      </ParallaxSection>

      <main className="flex-1 bg-carbon-950 pb-28 px-6 relative z-10">
        <AmbientGlow />
        <div className="relative z-10 max-w-6xl mx-auto -mt-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

              {/* LEFT */}
              <div className="space-y-5">
                <AnimateOnScroll animation="fade-right" delay={100}>
                  <div className="p-7 rounded-2xl border border-carbon-700 bg-carbon-900/80 backdrop-blur-sm space-y-5 shadow-2xl">
                    <h2 className="font-display font-semibold text-cream-100 text-sm tracking-widest uppercase flex items-center gap-2">
                      <Users size={15} className="text-gold-400" /> Datos de contacto
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Nombre completo *</label>
                        <input name="name" value={form.name} onChange={handleChange} required
                          placeholder="María García" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Teléfono *</label>
                        <input name="phone" value={form.phone} onChange={handleChange} required
                          type="tel" placeholder="+34 600 000 000" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input name="email" value={form.email} onChange={handleChange} required
                        type="email" placeholder="tu@email.com" className={inputClass} />
                    </div>
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll animation="fade-right" delay={220}>
                  <div className="p-7 rounded-2xl border border-carbon-700 bg-carbon-900/80 backdrop-blur-sm shadow-2xl">
                    <h2 className="font-display font-semibold text-cream-100 text-sm tracking-widest uppercase flex items-center gap-2 mb-4">
                      <MessageSquare size={15} className="text-gold-400" /> Peticiones especiales
                    </h2>
                    <textarea name="specialRequest" value={form.specialRequest} onChange={handleChange}
                      rows={5} placeholder="Alergias, celebraciones, preferencias de mesa..."
                      className={`${inputClass} resize-none`} />
                    <p className="text-cream-400/40 text-xs mt-3 leading-relaxed">
                      Cualquier necesidad especial — lo tendremos en cuenta.
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* RIGHT */}
              <div className="space-y-5">
                <AnimateOnScroll animation="fade-left" delay={100}>
                  <div className="p-7 rounded-2xl border border-carbon-700 bg-carbon-900/80 backdrop-blur-sm space-y-6 shadow-2xl">
                    <h2 className="font-display font-semibold text-cream-100 text-sm tracking-widest uppercase flex items-center gap-2">
                      <Calendar size={15} className="text-gold-400" /> Detalles de la reserva
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Fecha *</label>
                        <input name="date" type="date" value={form.date} onChange={handleChange} required
                          min={getTodayDate()}
                          className={`${inputClass} ${isDayClosed ? "border-danger/60" : ""}`} />
                        {isDayClosed && (
                          <p className="text-danger text-xs mt-1.5">El restaurante no abre este día.</p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>Personas *</label>
                        <select name="guests" value={form.guests} onChange={handleChange} className={inputClass}>
                          {[1,2,3,4,5,6,7,8].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "persona" : "personas"}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* "Cerrado" banner */}
                    {isDayClosed && (
                      <div className="flex flex-col items-center gap-2 p-5 rounded-xl border border-carbon-600 bg-carbon-800/60 text-center">
                        <p className="text-cream-100 font-semibold text-sm">El restaurante no abre este día</p>
                        <p className="text-cream-400 text-xs">Elige otra fecha para tu reserva</p>
                      </div>
                    )}

                    {/* "Todo completo" banner */}
                    {!isDayClosed && allFull && (
                      <div className="flex flex-col items-center gap-3 p-5 rounded-xl border border-danger/30 bg-danger/5 text-center">
                        <p className="text-cream-100 font-semibold text-sm">Sin disponibilidad para este día</p>
                        <p className="text-cream-400 text-xs leading-relaxed">
                          No quedan plazas para {guests} {guests === 1 ? "persona" : "personas"}.<br />
                          Para consultar disponibilidad llámanos:
                        </p>
                        <a href="tel:+34671091781"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-400/10 border border-gold-400/40 text-gold-400 rounded-xl text-sm font-semibold hover:bg-gold-400/20 transition-all">
                          <Phone size={15} /> 671 091 781
                        </a>
                      </div>
                    )}

                    {/* Time slots */}
                    {!isDayClosed && !allFull && (
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}>
                          <Clock size={13} className="text-gold-400" /> Hora *
                        </label>
                        <div className="space-y-3">
                          {(["lunch", "dinner"] as const).map((service) => (
                            <div key={service}>
                              <p className="text-cream-400/50 text-[10px] uppercase tracking-[0.3em] mb-2">
                                {service === "lunch" ? "Comida" : "Cena"}
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {TIME_SLOTS[service].map((slot) => {
                                  const state = getSlotState(slot);
                                  const selected = form.time === slot;
                                  return (
                                    <button key={slot} type="button"
                                      disabled={state === "full"}
                                      onClick={() => state !== "full" && setForm((p) => ({ ...p, time: slot }))}
                                      className={`py-2.5 rounded-lg border font-medium transition-all duration-200 flex flex-col items-center justify-center leading-tight
                                        ${selected
                                          ? "bg-gold-400 border-gold-400 text-carbon-900 font-bold shadow-lg shadow-gold-400/20"
                                          : state === "full"
                                          ? "border-carbon-700 text-cream-400/25 bg-carbon-800/20 cursor-not-allowed"
                                          : state === "loading"
                                          ? "border-carbon-700 text-cream-400/40 animate-pulse"
                                          : "border-carbon-600 text-cream-300 hover:border-gold-400/40 hover:text-cream-50 hover:bg-carbon-700"
                                        }`}
                                    >
                                      <span className="text-sm">{slot}</span>
                                      {state === "full" && (
                                        <span className="text-[9px] text-cream-400/30 mt-0.5">Completo</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AnimateOnScroll>

                <AnimateOnScroll animation="fade-left" delay={220}>
                  <div className="space-y-4">
                    {status === "error" && error && (
                      <div className="flex items-start gap-3 p-4 rounded-xl border border-danger/40 bg-danger/10 text-danger text-sm">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" /> {error}
                      </div>
                    )}
                    {!isDayClosed && !allFull && (
                      <button type="submit"
                        disabled={status === "loading" || !form.time}
                        className="w-full py-4 bg-gold-400 hover:bg-gold-300 disabled:bg-carbon-700 disabled:text-cream-400 text-carbon-900 font-bold text-sm tracking-[0.2em] uppercase rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-gold-400/20 hover:-translate-y-0.5 flex items-center justify-center gap-3">
                        {status === "loading" ? (
                          <><span className="w-4 h-4 rounded-full border-2 border-carbon-900 border-t-transparent animate-spin" /> Enviando...</>
                        ) : (
                          <><Calendar size={17} /> Confirmar Reserva</>
                        )}
                      </button>
                    )}
                    <p className="text-center text-cream-400/40 text-xs">
                      Al reservar aceptas nuestra política de cancelaciones. Cancela con mínimo 24h de antelación.
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>

            </div>
          </form>
        </div>
      </main>
    </>
  );
}
