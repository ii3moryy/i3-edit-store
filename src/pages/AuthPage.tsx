import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

export default function AuthPage() {
  const { t } = useI18n();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  if (!loading && user) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) setErr(error);
    else if (mode === "signup") setErr(t("auth.verifyEmail"));
    else nav("/admin");
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-card border border-border rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center">
          {mode === "signin" ? t("auth.signin") : t("auth.signup")}
        </h1>
        <p className="text-center text-muted-foreground text-sm mt-1">
          {mode === "signup" ? t("auth.signupNote") : t("auth.signinNote")}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.email")}
            className="w-full bg-input/40 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
          />
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.password")}
            className="w-full bg-input/40 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
          />
          {err && <p className="text-sm text-destructive text-end">{err}</p>}
          <button
            disabled={busy}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {busy ? "..." : mode === "signin" ? t("auth.login") : t("auth.createAccount")}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); }}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? t("auth.noAccount") : t("auth.hasAccount")}
        </button>
      </div>
    </div>
  );
}
