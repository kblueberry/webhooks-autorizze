# API mocks

MSW is enabled in local development through `.env.development`. To disable it, set `REACT_APP_API_MOCKING` to a value other than `enabled` and restart the dev server. Mocking is never enabled in production builds.

Add or edit request handlers in `handlers.ts`; the browser worker and Jest server share them. Keep handlers focused on API behavior and response contracts. Feature components should call an API client rather than import MSW handlers directly.

The generated service worker is `public/mockServiceWorker.js`. Regenerate it after MSW upgrades with `npx msw init public --save`.
