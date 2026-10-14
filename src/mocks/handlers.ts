import { http, HttpResponse } from "msw";
import { TWebhook, TWebhookPaginatedDataResponse } from "../features/webhooks/types";

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
    const records: TWebhook[] = [
      { id: "wh_001", name: "User created", url: "https://example.com/hooks/users", active: true, created_at: "2025-01-06T09:00:00.000Z" },
      { id: "wh_002", name: "Order updated", url: "https://example.com/hooks/orders", active: true, created_at: "2025-01-07T10:15:00.000Z" },
      { id: "wh_003", name: "Payment received", url: "https://example.com/hooks/payments", active: true, created_at: "2025-01-08T11:30:00.000Z" },
      { id: "wh_004", name: "Subscription canceled", url: "https://example.com/hooks/subscriptions", active: false, created_at: "2025-01-09T12:45:00.000Z" },
      { id: "wh_005", name: "Invoice paid", url: "https://example.com/hooks/invoices", active: true, created_at: "2025-01-10T14:00:00.000Z" },
      { id: "wh_006", name: "User deleted", url: "https://example.com/hooks/users/deleted", active: false, created_at: "2025-01-11T15:15:00.000Z" },
      { id: "wh_007", name: "Shipment created", url: "https://example.com/hooks/shipments", active: true, created_at: "2025-01-12T16:30:00.000Z" },
      { id: "wh_008", name: "Refund issued", url: "https://example.com/hooks/refunds", active: true, created_at: "2025-01-13T17:45:00.000Z" },
      { id: "wh_009", name: "Cart abandoned", url: "https://example.com/hooks/carts", active: false, created_at: "2025-01-14T08:00:00.000Z" },
      { id: "wh_010", name: "Product updated", url: "https://example.com/hooks/products", active: true, created_at: "2025-01-15T09:15:00.000Z" },
      { id: "wh_011", name: "Inventory changed", url: "https://example.com/hooks/inventory", active: true, created_at: "2025-01-16T10:30:00.000Z" },
      { id: "wh_012", name: "Customer updated", url: "https://example.com/hooks/customers", active: true, created_at: "2025-01-17T11:45:00.000Z" },
      { id: "wh_013", name: "Address verified", url: "https://example.com/hooks/addresses/verified", active: false, created_at: "2025-01-18T13:00:00.000Z" },
      { id: "wh_014", name: "Return requested", url: "https://example.com/hooks/returns", active: true, created_at: "2025-01-19T14:15:00.000Z" },
      { id: "wh_015", name: "Coupon redeemed", url: "https://example.com/hooks/coupons/redeemed", active: true, created_at: "2025-01-20T15:30:00.000Z" },
      { id: "wh_016", name: "Review submitted", url: "https://example.com/hooks/reviews", active: false, created_at: "2025-01-21T16:45:00.000Z" },
      { id: "wh_017", name: "Warehouse updated", url: "https://example.com/hooks/warehouses", active: true, created_at: "2025-01-22T08:00:00.000Z" },
      { id: "wh_018", name: "Gift card issued", url: "https://example.com/hooks/gift-cards/issued", active: true, created_at: "2025-01-23T09:15:00.000Z" },
      { id: "wh_019", name: "Delivery delayed", url: "https://example.com/hooks/deliveries/delayed", active: false, created_at: "2025-01-24T10:30:00.000Z" },
      { id: "wh_020", name: "Account suspended", url: "https://example.com/hooks/accounts/suspended", active: true, created_at: "2025-01-25T11:45:00.000Z" },
      { id: "wh_021", name: "Payout completed", url: "https://example.com/hooks/payouts", active: true, created_at: "2025-01-26T13:00:00.000Z" },
    ];
    const params = new URL(request.url).searchParams;
    const page = Math.max(1, Number(params.get("page")) || 1);
    const limit = Math.max(1, Number(params.get("limit")) || 10);
    const search = (params.get("search") || "").toLowerCase();
    const filtered = records.filter(webhook => `${webhook.name} ${webhook.url}`.toLowerCase().includes(search));
    const lastPage = Math.max(1, Math.ceil(filtered.length / limit));
    const currentPage = Math.min(page, lastPage);
    const offset = (currentPage - 1) * limit;
    const response: TWebhookPaginatedDataResponse = {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
      pages: { current: currentPage, last: lastPage },
      results: { total: filtered.length, limitation: limit },
    };
    return HttpResponse.json(response);
  }),
];
