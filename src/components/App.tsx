import { useState } from "react";
import Login from "./Login";
import WebhooksDataTable from "./WebhooksDataTable";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? (
    <WebhooksDataTable />
  ) : (
    <Login onLoginSuccess={() => setIsAuthenticated(true)} />
  );
}

export default App;
