import { Login } from "../features/auth/ui/Login";
import WebhooksDataTable from "../features/webhooks/WebhooksDataTable";
import { useAuth } from "../features/auth/hooks/useAuth";

function App() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  return isAuthenticated ? (
    <WebhooksDataTable onLogout={logout} />
  ) : (
    <Login onLogin={login} isLoading={isLoading} />
  );
}

export default App;
