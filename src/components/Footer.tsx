import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="container mx-auto py-6 px-4 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>{t("footer.rights")}</div>
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-md w-7 h-7 grid place-items-center font-bold text-xs">i3</div>
          <span>i3 Store</span>
        </div>
      </div>
    </footer>
  );
}
