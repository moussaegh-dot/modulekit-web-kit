import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@moussaegh-dot/modulekit-auth/AuthProvider.jsx";
import AuthGuard from "@moussaegh-dot/modulekit-auth/AuthGuard.jsx";
import { ModuleProvider } from "@moussaegh-dot/modulekit-engine/pages/ModuleProvider.jsx";
import RouteRenderer from "@moussaegh-dot/modulekit-engine/router/RouteRenderer.jsx";
import PageLoader from "@moussaegh-dot/modulekit-engine/ui/PageLoader.jsx";
import MainLayout from "@moussaegh-dot/modulekit-shell/layouts/MainLayout.jsx";
import { ThemeProvider } from "@moussaegh-dot/modulekit-shell/context/ThemeContext.jsx";
import { ToastProvider } from "@moussaegh-dot/modulekit-shell/context/ToastContext.jsx";
import { ModalProvider } from "@moussaegh-dot/modulekit-crud/form/modal/ModalProvider.jsx";

import LoginPage from "./pages/LoginPage";
import KitInspectorPage from "./pages/KitInspectorPage";

// Ordre des providers : Toast → Theme → Auth → Module → Modal (le moteur lit l'auth, les modales lisent le moteur).
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ThemeProvider>
          <AuthProvider>
            <ModuleProvider>
              <ModalProvider>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/__kit" element={<KitInspectorPage />} />

                  {/* Espace connecté : les pages viennent du manifeste privé. */}
                  <Route
                    path="/app/*"
                    element={
                      <AuthGuard fallback={<PageLoader />} redirectTo="/login">
                        <MainLayout />
                      </AuthGuard>
                    }
                  >
                    <Route path="*" element={<RouteRenderer />} />
                  </Route>

                  {/* Public : routes du manifeste public. */}
                  <Route path="*" element={<RouteRenderer />} />
                </Routes>
              </ModalProvider>
            </ModuleProvider>
          </AuthProvider>
        </ThemeProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
