import { useEffect, useState } from "react";
import { useI18n, type Lang } from "@/lib/i18n";

export function LanguageGate({ children }: { children: React.ReactNode }) {
  const { setLang } = useI18n();
  const [chosen, setChosen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    setChosen(!!saved);
  }, []);

  const pick = (l: Lang) => {
    setLang(l);
    setChosen(true);
  };

  if (chosen) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background animate-fade-in" style={{ backgroundImage: "var(--gradient-hero)" }}>
      <div className="text-center px-6">
        <div className="mx-auto bg-primary text-primary-foreground rounded-2xl w-16 h-16 grid place-items-center font-extrabold text-2xl mb-6 shadow-[var(--shadow-glow)]">i3</div>
        <h1 className="text-3xl md:text-4xl font-extrabold">Welcome / مرحباً</h1>
        <p className="text-muted-foreground mt-2">Choose your language / اختر لغتك</p>
        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={() => pick("ar")}
            className="group bg-card border border-border hover:border-primary rounded-2xl p-6 transition hover-scale"
          >
            <div className="text-3xl">🇸🇦</div>
            <div className="mt-2 font-bold">العربية</div>
            <div className="text-xs text-muted-foreground mt-1">Arabic</div>
          </button>
          <button
            onClick={() => pick("en")}
            className="group bg-card border border-border hover:border-primary rounded-2xl p-6 transition hover-scale"
          >
            <div className="text-3xl">ᴇɴ</div>
            <div className="mt-2 font-bold">English</div>
            <div className="text-xs text-muted-foreground mt-1">الإنجليزية</div>
          </button>
        </div>
      </div>
    </div>
  );
}