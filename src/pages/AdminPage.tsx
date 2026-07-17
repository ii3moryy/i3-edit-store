import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, Star, Save, Eye, EyeOff, Package, PackageX, X, ChevronUp, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Creator = { id: string; name: string; image_url: string; channel_url: string | null; sort_order: number };
type Promo = { id: string; code: string; discount_percent: number; active: boolean };
type Review = { id: string; name: string; stars: number; description: string };
type PlanRow = {
  id: string;
  name_ar: string;
  name_en: string;
  price_before: number;
  price_after: number;
  sort_order: number;
  in_stock: boolean;
  visible: boolean;
  featured: boolean;
  duration_ar: string;
  duration_en: string;
  features_ar: string[];
  features_en: string[];
};

type Tab = "prices" | "creators" | "promos" | "reviews";

export default function AdminPage() {
  const { t, lang } = useI18n();
  const isEn = lang === "en";
  const [tab, setTab] = useState<Tab>("prices");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [planRows, setPlanRows] = useState<PlanRow[]>([]);
  const [cName, setCName] = useState("");
  const [cUrl, setCUrl] = useState("");
  const [cChannel, setCChannel] = useState("");
  const [pCode, setPCode] = useState("");
  const [pPct, setPPct] = useState(10);
  const [rName, setRName] = useState("");
  const [rStars, setRStars] = useState(5);
  const [rDesc, setRDesc] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [{ data: c }, { data: p }, { data: r }, { data: pl }] = await Promise.all([
      supabase.from("creators" as any).select("*").order("sort_order"),
      supabase.from("promo_codes" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("reviews" as any).select("*").order("sort_order"),
      supabase.from("plans" as any).select("*").order("sort_order"),
    ]);
    setCreators((c as any) ?? []);
    setPromos((p as any) ?? []);
    setReviews((r as any) ?? []);
    setPlanRows(((pl as any) ?? []).map((row: any) => ({
      ...row,
      features_ar: row.features_ar ?? [],
      features_en: row.features_en ?? [],
    })));
  };
  useEffect(() => { load(); }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };

  const updatePlanField = <K extends keyof PlanRow>(id: string, field: K, value: PlanRow[K]) => {
    setPlanRows((rows) => rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  };

  const savePlan = async (row: PlanRow) => {
    const { error } = await supabase
      .from("plans" as any)
      .update({
        name_ar: row.name_ar,
        name_en: row.name_en,
        price_before: Number(row.price_before),
        price_after: Number(row.price_after),
        in_stock: row.in_stock,
        visible: row.visible,
        featured: row.featured,
        duration_ar: row.duration_ar,
        duration_en: row.duration_en,
        features_ar: row.features_ar,
        features_en: row.features_en,
        sort_order: row.sort_order,
      } as any)
      .eq("id", row.id);
    if (error) return flash(t("admin.error") + " " + error.message);
    flash(t("admin.saved"));
  };

  const togglePlanField = async (row: PlanRow, field: "in_stock" | "visible" | "featured") => {
    const next = !row[field];
    updatePlanField(row.id, field, next);
    const { error } = await supabase.from("plans" as any).update({ [field]: next } as any).eq("id", row.id);
    if (error) flash(t("admin.error") + " " + error.message);
  };

  const deletePlan = async (id: string) => {
    if (!confirm(isEn ? "Delete this plan?" : "حذف هذه الخطة؟")) return;
    const { error } = await supabase.from("plans" as any).delete().eq("id", id);
    if (error) return flash(t("admin.error") + " " + error.message);
    load();
  };

  const movePlan = async (id: string, dir: -1 | 1) => {
    const sorted = [...planRows].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((r) => r.id === id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    // Optimistic
    setPlanRows((rows) => rows.map((r) =>
      r.id === a.id ? { ...r, sort_order: b.sort_order } :
      r.id === b.id ? { ...r, sort_order: a.sort_order } : r
    ));
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("plans" as any).update({ sort_order: b.sort_order } as any).eq("id", a.id),
      supabase.from("plans" as any).update({ sort_order: a.sort_order } as any).eq("id", b.id),
    ]);
    if (e1 || e2) flash(t("admin.error") + " " + (e1?.message || e2?.message));
  };


  const addPlan = async () => {
    const id = `plan-${Date.now().toString(36)}`;
    const { error } = await supabase.from("plans" as any).insert({
      id,
      name_ar: isEn ? "" : "خطة جديدة",
      name_en: "New Plan",
      price_before: 0,
      price_after: 0,
      sort_order: planRows.length,
      in_stock: true,
      visible: true,
      featured: false,
      duration_ar: "",
      duration_en: "",
      features_ar: [],
      features_en: [],
    } as any);
    if (error) return flash(t("admin.error") + " " + error.message);
    flash(isEn ? "Plan added" : "تمت إضافة الخطة");
    load();
  };

  const addFeature = (row: PlanRow, locale: "ar" | "en") => {
    const key = locale === "ar" ? "features_ar" : "features_en";
    updatePlanField(row.id, key, [...row[key], ""]);
  };
  const updateFeature = (row: PlanRow, locale: "ar" | "en", idx: number, value: string) => {
    const key = locale === "ar" ? "features_ar" : "features_en";
    const next = [...row[key]];
    next[idx] = value;
    updatePlanField(row.id, key, next);
  };
  const removeFeature = (row: PlanRow, locale: "ar" | "en", idx: number) => {
    const key = locale === "ar" ? "features_ar" : "features_en";
    updatePlanField(row.id, key, row[key].filter((_, i) => i !== idx));
  };

  const savePct = (row: PlanRow) =>
    row.price_before > 0 ? Math.round(((row.price_before - row.price_after) / row.price_before) * 100) : 0;

  const addCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("creators" as any).insert({
      name: cName,
      image_url: cUrl,
      channel_url: cChannel.trim() || null,
      sort_order: creators.length,
    } as any);
    if (error) return flash(t("admin.error") + " " + error.message);
    setCName(""); setCUrl(""); setCChannel(""); flash(t("admin.add"));
    load();
  };

  const delCreator = async (id: string) => {
    await supabase.from("creators" as any).delete().eq("id", id);
    load();
  };

  const addPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("promo_codes" as any).insert({ code: pCode.toUpperCase().trim(), discount_percent: pPct, active: true } as any);
    if (error) return flash(t("admin.error") + " " + error.message);
    setPCode(""); setPPct(10); flash(t("admin.addCode"));
    load();
  };

  const togglePromo = async (p: Promo) => {
    await supabase.from("promo_codes" as any).update({ active: !p.active } as any).eq("id", p.id);
    load();
  };

  const delPromo = async (id: string) => {
    await supabase.from("promo_codes" as any).delete().eq("id", id);
    load();
  };

  const addReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("reviews" as any).insert({
      name: rName.trim(),
      stars: rStars,
      description: rDesc.trim(),
      sort_order: reviews.length,
    } as any);
    if (error) return flash(t("admin.error") + " " + error.message);
    setRName(""); setRStars(5); setRDesc(""); flash(t("admin.add"));
    load();
  };

  const delReview = async (id: string) => {
    await supabase.from("reviews" as any).delete().eq("id", id);
    load();
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "prices", label: t("admin.tab.prices") },
    { id: "creators", label: t("admin.tab.creators") },
    { id: "promos", label: t("admin.tab.promos") },
    { id: "reviews", label: t("admin.tab.reviews") },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-10">
        <div className="inline-block bg-primary/15 text-primary border border-primary/30 rounded-full px-4 py-1 text-xs font-semibold">{t("admin.beta")}</div>
        <h1 className="text-4xl font-extrabold mt-3">{t("admin.title")}</h1>
      </div>

      {msg && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-success text-success-foreground px-4 py-2 rounded-xl z-50 animate-fade-in">{msg}</div>}

      <div className="flex flex-wrap gap-2 mb-6 bg-card border border-border rounded-2xl p-2">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              tab === tb.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === "prices" && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t("admin.prices")}</h2>
            <button
              onClick={addPlan}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90"
            >
              <Plus className="w-4 h-4" /> {isEn ? "Add New Plan" : "إضافة خطة جديدة"}
            </button>
          </div>
          <div className="space-y-4">
            {[...planRows].sort((a, b) => a.sort_order - b.sort_order).map((row, idx, arr) => (
              <div
                key={row.id}
                className={`bg-secondary/40 border rounded-xl p-4 space-y-3 ${
                  row.featured ? "border-primary" : "border-border"
                } ${!row.visible ? "opacity-60" : ""}`}
              >
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col bg-card border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => movePlan(row.id, -1)}
                        disabled={idx === 0}
                        className="px-1.5 py-0.5 hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
                        title={isEn ? "Move up" : "للأعلى"}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => movePlan(row.id, 1)}
                        disabled={idx === arr.length - 1}
                        className="px-1.5 py-0.5 hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed border-t border-border"
                        title={isEn ? "Move down" : "للأسفل"}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">#{idx + 1} · ID: {row.id}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => togglePlanField(row, "in_stock")}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 border ${
                        row.in_stock
                          ? "bg-success/15 text-success border-success/30"
                          : "bg-destructive/15 text-destructive border-destructive/30"
                      }`}
                    >
                      {row.in_stock ? <Package className="w-3.5 h-3.5" /> : <PackageX className="w-3.5 h-3.5" />}
                      {row.in_stock ? (isEn ? "In Stock" : "متوفر") : (isEn ? "Out of Stock" : "نفذت الكمية")}
                    </button>
                    <button
                      onClick={() => togglePlanField(row, "visible")}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 border ${
                        row.visible
                          ? "bg-success/15 text-success border-success/30"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {row.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {row.visible ? (isEn ? "Visible" : "ظاهرة") : (isEn ? "Hidden" : "مخفية")}
                    </button>
                    <button
                      onClick={() => togglePlanField(row, "featured")}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 border ${
                        row.featured
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${row.featured ? "fill-current" : ""}`} />
                      {isEn ? "Most Popular" : "الأكثر شعبية"}
                    </button>
                    <button
                      onClick={() => deletePlan(row.id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 border border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isEn ? "Delete" : "حذف"}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">{t("admin.priceNameAr")}</label>
                    <input value={row.name_ar} onChange={(e) => updatePlanField(row.id, "name_ar", e.target.value)} className={input} dir="rtl" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">{t("admin.priceNameEn")}</label>
                    <input value={row.name_en} onChange={(e) => updatePlanField(row.id, "name_en", e.target.value)} className={input} dir="ltr" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">{isEn ? "Duration (Arabic)" : "المدة (عربي)"}</label>
                    <input value={row.duration_ar} onChange={(e) => updatePlanField(row.id, "duration_ar", e.target.value)} className={input} dir="rtl" placeholder="3 أشهر" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">{isEn ? "Duration (English)" : "المدة (إنجليزي)"}</label>
                    <input value={row.duration_en} onChange={(e) => updatePlanField(row.id, "duration_en", e.target.value)} className={input} dir="ltr" placeholder="3 Months" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">{t("admin.priceBefore")}</label>
                    <input type="number" min={0} value={row.price_before} onChange={(e) => updatePlanField(row.id, "price_before", Number(e.target.value))} className={input} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      {t("admin.priceAfter")} <span className="text-success">({isEn ? "Save" : "وفر"} {savePct(row)}%)</span>
                    </label>
                    <input type="number" min={0} value={row.price_after} onChange={(e) => updatePlanField(row.id, "price_after", Number(e.target.value))} className={input} />
                  </div>
                </div>

                {/* Features AR */}
                <FeatureEditor
                  label={isEn ? "Features (Arabic)" : "المميزات (عربي)"}
                  dir="rtl"
                  items={row.features_ar}
                  onChange={(idx, v) => updateFeature(row, "ar", idx, v)}
                  onAdd={() => addFeature(row, "ar")}
                  onRemove={(idx) => removeFeature(row, "ar", idx)}
                  addLabel={isEn ? "Add feature" : "إضافة ميزة"}
                />

                {/* Features EN */}
                <FeatureEditor
                  label={isEn ? "Features (English)" : "المميزات (إنجليزي)"}
                  dir="ltr"
                  items={row.features_en}
                  onChange={(idx, v) => updateFeature(row, "en", idx, v)}
                  onAdd={() => addFeature(row, "en")}
                  onRemove={(idx) => removeFeature(row, "en", idx)}
                  addLabel={isEn ? "Add feature" : "إضافة ميزة"}
                />

                <button
                  onClick={() => savePlan(row)}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <Save className="w-4 h-4" /> {t("admin.savePrice")}
                </button>
              </div>
            ))}
            {planRows.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t("admin.noItems")}</p>}
          </div>
        </section>
      )}

      {tab === "creators" && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">{t("admin.creators")}</h2>
          <form onSubmit={addCreator} className="space-y-3">
            <input required value={cName} onChange={(e) => setCName(e.target.value)} placeholder={t("admin.name")} className={input} />
            <input required type="url" value={cUrl} onChange={(e) => setCUrl(e.target.value)} placeholder={t("admin.imageUrl")} className={input} />
            <input type="url" value={cChannel} onChange={(e) => setCChannel(e.target.value)} placeholder={t("admin.channelUrl")} className={input} />
            <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> {t("admin.add")}
            </button>
          </form>
          <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
            {creators.map((c) => (
              <div key={c.id} className="flex items-center gap-3 bg-secondary/40 border border-border rounded-xl p-2">
                <img src={c.image_url} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{c.name}</div>
                  {c.channel_url ? (
                    <a href={c.channel_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary truncate block hover:underline">
                      {c.channel_url}
                    </a>
                  ) : (
                    <div className="text-xs text-muted-foreground">{t("admin.noChannel")}</div>
                  )}
                </div>
                <button onClick={() => delCreator(c.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {creators.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t("admin.noItems")}</p>}
          </div>
        </section>
      )}

      {tab === "promos" && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">{t("admin.promos")}</h2>
          <form onSubmit={addPromo} className="space-y-3">
            <input required value={pCode} onChange={(e) => setPCode(e.target.value)} placeholder={t("admin.code")} className={input} />
            <input required type="number" min={1} max={100} value={pPct} onChange={(e) => setPPct(Number(e.target.value))} placeholder={t("admin.discountPercent")} className={input} />
            <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> {t("admin.addCode")}
            </button>
          </form>
          <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
            {promos.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-secondary/40 border border-border rounded-xl p-3">
                <button onClick={() => togglePromo(p)} className={`text-xs px-2 py-1 rounded-full font-bold ${p.active ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                  {p.active ? t("admin.active") : t("admin.inactive")}
                </button>
                <code className="flex-1 font-mono font-bold">{p.code}</code>
                <span className="text-primary font-bold">{p.discount_percent}%</span>
                <button onClick={() => delPromo(p.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {promos.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t("admin.noItems")}</p>}
          </div>
        </section>
      )}

      {tab === "reviews" && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">{t("admin.reviews")}</h2>
          <form onSubmit={addReview} className="grid md:grid-cols-4 gap-3">
            <input required value={rName} onChange={(e) => setRName(e.target.value)} placeholder={t("admin.name")} className={input} />
            <select value={rStars} onChange={(e) => setRStars(Number(e.target.value))} className={input}>
              {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} {t("admin.stars")}</option>)}
            </select>
            <input required value={rDesc} onChange={(e) => setRDesc(e.target.value)} placeholder={t("admin.description")} className={`${input} md:col-span-2`} />
            <button className="md:col-span-4 w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> {t("admin.addReview")}
            </button>
          </form>
          <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
            {reviews.map((r) => (
              <div key={r.id} className="flex items-center gap-3 bg-secondary/40 border border-border rounded-xl p-3">
                <div className="flex gap-0.5 text-yellow-400 shrink-0">
                  {Array.from({ length: r.stars }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <div className="font-semibold text-sm shrink-0">{r.name}</div>
                <p className="flex-1 text-sm text-muted-foreground truncate text-end">{r.description}</p>
                <button onClick={() => delReview(r.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t("admin.noItems")}</p>}
          </div>
        </section>
      )}
    </div>
  );
}

function FeatureEditor({
  label, dir, items, onChange, onAdd, onRemove, addLabel,
}: {
  label: string;
  dir: "rtl" | "ltr";
  items: string[];
  onChange: (idx: number, v: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  addLabel: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-1 space-y-2">
        {items.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={f}
              dir={dir}
              onChange={(e) => onChange(i, e.target.value)}
              className={input + " flex-1"}
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-destructive hover:bg-destructive/10 p-2 rounded-lg shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>
    </div>
  );
}

const input = "w-full bg-input/40 border border-border rounded-xl px-4 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:border-primary transition";
