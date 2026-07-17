import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LanguageGate } from "@/components/LanguageGate";
import { useAuth } from "@/hooks/useAuth";
import HomePage from "@/pages/HomePage";
import PlansPage from "@/pages/PlansPage";
import OrderPage from "@/pages/OrderPage";
import AdminPage from "@/pages/AdminPage";
import AuthPage from "@/pages/AuthPage";
import NotFoundPage from "@/pages/NotFoundPage";

function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="container mx-auto py-20 text-center text-muted-foreground">...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <AdminPage />;
}

export default function App() {
  return (
    <LanguageGate>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </LanguageGate>
  );
}
