import { FormEvent, useEffect, useState } from "react";
import { getWebhooks, UnauthorizedError } from "../api/get-webhooks";
import { Webhook } from "../types";
import "./WebhooksDataTable.css";

const PAGE_SIZE = 10;

export function WebhooksDataTable({ onLogout }: { onLogout: () => Promise<void> }) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
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
        setTotal(result.total);
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

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="webhooks-page">
      <header className="webhooks-header">
        <h1>Вебхуки</h1>
        <button className="webhooks-logout" type="button" onClick={() => void onLogout()}>Вийти</button>
      </header>
      <form className="webhooks-search" onSubmit={submitSearch} role="search">
        <label htmlFor="webhooks-search-input">Пошук вебхуків</label>
        <input id="webhooks-search-input" value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Назва або URL" />
        <button type="submit">Знайти</button>
      </form>
      {error && <p className="webhooks-error" role="alert">{error}</p>}
      <div className="webhooks-table-wrap">
        <table className="webhooks-table">
          <thead><tr><th scope="col">Назва</th><th scope="col">URL</th><th scope="col">Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={3}>Завантаження…</td></tr> : webhooks.length === 0 ? <tr><td colSpan={3}>Вебхуків не знайдено.</td></tr> : webhooks.map(webhook => (
              <tr key={webhook.id}>
                <td>{webhook.name}</td><td><a href={webhook.url} target="_blank" rel="noreferrer">{webhook.url}</a></td>
                <td><button type="button" className="webhooks-edit" onClick={() => undefined}>Редагувати</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="webhooks-pagination" aria-label="Пагінація вебхуків">
        <button type="button" onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page <= 1 || loading}>Попередня</button>
        <span>Сторінка {page} з {pageCount}</span>
        <button type="button" onClick={() => setPage(current => Math.min(pageCount, current + 1))} disabled={page >= pageCount || loading}>Наступна</button>
      </nav>
    </main>
  );
}
