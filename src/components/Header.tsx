import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-extrabold text-primary cursor-pointer" onClick={() => navigate("/")}>
            i3
          </div>
          <nav className="flex items-center gap-6">
            <button onClick={() => navigate("/")} className="hover:text-primary transition">
              {t("home")}
            </button>
            <button onClick={() => navigate("/plans")} className="hover:text-primary transition">
              {t("plans")}
            </button>
            {user && (
              <button onClick={() => navigate("/order")} className="hover:text-primary transition">
                {t("order")}
              </button>
            )}
            {user ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
              >
                {t("logout")}
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}