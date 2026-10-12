# Getting Started with Create React App

## Project structure

The source is organized around application setup and user-facing features:

```text
src/
├── app/                    # Application composition and app-level tests
├── features/
│   ├── auth/               # Login UI, validation, and feature styles
│   └── webhooks/           # Webhooks list/table UI
├── mocks/                  # Shared MSW handlers and browser/node setup
├── styles/                 # Global styles
├── index.tsx               # Browser entry point
└── reportWebVitals.ts
```

Keep feature-specific code together inside its feature folder. When a feature
grows, add its `hooks/`, `types/`, or `ui/` subfolders there;
avoid creating empty generic folders before they have a clear owner. Put code
in a shared folder only when multiple features actually use it. `app/` should
compose features and own application-wide providers and routing, while
`mocks/` remains the development/test API boundary.

## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

## Mock authentication

Start the app with MSW enabled (`REACT_APP_API_MOCKING=enabled npm start`). Use these test credentials:

- Email: `demo@example.com`
- Password: `goo_fFF234_r`

The mock session lasts 30 seconds. The client stores only its device fingerprint in local storage; session and device tokens are held by the mock server and in memory during login, respectively.

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
