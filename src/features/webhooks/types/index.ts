export type TWebhook = {
  id: string;
  name: string;
  url: string;
  active: true;
  created_at: string;
};

export type TWebhookPaginatedDataResponse = {
  items: TWebhook[];
  total: number;
  pages?: {
    current: number;
    last: number;
  };
  results: {
    total: number;
    limitation: number
  };
};
