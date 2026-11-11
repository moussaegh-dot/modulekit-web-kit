import ComponentResolver from "@moussaegh-dot/modulekit-engine/pages/resolvers/ComponentResolver.js";

import useWidgetData from "./useWidgetData.js";

/**
 * Enveloppe d'un widget : résout le composant, charge ses données et gère
 * chargement / erreur pour CE widget seulement (un échec ne bloque pas les autres).
 *
 * Le composant est cherché dans WidgetRegistry d'abord par clé de widget
 * (surcharge d'un widget précis), puis par nom de composant (ex. « StatCard »).
 * Il reçoit { widget, data } une fois les données prêtes.
 */
export default function WidgetFrame({ moduleKey, widget }) {
  const Widget =
    ComponentResolver.widget(widget.key) ?? ComponentResolver.widget(widget.component);

  const { data, loading, error, reload } = useWidgetData(moduleKey, widget);

  if (!Widget) {
    return (
      <div className="alert alert-warning mb-0">
        Composant de widget introuvable : <strong>{widget.component ?? widget.key}</strong>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card h-100 shadow-0 border mk-widget" aria-busy="true">
        <div className="card-body d-flex align-items-center gap-3 text-muted">
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          <span>{widget.label ?? "Chargement…"}</span>
        </div>
      </div>
    );
  }

  if (error) {
    const denied = error?.response?.status === 403;

    return (
      <div className="card h-100 shadow-0 border border-danger mk-widget">
        <div className="card-body">
          <div className="fw-semibold mb-1">{widget.label ?? widget.key}</div>
          <p className="text-danger small mb-2">
            {denied ? "Accès refusé à ce widget." : "Impossible de charger ce widget."}
          </p>
          {!denied && (
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={reload}>
              Réessayer
            </button>
          )}
        </div>
      </div>
    );
  }

  return <Widget widget={widget} data={data ?? {}} />;
}
