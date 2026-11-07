// src/core/crud/ui/table/components/cells/CurrencyCell.jsx

import React from "react";
import { getKitConfig } from "@moussaegh-dot/modulekit-engine/config/kitConfig.js";

/**
 * 💰 CurrencyCell
 * Affiche une valeur numérique formatée en devise
 */
export default function CurrencyCell({
  value,
  currency = getKitConfig().currency,
  locale = getKitConfig().locale,
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
}) {
  if (value === null || value === undefined) return "-";

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

  return <span className="font-medium">{formatted}</span>;
}