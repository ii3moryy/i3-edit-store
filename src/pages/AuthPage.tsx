import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { lang } = useI18n();
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto bg-card p-8 rounded-2xl border border-border">
        <h1 className="text-2xl font-extrabold text-center mb-6">
          {isLogin ? (lang === "en" ? "Login" : "تسجيل الدخول") : lang === "en" ? "Sign Up" : "إنشاء حساب"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">
                {lang === "en" ? "Name" : "الاسم"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              {lang === "en" ? "Email" : "البريد الإلكتروني"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {lang === "en" ? "Password" : "كلمة المرور"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50"
          >
            {loading ? "..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-muted-foreground mt-6">
          {isLogin ? lang === "en" ? "Don't have an account?" : "ليس لديك حساب؟" : lang === "en" ? "Already have an account?" : "هل لديك حساب بالفعل؟"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-primary hover:underline font-semibold"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}