import { useI18n } from "@/lib/i18n";

const plans = [
  {
    name: "Starter",
    price: "29.99",
    features: ["Photoshop", "Lightroom", "1 Year Support"],
  },
  {
    name: "Professional",
    price: "49.99",
    features: ["All Starter", "Premiere Pro", "After Effects", "2 Years Support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "99.99",
    features: ["All Apps", "Priority Support", "3 Years Support", "Custom License"],
  },
];

export default function PlansPage() {
  const { lang } = useI18n();

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold text-center mb-12">
        {lang === "en" ? "Choose Your Plan" : "اختر خطتك"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-8 rounded-2xl transition ${
              plan.featured
                ? "bg-gradient-to-b from-card to-card border-2 border-primary shadow-[var(--shadow-glow)]"
                : "bg-card border border-border hover:border-primary"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            <div className="text-3xl font-extrabold text-primary mb-6">
              ${plan.price}
              <span className="text-sm text-muted-foreground">/year</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-lg font-semibold transition ${
                plan.featured
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-card border border-primary text-primary hover:bg-primary/10"
              }`}
            >
              {lang === "en" ? "Choose Plan" : "اختر هذه الخطة"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}