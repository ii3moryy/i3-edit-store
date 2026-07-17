import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">{t("notfound.home")}</Link>
      </div>
    </div>
  );
}