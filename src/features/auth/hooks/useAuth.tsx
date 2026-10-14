import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { LoginResult, User } from "../types";
import { FINGERPRINT_KEY } from "../config/constants";
import { apiFetch } from "../api/api-fetch";
import { getCurrentUser } from "../api/get-current-user";

function getFingerprint(): string {
  const stored = window.localStorage.getItem(FINGERPRINT_KEY);
  if (stored && /^[a-f0-9]{32}$/i.test(stored)) return stored;
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  const fingerprint = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  window.localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  return fingerprint;
}

type TAuthStatus = "checking" | "authenticated" | "unauthenticated";
type TAuthContextValue = {
  user: User | null;
  status: TAuthStatus;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<TAuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<TAuthStatus>("checking");

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      try {
        const currentUser = await getCurrentUser(getFingerprint());
        if (active) {
          setUser(currentUser);
          setStatus(currentUser ? "authenticated" : "unauthenticated");
        }
      } catch {
        if (active) setStatus("unauthenticated");
      }
    };
    void restoreSession();
    return () => { active = false; };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const fingerprint = getFingerprint();
      const loginResponse = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Captcha-Token": "mock-captcha-token" },
        body: JSON.stringify({ email, password, fingerprint }),
      });
      if (loginResponse.status === 422) {
        const body = await loginResponse.json() as { errors?: { email?: string; password?: string } };
        return { fieldErrors: body.errors, message: body.errors ? undefined : "Не вдалося увійти. Спробуйте ще раз." };
      }
      if (!loginResponse.ok) return { message: "Не вдалося увійти. Спробуйте ще раз." };
      const body = await loginResponse.json() as { device_session_token: string };
      const issueResponse = await apiFetch("/auth/token/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_session_token: body.device_session_token, fingerprint }),
      });
      if (!issueResponse.ok) return { message: "Не вдалося створити сесію." };
      const currentUser = await getCurrentUser(fingerprint);
      if (!currentUser) return { message: "Сесію завершено. Увійдіть ще раз." };
      setUser(currentUser);
      setStatus("authenticated");
      return {};
    } catch {
      return { message: "Не вдалося з’єднатися із сервером." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const fingerprint = getFingerprint();
    try {
      await apiFetch("/auth/token/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint }),
      });
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  return <AuthContext.Provider value={{ user, status, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
