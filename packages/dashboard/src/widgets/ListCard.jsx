import { listItems, toneClass } from "../format.js";

/**
 * Carte « courte liste » générique.
 *
 * Données : { items: [{ id?, title, subtitle?, meta?, badge?: { label, tone? } }], empty? }
 * Le titre et l'icône viennent du manifeste ; `empty` est le message affiché sans élément.
 */
export default function ListCard({ widget, data }) {
  const items = listItems(data);

  return (
    <div className="card h-100 shadow-0 border mk-widget">
      <div className="card-body pb-2">
        <div className="d-flex align-items-center gap-3 mb-2">
          {widget.icon && (
            <span className="mk-stat-icon" aria-hidden="true">
              <i className={`fas fa-${widget.icon}`} />
            </span>
          )}
          <div className="fw-semibold" title={widget.description ?? undefined}>
            {widget.label}
          </div>
        </div>

        {items.length === 0 ? (
          <p className="text-muted small mb-2">{data?.empty ?? "Rien à afficher pour le moment."}</p>
        ) : (
          <ul className="list-group list-group-flush">
            {items.map((item, index) => (
              <li
                key={item.id ?? `${item.title}-${index}`}
                className="list-group-item px-0 d-flex justify-content-between align-items-start gap-3"
              >
                <div className="flex-grow-1">
                  <div className="fw-medium">{item.title}</div>
                  {item.subtitle && <div className="text-muted small">{item.subtitle}</div>}
                  {item.meta && <div className="text-muted small">{item.meta}</div>}
                </div>

                {item.badge?.label && (
                  <span className={`badge ${toneClass(item.badge.tone)} flex-shrink-0`}>
                    {item.badge.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
