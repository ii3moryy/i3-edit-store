import { useI18n } from "@/lib/i18n";

export default function AdminPage() {
  const { lang } = useI18n();

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold mb-8">
        {lang === "en" ? "Admin Panel" : "لوحة التحكم"}
      </h1>
      <div className="bg-card p-8 rounded-2xl border border-border">
        <p className="text-muted-foreground">
          {lang === "en" ? "Admin features coming soon" : "ستكون ميزات الإدارة متاحة قريباً"}
        </p>
      </div>
    </div>
  );
}