"use client";

import { useCallback, useState } from "react";
import {
  Plus, Pencil, Trash2, UtensilsCrossed,
  Eye, EyeOff, Star, X, Check, ChevronDown, Upload, ImageOff,
} from "lucide-react";

type Category = { id: number; name: string; slug: string; order: number };
type Dish = {
  id: number; name: string; description: string | null; price: number;
  image: string | null; isActive: boolean; isDailyMenu: boolean;
  categoryId: number; order: number;
  category: Category;
};

type Props = {
  initialDishes: Dish[];
  initialCategories: Category[];
  initialMenuImage: string;
};

const EMPTY_FORM = {
  name: "", description: "", price: "",
  image: "", isActive: true, isDailyMenu: false,
  categoryId: "", order: "0",
};

export default function MenusClient({ initialDishes, initialCategories, initialMenuImage }: Props) {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [categories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<"dish" | null>(null);
  const [editing, setEditing] = useState<Dish | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM, categoryId: initialCategories[0] ? String(initialCategories[0].id) : "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [catFilter, setCatFilter] = useState<number | "">("");
  const [error, setError] = useState("");
  const [menuImage, setMenuImage] = useState(initialMenuImage);
  const [uploadingMenu, setUploadingMenu] = useState(false);

  const refetchDishes = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/dishes");
    setDishes(await res.json());
    setLoading(false);
  }, []);

  const handleMenuImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMenu(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error);
      const { url } = await res.json();
      setMenuImage(url);
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "daily_menu_image", value: url }),
      });
    } finally {
      setUploadingMenu(false);
      e.target.value = "";
    }
  };

  const removeMenuImage = async () => {
    setMenuImage("");
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "daily_menu_image", value: "" }),
    });
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0] ? String(categories[0].id) : "" });
    setError("");
    setModal("dish");
  };

  const openEdit = (dish: Dish) => {
    setEditing(dish);
    setForm({
      name: dish.name, description: dish.description ?? "", price: String(dish.price),
      image: dish.image ?? "", isActive: dish.isActive, isDailyMenu: dish.isDailyMenu,
      categoryId: String(dish.categoryId), order: String(dish.order),
    });
    setError("");
    setModal("dish");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/admin/dishes/${editing.id}` : "/api/admin/dishes";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await refetchDishes();
      setModal(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally { setSaving(false); }
  };

  const toggleActive = async (dish: Dish) => {
    await fetch(`/api/admin/dishes/${dish.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dish, isActive: !dish.isActive, categoryId: dish.categoryId, price: dish.price }),
    });
    setDishes((prev) => prev.map((d) => d.id === dish.id ? { ...d, isActive: !d.isActive } : d));
  };

  const toggleDaily = async (dish: Dish) => {
    await fetch(`/api/admin/dishes/${dish.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...dish, isDailyMenu: !dish.isDailyMenu, categoryId: dish.categoryId, price: dish.price }),
    });
    setDishes((prev) => prev.map((d) => d.id === dish.id ? { ...d, isDailyMenu: !d.isDailyMenu } : d));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error);
      const { url } = await res.json();
      setForm((p) => ({ ...p, image: url }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const deleteDish = async (id: number) => {
    if (!confirm("¿Eliminar este plato?")) return;
    await fetch(`/api/admin/dishes/${id}`, { method: "DELETE" });
    setDishes((prev) => prev.filter((d) => d.id !== id));
  };

  const filtered = catFilter ? dishes.filter((d) => d.categoryId === catFilter) : dishes;

  const inputClass = "w-full bg-carbon-700 border border-carbon-600 focus:border-gold-400 text-cream-100 rounded-lg px-4 py-2.5 text-sm outline-none transition-all placeholder:text-cream-400/30";
  const labelClass = "block text-xs font-medium tracking-wider uppercase text-cream-300 mb-1.5";

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Foto del Menú del Día */}
      <div className="p-6 rounded-2xl border border-carbon-700 bg-carbon-800/30 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-semibold text-cream-100 flex items-center gap-2">
              <Upload size={16} className="text-gold-400" /> Foto del Menú del Día
            </h2>
            <p className="text-cream-400 text-xs mt-0.5">Se muestra en la página principal en lugar de las tarjetas de platos</p>
          </div>
          {menuImage && (
            <button onClick={removeMenuImage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-danger/40 text-danger text-xs hover:bg-danger/10 transition-all">
              <ImageOff size={13} /> Quitar foto
            </button>
          )}
        </div>
        {menuImage ? (
          <div className="relative rounded-xl overflow-hidden border border-carbon-600 group max-h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={menuImage} alt="Foto menú del día" className="w-full object-cover max-h-72" />
            <div className="absolute inset-0 bg-carbon-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-carbon-800 border border-gold-400/40 rounded-xl text-cream-200 text-sm font-medium cursor-pointer hover:border-gold-400 transition-all">
                <Upload size={15} /> Cambiar foto
                <input type="file" accept="image/*" className="hidden" onChange={handleMenuImageUpload} disabled={uploadingMenu} />
              </label>
            </div>
            {uploadingMenu && (
              <div className="absolute inset-0 bg-carbon-950/70 flex items-center justify-center">
                <span className="w-7 h-7 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <label className={`w-full flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            uploadingMenu ? "border-gold-400/50 bg-gold-400/5" : "border-carbon-600 hover:border-gold-400/40 hover:bg-carbon-700/20"
          }`}>
            {uploadingMenu ? (
              <>
                <span className="w-7 h-7 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-cream-400 text-sm">Subiendo...</span>
              </>
            ) : (
              <>
                <Upload size={28} className="text-cream-400/40" />
                <span className="text-cream-200 text-sm font-medium">Subir foto del menú del día</span>
                <span className="text-cream-400/50 text-xs">JPG, PNG, WEBP · Se mostrará en la web automáticamente</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleMenuImageUpload} disabled={uploadingMenu} />
          </label>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-cream-50 flex items-center gap-2">
            <UtensilsCrossed size={24} className="text-gold-400" /> Gestión de Carta
          </h1>
          <p className="text-cream-400 text-sm mt-1">{dishes.length} platos en total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-400 hover:bg-gold-300 text-carbon-900 font-bold text-sm tracking-wider uppercase rounded-lg transition-all">
          <Plus size={18} /> Nuevo Plato
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setCatFilter("")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
            catFilter === "" ? "bg-gold-400/15 border-gold-400/30 text-gold-400" : "border-carbon-600 text-cream-400 hover:text-cream-100"
          }`}>
          Todos
        </button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setCatFilter(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              catFilter === cat.id ? "bg-gold-400/15 border-gold-400/30 text-gold-400" : "border-carbon-600 text-cream-400 hover:text-cream-100"
            }`}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Dishes table */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map((i) => <div key={i} className="h-16 skeleton rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-carbon-700">
          <UtensilsCrossed size={40} className="text-cream-400/20 mx-auto mb-4" />
          <p className="text-cream-400 mb-4">Sin platos en esta categoría</p>
          <button onClick={openCreate} className="px-4 py-2 bg-gold-400/15 text-gold-400 rounded-lg text-sm hover:bg-gold-400/25 transition-all">
            Añadir primer plato
          </button>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map((dish) => (
              <div key={dish.id} className={`rounded-xl border border-carbon-700 bg-carbon-800/30 overflow-hidden ${!dish.isActive ? "opacity-50" : ""}`}>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-cream-100 font-semibold">{dish.name}</p>
                      {dish.description && (
                        <p className="text-cream-400 text-xs mt-0.5 line-clamp-2">{dish.description}</p>
                      )}
                    </div>
                    <span className="text-gold-400 font-bold font-display text-lg shrink-0">{dish.price.toFixed(2)}€</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-carbon-700 text-cream-300 rounded-full text-xs">{dish.category.name}</span>
                    {dish.isDailyMenu && (
                      <span className="px-2.5 py-1 bg-gold-400/15 border border-gold-400/30 text-gold-400 rounded-full text-xs flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Menú del día
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex border-t border-carbon-700">
                  <button onClick={() => toggleActive(dish)}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      dish.isActive ? "bg-success/10 text-success hover:bg-success/20" : "bg-carbon-700 text-cream-400 hover:bg-carbon-600"
                    }`}>
                    {dish.isActive ? <><Eye size={13}/> Activo</> : <><EyeOff size={13}/> Oculto</>}
                  </button>
                  <button onClick={() => toggleDaily(dish)}
                    className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border-l border-carbon-700 ${
                      dish.isDailyMenu ? "bg-gold-400/15 text-gold-400 hover:bg-gold-400/25" : "bg-carbon-700/50 text-cream-400 hover:bg-carbon-700"
                    }`}>
                    <Star size={13} fill={dish.isDailyMenu ? "currentColor" : "none"} />
                    {dish.isDailyMenu ? "Del día" : "Añadir"}
                  </button>
                  <button onClick={() => openEdit(dish)}
                    className="px-4 py-3 bg-carbon-700 hover:bg-carbon-600 text-cream-300 transition-all border-l border-carbon-700">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => deleteDish(dish.id)}
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
                    {["Plato", "Categoría", "Precio", "Menú del día", "Estado", "Acciones"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-cream-400 tracking-wider uppercase whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-carbon-700/50">
                  {filtered.map((dish) => (
                    <tr key={dish.id} className={`hover:bg-carbon-800/30 transition-colors ${!dish.isActive ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="text-cream-100 font-medium">{dish.name}</p>
                        {dish.description && (
                          <p className="text-cream-400 text-xs mt-0.5 line-clamp-1 max-w-xs">{dish.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-cream-300 whitespace-nowrap">{dish.category.name}</td>
                      <td className="px-4 py-3 text-gold-400 font-semibold font-display whitespace-nowrap">
                        {dish.price.toFixed(2)}€
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleDaily(dish)}
                          className={`p-1.5 rounded-lg transition-all ${dish.isDailyMenu ? "bg-gold-400/20 text-gold-400" : "text-cream-400/30 hover:text-cream-400"}`}
                          title={dish.isDailyMenu ? "Quitar del menú del día" : "Añadir al menú del día"}>
                          <Star size={16} fill={dish.isDailyMenu ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(dish)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            dish.isActive ? "bg-success/15 text-success border border-success/30" : "bg-carbon-700 text-cream-400 border border-carbon-600"
                          }`}>
                          {dish.isActive ? <><Eye size={12}/> Activo</> : <><EyeOff size={12}/> Oculto</>}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(dish)}
                            className="p-1.5 rounded-lg bg-carbon-700 hover:bg-carbon-600 text-cream-300 transition-all" title="Editar">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => deleteDish(dish.id)}
                            className="p-1.5 rounded-lg hover:bg-danger/10 text-cream-400/50 hover:text-danger transition-all" title="Eliminar">
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

      {/* Modal */}
      {modal === "dish" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-carbon-950/80 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative w-full sm:max-w-lg bg-carbon-800 border border-carbon-600 sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-700">
              <h2 className="font-display font-bold text-cream-50 text-lg">
                {editing ? "Editar Plato" : "Nuevo Plato"}
              </h2>
              <button onClick={() => setModal(null)} className="p-1.5 text-cream-400 hover:text-cream-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Nombre *</label>
                  <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required placeholder="Nombre del plato" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Categoría *</label>
                  <div className="relative">
                    <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                      required className={`${inputClass} appearance-none pr-8`}>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400/50 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Precio (€) *</label>
                  <input type="number" step="0.01" min="0" value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    required placeholder="0.00" className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Descripción</label>
                  <textarea value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    rows={2} placeholder="Descripción del plato..." className={`${inputClass} resize-none`} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Imagen del plato</label>
                  {form.image ? (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-carbon-600 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-carbon-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="flex items-center gap-1.5 px-3 py-2 bg-carbon-800 border border-carbon-600 rounded-lg text-cream-200 text-xs font-medium cursor-pointer hover:border-gold-400/50 transition-all">
                          <Upload size={13} /> Cambiar
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                        <button type="button" onClick={() => setForm((p) => ({ ...p, image: "" }))}
                          className="flex items-center gap-1.5 px-3 py-2 bg-carbon-800 border border-danger/40 rounded-lg text-danger text-xs font-medium hover:bg-danger/10 transition-all">
                          <ImageOff size={13} /> Quitar
                        </button>
                      </div>
                      {uploading && (
                        <div className="absolute inset-0 bg-carbon-950/70 flex items-center justify-center">
                          <span className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className={`w-full flex flex-col items-center justify-center gap-2 py-7 border border-dashed rounded-xl cursor-pointer transition-all ${
                      uploading ? "border-gold-400/50 bg-gold-400/5" : "border-carbon-600 hover:border-gold-400/40 hover:bg-carbon-700/30"
                    }`}>
                      {uploading ? (
                        <>
                          <span className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-cream-400 text-sm">Subiendo...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={22} className="text-cream-400/50" />
                          <span className="text-cream-400 text-sm">Subir foto del plato</span>
                          <span className="text-cream-400/40 text-xs">JPG, PNG, WEBP</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Orden</label>
                  <input type="number" min="0" value={form.order}
                    onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                    className={inputClass} />
                </div>
                <div className="flex flex-col gap-3 justify-end pb-0.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                      className={`w-10 h-5 rounded-full transition-all relative ${form.isActive ? "bg-success" : "bg-carbon-600"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.isActive ? "left-5" : "left-0.5"}`} />
                    </div>
                    <span className="text-sm text-cream-300">Activo en carta</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm((p) => ({ ...p, isDailyMenu: !p.isDailyMenu }))}
                      className={`w-10 h-5 rounded-full transition-all relative ${form.isDailyMenu ? "bg-gold-400" : "bg-carbon-600"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.isDailyMenu ? "left-5" : "left-0.5"}`} />
                    </div>
                    <span className="text-sm text-cream-300">Menú del día</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 py-2.5 border border-carbon-600 text-cream-300 hover:text-cream-100 text-sm rounded-lg transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-gold-400 hover:bg-gold-300 disabled:bg-carbon-600 text-carbon-900 disabled:text-cream-400 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2">
                  {saving ? (
                    <span className="w-4 h-4 rounded-full border-2 border-carbon-900 border-t-transparent animate-spin" />
                  ) : <Check size={16} />}
                  {saving ? "Guardando..." : "Guardar Plato"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
