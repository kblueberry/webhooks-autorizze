import { Login, useAuth } from "../../../features/auth";

export function LoginPage() {
  const { login, isLoading } = useAuth();

  return <Login onLogin={login} isLoading={isLoading} />;
}
