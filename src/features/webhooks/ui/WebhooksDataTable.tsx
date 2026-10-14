import { useWebhooks } from "../hooks/useWebhooks";
import "./WebhooksDataTable.css";

export function WebhooksDataTable({ onLogout }: { onLogout: () => Promise<void> }) {
  const {
    webhooks,
    page,
    lastPage,
    searchInput,
    setSearchInput,
    loading,
    error,
    submitSearch,
    previousPage,
    nextPage,
  } = useWebhooks(onLogout);

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
        <button type="button" onClick={previousPage} disabled={page <= 1 || loading}>Попередня</button>
        <span>Сторінка {page} з {lastPage}</span>
        <button type="button" onClick={nextPage} disabled={page >= lastPage || loading}>Наступна</button>
      </nav>
    </main>
  );
}
