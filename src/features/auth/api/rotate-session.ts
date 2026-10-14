import { apiFetch } from "./api-fetch";

let rotateRequest: Promise<boolean> | null = null;

export async function rotateSession(fingerprint: string): Promise<boolean> {
  if (!rotateRequest) {
    rotateRequest = apiFetch("/auth/token/rotate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint }),
    }).then(response => response.ok).catch(() => false).finally(() => { rotateRequest = null; });
  }
  return rotateRequest;
}
