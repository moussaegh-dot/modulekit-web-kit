// Largeur d'un widget dans la grille Bootstrap (12 colonnes). Fonction pure, testée.

const isColumns = (n) => Number.isInteger(n) && n >= 1 && n <= 12;

/**
 * Classes de colonne d'un widget.
 *
 * - `props.responsive` ({ mobile, tablet, desktop }, posé par ->responsive() côté noyau) est prioritaire ;
 * - sinon `colSpan` (->fullWidth() = 12, ->halfWidth() = 6, ->thirdWidth() = 4, ->quarterWidth() = 3) ;
 * - un colSpan absent, invalide ou inférieur à 2 (la valeur par défaut du noyau est 1) vaut « pleine largeur ».
 */
export function widgetColumnClass(widget) {
  const r = widget?.props?.responsive;

  if (r && isColumns(r.mobile) && isColumns(r.tablet) && isColumns(r.desktop)) {
    return `col-${r.mobile} col-md-${r.tablet} col-lg-${r.desktop}`;
  }

  const span = Number(widget?.colSpan);

  if (!isColumns(span) || span < 2 || span >= 12) {
    return "col-12";
  }

  return span >= 6 ? `col-12 col-lg-${span}` : `col-12 col-md-6 col-lg-${span}`;
}
