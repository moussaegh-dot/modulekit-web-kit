import { useAuth } from "@moussaegh-dot/modulekit-auth/AuthProvider.jsx";
import Page from "@moussaegh-dot/modulekit-engine/pages/helpers/Page.js";

import WidgetFrame from "./WidgetFrame.jsx";
import { widgetColumnClass } from "./layout.js";

import "./dashboard.css";

/**
 * Page « Dashboard/Page » : affiche les widgets que le manifeste renvoie pour
 * l'utilisateur connecté (le noyau filtre par rôle), dans l'ordre de
 * `bindings.widgets`. Chaque widget charge ses données séparément.
 */
export default function DashboardPage({ page }) {
  const { user } = useAuth();

  const moduleKey = Page.key(page) || "dashboard";
  const title = Page.title(page) || "Tableau de bord";
  const widgets = Page.widgets(page);

  return (
    <div className="mk-dashboard container-fluid py-4">
      <header className="mb-4">
        <h1 className="h3 mb-1">{title}</h1>
        {user?.fullName && <p className="text-muted mb-0">Bonjour {user.fullName}</p>}
      </header>

      {widgets.length === 0 ? (
        <div className="alert alert-info mb-0">
          Aucun indicateur n&apos;est disponible pour votre rôle pour le moment.
        </div>
      ) : (
        <div className="row g-3">
          {widgets.map((widget) => (
            <div key={widget.key} className={widgetColumnClass(widget)}>
              <WidgetFrame moduleKey={moduleKey} widget={widget} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
