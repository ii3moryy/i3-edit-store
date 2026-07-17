import { allApps } from "@/lib/plans";
import { PlansGrid } from "@/components/PlansGrid";
import { useI18n } from "@/lib/i18n";
import { usePlans } from "@/hooks/usePlans";

export default function PlansPage() {
  const { t } = useI18n();
  const plans = usePlans();
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center">{t("plans.title")}</h1>
      <p className="text-center text-muted-foreground mt-3 max-w-xl mx-auto">
        {t("plans.sub")}
      </p>

      <div className="mt-12">
        <PlansGrid plans={plans} />
      </div>

      <div className="mt-16 max-w-3xl mx-auto bg-card border border-border rounded-2xl p-6 text-center">
        <h2 className="text-xl font-bold">{t("plans.includedTitle")}</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {allApps.map((a) => (
            <span key={a} className="bg-secondary/60 border border-border rounded-full px-4 py-1.5 text-sm">
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}