# Copilot instructions for `webhooks-autorizze`

- This repository is currently a minimal Create React App + TypeScript app, not a multi-service or backend-driven project. The app boots in `src/index.tsx`, renders the root `App` component, and keeps UI composition simple.
- The main application entry is `src/App.tsx`. Treat it as the central screen/component for the current app and keep new UI organized under `src/` rather than creating new top-level architectural layers.
- Styling is plain CSS, not CSS modules, Tailwind, or a component-library setup. The existing patterns live in `src/App.css` and `src/index.css`; prefer matching the current naming and global styling conventions when adding styles.
- There is no custom state management, data layer, or API client yet. Data flow is direct render-to-DOM React state; if new app behavior is added, keep state local unless a clear cross-component need emerges.
- The only explicit runtime wiring beyond React is `reportWebVitals` in `src/reportWebVitals.ts`, which is invoked from `src/index.tsx` and used for browser performance metrics. Do not remove it unless you are intentionally disabling analytics/perf reporting.
- Tests use the CRA + Testing Library setup. The example in `src/App.test.tsx` renders a component and uses `screen.getByText(...)` plus `toBeInTheDocument()`. Follow that pattern for UI assertions.
- Standard project commands from the repo root are: `npm start` for dev server, `npm test` for interactive tests, and `npm run build` for production build. For CI-style test runs, prefer `CI=true npm test -- --watch=false`.
- Keep TypeScript types explicit and consistent with the default CRA setup. Do not introduce advanced abstractions or framework-specific patterns unless they are clearly needed for the feature.
- The app does not yet include a backend, env file, or external service integration. Avoid assuming API endpoints, environment variables, or authentication flows exist unless you are explicitly adding them.
- The repo’s root `README.md` is the default CRA template and should not be treated as product documentation. Use the actual code in `src/` and `package.json` as the source of truth for behavior.
- When adding new screens or components, prefer small, composable React functions and keep behavior close to the relevant UI. The current project is intentionally lightweight and does not have feature folders or domain modules yet.
- `public/` contains static assets and HTML shell files; do not put app logic there. Use it only for assets such as `index.html`, manifests, and static files.
- If you are introducing new files, follow the current naming pattern: PascalCase React component files in `src/`, CSS alongside them, and tests adjacent to the component under test.
- Preserve the default CRA developer experience: minimal dependencies, no custom build pipeline, and straightforward React composition.
