import { getKitConfig } from "@moussaegh-dot/modulekit-engine/config/kitConfig.js";

import { formatValue, toneClass } from "../format.js";

/**
 * Carte « un chiffre » générique.
 *
 * Données : { value, unit?, details?: [{ label, value?, tone? }] }
 *   tone : success | warning | danger | info | neutral
 *   un détail sans `value` n'affiche que son libellé
 * Le titre et l'icône (nom FontAwesome sans préfixe, ex. « car ») viennent du manifeste.
 */
export default function StatCard({ widget, data }) {
  const { locale } = getKitConfig();
  const details = Array.isArray(data?.details) ? data.details : [];

  return (
    <div className="card h-100 shadow-0 border mk-widget">
      <div className="card-body d-flex gap-3">
        {widget.icon && (
          <span className="mk-stat-icon" aria-hidden="true">
            <i className={`fas fa-${widget.icon}`} />
          </span>
        )}

        <div className="flex-grow-1">
          <div className="text-muted small" title={widget.description ?? undefined}>
            {widget.label}
          </div>

          <div className="mk-stat-value">
            {formatValue(data?.value, locale)}
            {data?.unit && <span className="mk-stat-unit"> {data.unit}</span>}
          </div>

          {details.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mt-2">
              {details.map((detail) => (
                <span key={detail.label} className={`badge ${toneClass(detail.tone)}`}>
                  {detail.value !== undefined && detail.value !== null
                    ? `${formatValue(detail.value, locale)} `
                    : ""}
                  {detail.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
