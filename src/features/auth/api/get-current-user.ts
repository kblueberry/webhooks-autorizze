import { User } from "../types";
import { apiFetch } from "./api-fetch";
import { rotateSession } from "./rotate-session";

export async function getCurrentUser(fingerprint: string): Promise<User | null> {
  let response = await apiFetch("/v1/me");
  if (response.status === 401) {
    if (!(await rotateSession(fingerprint))) return null;
    response = await apiFetch("/v1/me");
  }
  if (!response.ok) return null;
  return response.json() as Promise<User>;
}
