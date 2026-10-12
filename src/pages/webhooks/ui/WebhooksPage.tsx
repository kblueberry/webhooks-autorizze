import { useAuth } from "../../../features/auth";
import { WebhooksDataTable } from "../../../features/webhooks";

export function WebhooksPage() {
  const { logout } = useAuth();

  return <WebhooksDataTable onLogout={logout} />;
}
