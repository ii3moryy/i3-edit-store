import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function OrderPage() {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">{lang === "en" ? "Please log in to place an order" : "يرجى تسجيل الدخول لتقديم طلب"}</p>
        <button onClick={() => navigate("/auth")} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">
          {lang === "en" ? "Go to Login" : "الذهاب إلى تسجيل الدخول"}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold text-center mb-12">
        {lang === "en" ? "Place Your Order" : "ضع طلبك"}
      </h1>
      <div className="max-w-2xl mx-auto bg-card p-8 rounded-2xl border border-border">
        <p className="text-muted-foreground mb-6">
          {lang === "en" ? "Order functionality coming soon!" : "ستكون وظيفة الطلب متاحة قريباً!"}
        </p>
      </div>
    </div>
  );
}