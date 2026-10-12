import { WebhookList } from "../types";

export type GetWebhooksParams = {
  page: number;
  limit: number;
  search?: string;
};

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function getWebhooks({ page, limit, search = "" }: GetWebhooksParams): Promise<WebhookList> {
  const query = new URLSearchParams({ page: String(page), limit: String(limit), search });
  const response = await fetch(`/v1/webhooks?${query.toString()}`, {
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });

  if (response.status === 401) throw new UnauthorizedError();
  if (!response.ok) throw new Error("Не вдалося завантажити вебхуки.");
  return response.json() as Promise<WebhookList>;
}
