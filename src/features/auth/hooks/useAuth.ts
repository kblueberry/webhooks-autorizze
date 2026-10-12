import { useCallback, useState } from "react";
import { LoginResult, User } from "../types";
import { FINGERPRINT_KEY } from "../config/constants";

let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;
let rotateRequest: Promise<boolean> | null = null;

function getFingerprint(): string {
  const stored = window.localStorage.getItem(FINGERPRINT_KEY);
  if (stored && /^[a-f0-9]{32}$/i.test(stored)) return stored;
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  const fingerprint = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  window.localStorage.setItem(FINGERPRINT_KEY, fingerprint);
  return fingerprint;
}

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  if (!csrfRequest) {
    csrfRequest = fetch("/csrf", { headers: { "X-Requested-With": "XMLHttpRequest" } })
      .then(response => {
        if (!response.ok && response.status !== 204) throw new Error("Could not initialize CSRF protection");
        const token = response.headers.get("X-CSRF-TOKEN");
        if (!token) throw new Error("CSRF token missing from response");
        csrfToken = token;
        return token;
      })
      .finally(() => { csrfRequest = null; });
  }
  return csrfRequest;
}

async function apiFetch(path: string, init: RequestInit = {}, retryCsrf = true): Promise<Response> {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers);
  headers.set("X-Requested-With", "XMLHttpRequest");
  if (method === "POST" || method === "PUT") headers.set("X-CSRF-TOKEN", await getCsrfToken());
  const response = await fetch(path, { ...init, headers });
  if (response.status === 419 && retryCsrf) {
    csrfToken = null;
    await getCsrfToken();
    return apiFetch(path, init, false);
  }
  return response;
}

async function rotateSession(fingerprint: string): Promise<boolean> {
  if (!rotateRequest) {
    rotateRequest = apiFetch("/auth/token/rotate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint }),
    }).then(response => response.ok).catch(() => false).finally(() => { rotateRequest = null; });
  }
  return rotateRequest;
}

async function getCurrentUser(fingerprint: string): Promise<User | null> {
  let response = await apiFetch("/v1/me");
  if (response.status === 401) {
    if (!(await rotateSession(fingerprint))) return null;
    response = await apiFetch("/v1/me");
  }
  if (!response.ok) return null;
  return response.json() as Promise<User>;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    }
  }, []);

  return { user, isAuthenticated: Boolean(user), isLoading, login, logout };
}
