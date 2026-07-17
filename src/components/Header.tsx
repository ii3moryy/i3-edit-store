import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";

export function Header() {
  const { t, lang, setLang } = useI18n();
  const other: Lang = lang === "ar" ? "en" : "ar";
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2" onClick={close}>
          <div className="bg-primary text-primary-foreground rounded-lg w-9 h-9 grid place-items-center font-bold">i3</div>
          <span className="font-bold">i3 Store</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-card/60 border border-border rounded-full px-2 py-1.5">
          <NavLink to="/" exact>{t("nav.home")}</NavLink>
          <NavLink to="/plans">{t("nav.plans")}</NavLink>
          <Link to="/order" className="px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground hover:opacity-90 transition">{t("nav.order")}</Link>
          <button
            onClick={() => setLang(other)}
            className="px-3 py-1.5 rounded-full text-xs text-muted-foreground border border-border hover:bg-accent transition"
          >
            {other.toUpperCase()}
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="md:hidden p-2 rounded-lg border border-border bg-card/60 hover:bg-accent transition"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
             <MobileLink to="/" exact onClick={close}>{t("nav.home")}</MobileLink>
            <MobileLink to="/plans" onClick={close}>{t("nav.plans")}</MobileLink>
            <Link to="/order" onClick={close} className="px-4 py-2.5 rounded-xl text-center bg-primary text-primary-foreground font-semibold">{t("nav.order")}</Link>
            <button
              onClick={() => { setLang(other); close(); }}
              className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground border border-border hover:bg-accent transition"
            >
              {other.toUpperCase()}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children, exact }: { to: string; children: React.ReactNode; exact?: boolean }) {
  const { pathname } = useLocation();
  const active = exact ? pathname === to : pathname.startsWith(to);
  return (
    <Link to={to} className={`px-3 py-1.5 rounded-full text-sm hover:bg-accent transition ${active ? "bg-accent" : ""}`}>
      {children}
    </Link>
  );
}

function MobileLink({ to, children, exact, onClick }: { to: string; children: React.ReactNode; exact?: boolean; onClick?: () => void }) {
  const { pathname } = useLocation();
  const active = exact ? pathname === to : pathname.startsWith(to);
  return (
    <Link to={to} onClick={onClick} className={`px-4 py-2.5 rounded-xl text-sm hover:bg-accent transition ${active ? "bg-accent" : ""}`}>
      {children}
    </Link>
  );
}
