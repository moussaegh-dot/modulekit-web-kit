// Mise en forme des valeurs affichées par les widgets. Fonctions pures, testées.

export function formatValue(value, locale = "fr-FR") {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat(locale).format(value);
  }

  return String(value);
}

// Éléments valides d'un ListCard : { title, subtitle?, meta?, badge?: { label, tone? } }.
export function listItems(data) {
  return Array.isArray(data?.items) ? data.items.filter((item) => item && item.title) : [];
}

const TONES = {
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  neutral: "secondary",
};

// Classe Bootstrap d'un badge selon la tonalité demandée par le backend (inconnue → neutre).
export function toneClass(tone) {
  return `text-bg-${TONES[tone] ?? "secondary"}`;
}
