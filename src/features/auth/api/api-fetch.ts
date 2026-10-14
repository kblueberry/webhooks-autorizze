import { getCsrfToken, resetCsrfToken } from "./get-csrf-token";

export async function apiFetch(path: string, init: RequestInit = {}, retryCsrf = true): Promise<Response> {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers);
  headers.set("X-Requested-With", "XMLHttpRequest");
  if (method === "POST" || method === "PUT") headers.set("X-CSRF-TOKEN", await getCsrfToken());
  const response = await fetch(path, { ...init, headers });
  if (response.status === 419 && retryCsrf) {
    resetCsrfToken();
    await getCsrfToken();
    return apiFetch(path, init, false);
  }
  return response;
}
