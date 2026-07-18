import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { lang } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          {lang === "en" ? "Premium Adobe Apps" : "تطبيقات Adobe المتميزة"}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {lang === "en"
            ? "Get all professional Adobe apps at a great price. We activate the subscription directly on your personal account."
            : "احصل على جميع تطبيقات Adobe الاحترافية بسعر رائع. نقوم بتفعيل الاشتراك مباشرة على حسابك الشخصي."}
        </p>
        <button
          onClick={() => navigate("/plans")}
          className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:shadow-[var(--shadow-glow)] transition text-lg font-semibold"
        >
          {lang === "en" ? "View Plans" : "عرض الخطط"}
        </button>
      </div>
    </div>
  );
}