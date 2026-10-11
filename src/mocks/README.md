# API mocks

MSW is enabled in local development through `.env.development`. To disable it, set `REACT_APP_API_MOCKING` to a value other than `enabled` and restart the dev server. Mocking is never enabled in production builds.

Add or edit request handlers in `handlers.ts`; the browser worker and Jest server share them. The example routes are `POST /api/login` (demo credentials: `demo@example.com` / `password123`) and `GET /api/webhooks`. The login UI does not call the API yet, so connect it to `/api/login` when adding API-backed authentication.

The generated service worker is `public/mockServiceWorker.js`. Regenerate it after MSW upgrades with `npx msw init public --save`.
