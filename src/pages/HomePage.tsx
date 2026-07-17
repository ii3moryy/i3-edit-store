import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Lock, Zap, ShieldCheck, Mail, Send, CreditCard, RefreshCw } from "lucide-react";
import { usePlans } from "@/hooks/usePlans";
import { PlansGrid } from "@/components/PlansGrid";
import { CreatorsMarquee } from "@/components/CreatorsMarquee";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

type Review = { id: string; name: string; stars: number; description: string };

export default function HomePage() {
  const { t, lang } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const plans = usePlans();

  useEffect(() => {
    supabase.from("reviews" as any).select("*").order("sort_order").then(({ data }) => {
      setReviews((data as any) ?? []);
    });
  }, []);

  const steps = [
    { n: "01", title: t("step.1.title"), desc: t("step.1.desc"), icon: CreditCard },
    { n: "02", title: t("step.2.title"), desc: t("step.2.desc"), icon: Send },
    { n: "03", title: t("step.3.title"), desc: t("step.3.desc"), icon: Mail },
    { n: "04", title: t("step.4.title"), desc: t("step.4.desc"), icon: RefreshCw },
  ];

  const faqs = [
    { q: t("faq.1.q"), a: t("faq.1.a") },
    { q: t("faq.2.q"), a: t("faq.2.a") },
    { q: t("faq.3.q"), a: t("faq.3.a") },
    { q: t("faq.4.q"), a: t("faq.4.a") },
    { q: t("faq.5.q"), a: t("faq.5.a") },
  ];

  const whyUs = [
    { icon: Lock, title: t("why.1.title"), desc: t("why.1.desc") },
    { icon: Zap, title: t("why.2.title"), desc: t("why.2.desc") },
    { icon: ShieldCheck, title: t("why.3.title"), desc: t("why.3.desc") },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="container mx-auto px-4 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold bg-primary/15 text-primary border border-primary/30 rounded-full px-4 py-1.5">
          {t("hero.badge")}
        </div>
        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight">
          {t("hero.title")}
          <span className="block mt-2 text-primary">{t("hero.subtitle")}</span>
        </h1>
        <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
          {t("hero.desc")}
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link to="/order" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-[var(--shadow-glow)]">
            {t("hero.order")}
          </Link>
          <Link to="/plans" className="bg-card border border-border px-6 py-3 rounded-xl font-semibold hover:bg-accent transition">
            {t("hero.viewPlans")}
          </Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-12">
          <div>
            <div className="text-2xl font-bold text-primary">&lt;1h</div>
            <div className="text-xs text-muted-foreground">{t("hero.activation")}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-xs text-muted-foreground">{t("hero.original")}</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {reviews.length > 0 && (
        <section className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center">{t("testimonials.title")}</h2>
          <style>{`
            @keyframes reviews-scroll {
              from { transform: translate3d(0,0,0); }
              to   { transform: translate3d(-50%,0,0); }
            }
            .reviews-track { animation: reviews-scroll 40s linear infinite; will-change: transform; }
            .reviews-track:hover { animation-play-state: paused; }
          `}</style>
          <div className="mt-8 md:mt-10 relative" dir="ltr">
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--background), transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--background), transparent)" }} />
            <div className="overflow-hidden">
              <div className="flex gap-3 md:gap-4 w-max reviews-track">
                {[...reviews, ...reviews].map((tItem, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-4 md:p-5 shrink-0 w-[240px] md:w-[320px]" dir={lang === "ar" ? "rtl" : "ltr"}>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5 text-yellow-400">
                        {Array.from({ length: tItem.stars }).map((_, j) => <Star key={j} className="w-3 h-3 md:w-4 md:h-4 fill-current" />)}
                      </div>
                      <div className="font-semibold text-xs md:text-sm">{tItem.name}</div>
                    </div>
                    <p className="mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground text-end line-clamp-2 md:line-clamp-3">{tItem.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PLANS */}
      <section id="plans" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center">{t("plans.title")}</h2>
        <p className="text-center text-muted-foreground mt-2">{t("plans.sub")}</p>
        <div className="mt-10">
          <PlansGrid plans={plans} />
        </div>
      </section>

      {/* CREATORS */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center">{t("creators.title")}</h2>
        <p className="text-center text-muted-foreground mt-2">{t("creators.sub")}</p>
        <CreatorsMarquee />
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center">{t("how.title")}</h2>
        <p className="text-center text-muted-foreground mt-2">{t("how.sub")}</p>
        <div className="grid md:grid-cols-2 gap-4 mt-10 max-w-4xl mx-auto">
          {steps.map((s) => (
            <div key={s.n} className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between gap-4">
              <s.icon className="w-8 h-8 text-primary shrink-0" />
              <div className="text-end flex-1">
                <div className="text-primary font-bold text-lg">
                  {s.n} <span className="text-foreground">{s.title}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center">{t("why.title")}</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-10 max-w-4xl mx-auto">
          {whyUs.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-2xl p-5 text-center">
              <f.icon className="w-8 h-8 text-primary mx-auto" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center">{t("faq.title")}</h2>
        <div className="mt-10 max-w-3xl mx-auto space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group bg-card border border-border rounded-2xl p-5 text-end">
              <summary className="cursor-pointer font-semibold list-none flex justify-between items-center">
                <span className="text-primary group-open:rotate-45 transition">+</span>
                <span>{f.q}</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">{t("cta.title")}</h2>
        <p className="text-muted-foreground mt-2">{t("cta.sub")}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="https://wa.me/201014083049" className="bg-success text-success-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            {t("cta.whatsapp")}
          </a>
          <Link to="/order" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            {t("cta.order")}
          </Link>
        </div>
      </section>
    </div>
  );
}