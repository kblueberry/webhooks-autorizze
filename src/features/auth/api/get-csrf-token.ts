let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;

export async function getCsrfToken(): Promise<string> {
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

export function resetCsrfToken(): void {
  csrfToken = null;
}
