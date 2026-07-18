import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/hooks/useAuth";
import App from "./App";
import "./styles.css";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <AuthProvider>
            <I18nProvider>
              <App />
            </I18nProvider>
          </AuthProvider>
        </HashRouter>
      </QueryClientProvider>
    </StrictMode>
  );
} else {
  console.error("Root element not found");
  if (document.body) {
    document.body.innerHTML = "<h1 style='color:red'>Error: Root element not found</h1>";
  }
}