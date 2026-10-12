import { http, HttpResponse } from "msw";

const CSRF_TOKEN = "mock-csrf-token";
const SESSION_DURATION_MS = 30_000;
const DEVICE_TOKEN = "mock-device-session-token";
let sessionExpiresAt = 0;
let deviceTokenIssued = false;

const validFingerprint = (value: unknown): value is string =>
  typeof value === "string" && /^[a-f0-9]{32}$/i.test(value);

const csrfIsValid = (request: Request) => request.headers.get("X-CSRF-TOKEN") === CSRF_TOKEN;
const sessionIsValid = () => Date.now() < sessionExpiresAt;

export const handlers = [
  http.get("/csrf", () => new HttpResponse(null, { status: 204, headers: { "X-CSRF-TOKEN": CSRF_TOKEN } })),

  http.post("/auth/login", async ({ request }) => {
    if (!csrfIsValid(request)) return HttpResponse.json({}, { status: 419 });
    if (!request.headers.get("X-Captcha-Token")) {
      return HttpResponse.json({ message: "Captcha token required" }, { status: 422 });
    }
    const credentials = (await request.json()) as { email?: string; password?: string; fingerprint?: string };
    if (!validFingerprint(credentials.fingerprint)) return HttpResponse.json({ message: "Invalid fingerprint" }, { status: 422 });
    if (credentials.email !== "demo@example.com" || credentials.password !== "goo_fFF234_r") {
      return HttpResponse.json({ errors: { password: "Невірний email або пароль" } }, { status: 422 });
    }
    deviceTokenIssued = true;
    return HttpResponse.json({ device_session_token: DEVICE_TOKEN });
  }),

  http.post("/auth/token/issue", async ({ request }) => {
    if (!csrfIsValid(request)) return HttpResponse.json({}, { status: 419 });
    const body = (await request.json()) as { device_session_token?: string; fingerprint?: string };
    if (!deviceTokenIssued || body.device_session_token !== DEVICE_TOKEN || !validFingerprint(body.fingerprint)) {
      return HttpResponse.json({}, { status: 422 });
    }
    deviceTokenIssued = false;
    sessionExpiresAt = Date.now() + SESSION_DURATION_MS;
    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/auth/token/rotate", async ({ request }) => {
    if (!csrfIsValid(request)) return HttpResponse.json({}, { status: 419 });
    const body = (await request.json()) as { fingerprint?: string };
    if (!validFingerprint(body.fingerprint) || !sessionIsValid()) return HttpResponse.json({}, { status: 400 });
    sessionExpiresAt = Date.now() + SESSION_DURATION_MS;
    return new HttpResponse(null, { status: 200 });
  }),

  http.post("/auth/token/revoke", async ({ request }) => {
    if (!csrfIsValid(request)) return HttpResponse.json({}, { status: 419 });
    sessionExpiresAt = 0;
    deviceTokenIssued = false;
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/v1/me", () => {
    if (!sessionIsValid()) return HttpResponse.json({}, { status: 401 });
    return HttpResponse.json({ id: "user_001", email: "demo@example.com", first_name: "Demo", last_name: "User", name: "Demo User" });
  }),

  http.get("/v1/webhooks", ({ request }) => {
    if (!sessionIsValid()) return HttpResponse.json({}, { status: 401 });
    const records = [
      { id: "wh_001", name: "User created", url: "https://example.com/hooks/users" },
      { id: "wh_002", name: "Order updated", url: "https://example.com/hooks/orders" },
      { id: "wh_003", name: "Payment received", url: "https://example.com/hooks/payments" },
      { id: "wh_004", name: "Subscription canceled", url: "https://example.com/hooks/subscriptions" },
      { id: "wh_005", name: "Invoice paid", url: "https://example.com/hooks/invoices" },
      { id: "wh_006", name: "User deleted", url: "https://example.com/hooks/users/deleted" },
      { id: "wh_007", name: "Shipment created", url: "https://example.com/hooks/shipments" },
      { id: "wh_008", name: "Refund issued", url: "https://example.com/hooks/refunds" },
      { id: "wh_009", name: "Cart abandoned", url: "https://example.com/hooks/carts" },
      { id: "wh_010", name: "Product updated", url: "https://example.com/hooks/products" },
      { id: "wh_011", name: "Inventory changed", url: "https://example.com/hooks/inventory" },
    ];
    const params = new URL(request.url).searchParams;
    const page = Math.max(1, Number(params.get("page")) || 1);
    const limit = Math.max(1, Number(params.get("limit")) || 10);
    const search = (params.get("search") || "").toLowerCase();
    const filtered = records.filter(webhook => `${webhook.name} ${webhook.url}`.toLowerCase().includes(search));
    const offset = (page - 1) * limit;
    return HttpResponse.json({ items: filtered.slice(offset, offset + limit), total: filtered.length });
  }),
];
