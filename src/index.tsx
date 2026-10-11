import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

async function prepareApp() {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.REACT_APP_API_MOCKING === "enabled"
  ) {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

prepareApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
