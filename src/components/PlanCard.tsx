import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import type { Plan } from "@/lib/plans";
import { useI18n } from "@/lib/i18n";

export function PlanCard({ plan }: { plan: Plan }) {
  const { t, lang } = useI18n();
  const isEn = lang === "en";
  const featured = plan.featured;
  const outOfStock = !plan.inStock;
  const displayName = isEn ? plan.nameEn : plan.name;
  const displayDuration = isEn ? plan.durationEn : plan.duration;
  const displayFeatures = isEn ? plan.featuresEn : plan.features;

  return (
    // Outer wrapper keeps space for the "Most Popular" badge so it's never clipped.
    // h-full + flex column makes every card the same height inside its grid row.
    <div className="relative h-full pt-3 flex">
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-md">
          {t("plan.featured")}
        </div>
      )}

      <div
        className={`relative flex-1 flex flex-col rounded-2xl p-6 border bg-[var(--gradient-card)] transition hover:-translate-y-1 overflow-hidden ${
          featured ? "border-primary shadow-[var(--shadow-glow)]" : "border-border"
        } ${outOfStock ? "opacity-80" : ""}`}
      >
        {/* Out of stock diagonal ribbon */}
        {outOfStock && (
          <div className="absolute top-4 -right-12 rotate-45 bg-destructive text-destructive-foreground text-[10px] font-bold tracking-wider uppercase px-12 py-1 shadow-lg z-20">
            {isEn ? "Out of Stock" : "نفذت الكمية"}
          </div>
        )}

        {!outOfStock && plan.save > 0 && (
          <div className="absolute top-4 right-4 bg-success/90 text-success-foreground text-xs font-bold px-2 py-1 rounded-md">
            {t("plan.save")} {plan.save}%
          </div>
        )}

        <div className={`mt-2 ${isEn ? "text-start" : "text-end"}`}>
          <div className="text-xs text-muted-foreground">{displayDuration}</div>
          <h3 className="text-lg font-bold mt-1">{displayName}</h3>
        </div>

        <div className={`mt-4 ${isEn ? "text-start" : "text-end"}`}>
          <div className={`flex items-baseline gap-2 ${isEn ? "" : "justify-end"}`}>
            <span className="line-through text-muted-foreground text-sm">${plan.original}</span>
            <span className="text-4xl font-extrabold">${plan.price}</span>
          </div>
          <div className="text-xs text-success mt-1">{t("plan.perMonth")} ${plan.perMonth} / {t("plan.month")}</div>
        </div>

        <ul className={`mt-5 space-y-2 text-sm flex-1 ${isEn ? "text-start" : "text-end"}`}>
          {displayFeatures.map((f) => (
            <li key={f} className={`flex items-center gap-2 ${isEn ? "" : "justify-end"}`}>
              <span>{f}</span>
              <Check className="w-4 h-4 text-success shrink-0" />
            </li>
          ))}
        </ul>

        {/* mt-auto pins the button to the bottom so all cards align */}
        {outOfStock ? (
          <button
            disabled
            className="mt-6 w-full block text-center rounded-xl py-3 font-semibold bg-muted text-muted-foreground cursor-not-allowed"
          >
            {isEn ? "Out of Stock" : "غير متوفر"}
          </button>
        ) : (
          <Link
            to={`/order?plan=${plan.id}`}
            className={`mt-6 block text-center rounded-xl py-3 font-semibold transition ${
              featured
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {t("plan.subscribe")}
          </Link>
        )}
      </div>
    </div>
  );
}
