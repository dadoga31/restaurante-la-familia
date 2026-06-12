"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-carbon-950 flex items-center justify-center px-6">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(212,168,71,0.04),transparent)]" />

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-display font-bold text-3xl tracking-[0.15em] text-cream-50 uppercase">
            La <span className="text-gold-400">Familia</span>
          </p>
          <p className="text-cream-400 text-xs tracking-[0.3em] uppercase mt-2">Panel de Administración</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-carbon-800/50 border border-carbon-700 rounded-2xl p-8 backdrop-blur-sm space-y-5"
        >
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full border border-gold-400/30 bg-gold-400/10 flex items-center justify-center">
              <Lock size={20} className="text-gold-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-cream-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400/50" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
                placeholder="admin@lafamilia.es"
                className="w-full bg-carbon-700 border border-carbon-600 focus:border-gold-400 text-cream-100 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-all placeholder:text-cream-400/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wider uppercase text-cream-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400/50" />
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                required
                placeholder="••••••••"
                className="w-full bg-carbon-700 border border-carbon-600 focus:border-gold-400 text-cream-100 rounded-lg pl-10 pr-10 py-3 text-sm outline-none transition-all placeholder:text-cream-400/30"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400/50 hover:text-cream-300 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold-400 hover:bg-gold-300 disabled:bg-carbon-600 disabled:text-cream-400 text-carbon-900 font-bold text-sm tracking-[0.2em] uppercase rounded-lg transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <><span className="w-4 h-4 rounded-full border-2 border-carbon-900 border-t-transparent animate-spin" /> Accediendo...</>
            ) : "Acceder"}
          </button>

          <p className="text-center text-cream-400/40 text-xs mt-2">
            Demo: admin@lafamilia.es / admin2026
          </p>
        </form>

        <p className="text-center mt-6 text-cream-400/40 text-xs">
          <a href="/" className="hover:text-cream-300 transition-colors">← Volver a la web</a>
        </p>
      </div>
    </div>
  );
}
