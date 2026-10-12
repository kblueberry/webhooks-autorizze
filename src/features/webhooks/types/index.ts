export type Webhook = {
  id: string;
  name: string;
  url: string;
};

export type WebhookList = {
  items: Webhook[];
  total: number;
};
