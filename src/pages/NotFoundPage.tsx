import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { lang } = useI18n();

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-extrabold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        {lang === "en" ? "Page not found" : "الصفحة غير موجودة"}
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
      >
        {lang === "en" ? "Go Home" : "الذهاب إلى الرئيسية"}
      </button>
    </div>
  );
}