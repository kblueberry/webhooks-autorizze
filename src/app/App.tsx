import { useState } from "react";
import Login from "../features/auth/Login";
import WebhooksDataTable from "../features/webhooks/WebhooksDataTable";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? (
    <WebhooksDataTable />
  ) : (
    <Login onLoginSuccess={() => setIsAuthenticated(true)} />
  );
}

export default App;
