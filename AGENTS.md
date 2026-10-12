# Repository Guidelines

## Project Structure & Module Organization

This repository is a Create React App single-page application written in TypeScript. Application entry points are `src/index.tsx` and `src/components/App.tsx`. Feature UI lives in `src/components/` (including the login form and webhooks table); login validation is defined in `src/config/login-schema.ts`; styles are in `src/styles/`. Static assets and the HTML shell are in `public/`. Tests currently live beside the application in `src/`.

## Build, Test, and Development Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm start` runs the development server at `http://localhost:3000`.
- `npm test` starts the Create React App Jest runner in watch mode. Use `CI=true npm test -- --watchAll=false` for a one-time run.
- `npm run build` creates an optimized production build in `build/` and checks TypeScript during compilation.

## Coding Style & Naming Conventions
- This project follows Feature-Sliced Design (FSD)
- Follow the existing TypeScript and React patterns, with two-space indentation and semicolons.
- Use PascalCase for React component files and names (for example, `Login.tsx`), camelCase for hooks, descriptive kebab-case for config files and functions (for example, `login-schema.ts`), and uppercase for constants.
- Add feature UI components in `src/features/{feature_name}/ui/`, hooks in `src/features/{feature_name}/hooks/`, validation/configuration/constants in `src/features/{feature_name}/config/`, api functions in `src/mocks/` and styles in `src/styles/`.
- All files used externally outside the `src/features/{feature_name}/` level are exported via `src/features/{feature_name}/` index.ts file
- The project uses the `react-app` and `react-app/jest` ESLint configurations; do not add formatting or lint dependencies without need.

## Testing Guidelines

Tests use Jest and React Testing Library through Create React App. Name test files `*.test.tsx` or `*.test.ts` and place them near the code under test. Cover user-visible behavior such as form validation and submission, and run `npm test` before submitting changes. No coverage threshold is configured.

## Commit & Pull Request Guidelines

Recent commits use concise, imperative descriptions without a type prefix (for example, “create login form with validation”). Follow that style and keep each commit focused. Pull requests should explain the user-facing change, note relevant validation performed, and link an issue when applicable. Include screenshots for visual changes.

## Security & Configuration

Do not commit credentials, tokens, or environment-specific secrets. Keep dependency changes reflected in `package-lock.json` and avoid exposing authentication data in logs or UI errors.
