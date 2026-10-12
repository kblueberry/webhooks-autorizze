import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "../features/auth";
import { LoginPage, WebhooksPage } from "../pages";

function AuthLoading() {
  return <main role="status" aria-live="polite">Перевіряємо сесію…</main>;
}

function RequireAuth() {
  const { status } = useAuth();
  if (status === "checking") return <AuthLoading />;
  if (status === "unauthenticated") return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RequireGuest() {
  const { status } = useAuth();
  if (status === "checking") return <AuthLoading />;
  if (status === "authenticated") return <Navigate to="/" replace />;
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<RequireGuest />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/" element={<WebhooksPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
