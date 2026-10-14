import { FormEvent, useEffect, useState } from "react";
import { getWebhooks, UnauthorizedError } from "../api/get-webhooks";
import { TWebhook } from "../types";

const PAGE_SIZE = 10;

export function useWebhooks(onLogout: () => Promise<void>) {
  const [webhooks, setWebhooks] = useState<TWebhook[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getWebhooks({ page, limit: PAGE_SIZE, search })
      .then(result => {
        if (!active) return;
        setWebhooks(result.items);
        setPage(result.pages?.current ?? page);
        setLastPage(result.pages?.last ?? Math.max(1, Math.ceil(result.total / PAGE_SIZE)));
      })
      .catch(reason => {
        if (!active) return;
        if (reason instanceof UnauthorizedError) {
          setError("Сесію завершено. Увійдіть знову.");
          void onLogout();
        } else {
          setError("Не вдалося завантажити вебхуки. Спробуйте ще раз.");
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, search, onLogout]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return {
    webhooks,
    page,
    lastPage,
    searchInput,
    setSearchInput,
    loading,
    error,
    submitSearch,
    previousPage: () => setPage(current => Math.max(1, current - 1)),
    nextPage: () => setPage(current => Math.min(lastPage, current + 1)),
  };
}
