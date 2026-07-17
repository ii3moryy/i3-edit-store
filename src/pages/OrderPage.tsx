import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { type Plan } from "@/lib/plans";
import { usePlans } from "@/hooks/usePlans";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

const PAYPAL_EMAIL = "ii3Moryx211x@gmail.com";
const WHATSAPP = "201014083049";

export default function OrderPage() {
  const { t, lang } = useI18n();
  const isEn = lang === "en";
  const plans = usePlans().filter((p) => p.inStock);
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan");
  const [selectedId, setSelectedId] = useState<string>(planParam ?? plans[0]?.id ?? "");
  const selected: Plan | undefined =
    plans.find((p) => p.id === selectedId) ?? plans.find((p) => p.id === planParam) ?? plans[0];
  if (!selected) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold">{t("order.title")}</h1>
        <p className="text-muted-foreground mt-4">{isEn ? "No plans available right now." : "لا توجد خطط متاحة حالياً."}</p>
      </div>
    );
  }
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState("");
  const [appliedPct, setAppliedPct] = useState(0);
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const discountAmt = +(selected.price * (appliedPct / 100)).toFixed(2);
  const subtotal = +(selected.price - discountAmt).toFixed(2);
  const tax = +(subtotal * 0.06).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const planLabel = (p: Plan) => (isEn ? p.nameEn : p.name);
  const durationLabel = (p: Plan) => (isEn ? p.durationEn : p.duration);

  const applyPromo = async () => {
    const code = discount.trim().toUpperCase();
    if (!code) return;
    const { data } = await supabase
      .from("promo_codes" as any)
      .select("discount_percent,active")
      .eq("code", code)
      .maybeSingle();
    if (data && (data as any).active) {
      setAppliedPct((data as any).discount_percent);
      setPromoMsg({ ok: true, text: t("order.promoSuccess") + ` ${(data as any).discount_percent}%` });
    } else {
      setAppliedPct(0);
      setPromoMsg({ ok: false, text: t("order.promoInvalid") });
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const promoLine = appliedPct ? `%0A*${isEn ? "Discount Code" : "كود خصم"}:* ${encodeURIComponent(discount)} (-${appliedPct}%25)` : "";
    const msg = `*${isEn ? "New Order" : "طلب جديد"} - i3 Store*%0A%0A*${isEn ? "Plan" : "الخطة"}:* ${encodeURIComponent(planLabel(selected))}%0A*${isEn ? "Price" : "السعر"}:* $${selected.price}${promoLine}%0A*${isEn ? "Tax" : "الضرائب"}:* $${tax}%0A*${isEn ? "Total" : "الإجمالي"}:* $${total}%0A%0A*${isEn ? "Name" : "الاسم"}:* ${encodeURIComponent(name)}%0A*${isEn ? "Email" : "البريد"}:* ${encodeURIComponent(email)}%0A*${isEn ? "Phone" : "الهاتف"}:* ${encodeURIComponent(phone)}${notes ? `%0A*${isEn ? "Notes" : "ملاحظات"}:* ${encodeURIComponent(notes)}` : ""}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold">{t("order.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("order.sub")}</p>
      </div>

      <form onSubmit={submit} className="mt-10 space-y-6">
        {/* Plan */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className={`font-bold ${isEn ? "text-start" : "text-end"}`}>{t("order.choosePlan")}</h2>
          <div className="mt-4 space-y-3">
            {plans.map((p) => (
              <label
                key={p.id}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                  selected.id === p.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                }`}
              >
                <input type="radio" name="plan" checked={selected.id === p.id} onChange={() => setSelectedId(p.id)} className="accent-primary w-4 h-4" />
                <div className={`flex-1 ${isEn ? "text-start" : "text-end"}`}>
                  <div className="font-bold text-lg">${p.price}</div>
                  <div className="text-xs text-muted-foreground">{durationLabel(p)}</div>
                </div>
                <div className={`flex-1 ${isEn ? "text-start" : "text-end"}`}>
                  <div className="font-semibold">{planLabel(p)} {p.featured && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full mr-1">{t("plan.featured")}</span>}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Adobe Creative Cloud</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Personal */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className={`font-bold ${isEn ? "text-start" : "text-end"}`}>{t("order.personal")}</h2>
          <Field label={t("order.fullName")} isEn={isEn}>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={isEn ? "John Doe" : "أحمد محمد"} className={inputCls} />
          </Field>
          <Field label={t("order.email")} isEn={isEn}>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className={inputCls} />
          </Field>
          <Field label={t("order.phone")} isEn={isEn}>
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+966 5XX XXX XXXX" className={inputCls} />
          </Field>
        </div>

        {/* Discount */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className={`font-bold mb-3 ${isEn ? "text-start" : "text-end"}`}>{t("order.discount")}</h2>
          <div className="flex gap-2">
            <button type="button" onClick={applyPromo} className="bg-primary text-primary-foreground px-5 rounded-xl text-sm font-semibold">{t("order.apply")}</button>
            <input value={discount} onChange={(e) => { setDiscount(e.target.value); setAppliedPct(0); setPromoMsg(null); }} placeholder={t("order.discountPlaceholder")} className={inputCls} />
          </div>
          {promoMsg && (
            <p className={`text-xs mt-2 ${isEn ? "text-start" : "text-end"} ${promoMsg.ok ? "text-success" : "text-destructive"}`}>{promoMsg.text}</p>
          )}
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className={`font-bold mb-3 ${isEn ? "text-start" : "text-end"}`}>{t("order.notes")}</h2>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder={t("order.notesPlaceholder")} className={inputCls} />
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <Row label={t("order.selectedPlan")} value={planLabel(selected)} muted isEn={isEn} />
          <Row label={t("order.price")} value={`$${selected.price}.00`} isEn={isEn} />
          {appliedPct > 0 && <Row label={`${t("order.discountApplied")} (${appliedPct}%)`} value={`- $${discountAmt}`} accent="text-success" isEn={isEn} />}
          <Row label={t("order.tax")} value={`+ $${tax}`} accent="text-orange-400" isEn={isEn} />
          <div className="border-t border-border pt-3 flex justify-between items-center">
            <div className="text-2xl font-extrabold text-primary">${total}.00</div>
            <div className="font-semibold">{t("order.total")}</div>
          </div>
          <p className={`text-xs text-orange-400 ${isEn ? "text-start" : "text-end"}`}>* {t("order.taxNote")}</p>

          <div className="bg-blue-600/90 text-white rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="bg-white text-blue-700 rounded-md px-2 py-1 text-xs font-bold">PP</div>
              <div className="font-bold">{t("order.paypalTitle")}</div>
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <code className="bg-blue-800/60 px-2 py-1 rounded text-xs">{PAYPAL_EMAIL}</code>
              <span>{t("order.paypalAccount")}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-yellow-300 font-bold text-lg">${total}.00</div>
              <span className="text-sm">{t("order.transferAmount")}</span>
            </div>
          </div>

          <div className={`bg-success/15 border border-success/30 rounded-xl p-3 text-sm ${isEn ? "text-start" : "text-end"} text-success`}>
            {t("order.afterTransfer")}: +{WHATSAPP}
          </div>
        </div>

        <button type="submit" className="w-full bg-success text-success-foreground py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition">
          {t("order.submit")}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          {t("order.submitNote")}
        </p>
      </form>
    </div>
  );
}

const inputCls = "flex-1 bg-input/40 border border-border rounded-xl px-4 py-3 text-end placeholder:text-muted-foreground focus:outline-none focus:border-primary transition";

function Field({ label, children, isEn }: { label: string; children: React.ReactNode; isEn?: boolean }) {
  return (
    <div>
      <label className={`block text-sm mb-2 ${isEn ? "text-start" : "text-end"}`}>{label}</label>
      <div className="flex">{children}</div>
    </div>
  );
}

function Row({ label, value, muted, accent, isEn }: { label: string; value: string; muted?: boolean; accent?: string; isEn?: boolean }) {
  return (
    <div className={`flex items-center text-sm ${isEn ? "flex-row-reverse" : "justify-between"}`}>
      <span className={accent ?? (muted ? "text-muted-foreground" : "")}>{value}</span>
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
    </div>
  );
}