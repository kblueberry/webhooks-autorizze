import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    const credentials = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (
      credentials.email !== "demo@example.com" ||
      credentials.password !== "password123"
    ) {
      return HttpResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    return HttpResponse.json({ token: "mock-session-token" });
  }),

  http.get("/api/webhooks", () =>
    HttpResponse.json([
      { id: "wh_001", event: "user.created", status: "delivered" },
      { id: "wh_002", event: "order.updated", status: "pending" },
    ]),
  ),
];
