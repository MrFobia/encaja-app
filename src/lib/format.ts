export const ALLERGEN_NOUNS: Record<string, string> = {
  mariscos: "mariscos",
  gluten: "gluten",
  lacteos: "lácteos",
  "frutos-secos": "frutos secos",
};

export function formatAllergenWarning(ids: string[]): string {
  if (ids.length === 0) return "Contiene alérgeno";
  const nouns = ids.map((id) => ALLERGEN_NOUNS[id] ?? id);
  return `Contiene ${nouns.join(" y ")}`;
}

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return currencyFormatter.format(value);
}

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** Próximo jueves a partir de hoy (día de entrega estándar del mockup). */
export function nextDeliveryDate(from: Date = new Date()): string {
  const date = new Date(from);
  const THURSDAY = 4;
  const diff = (THURSDAY + 7 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + diff);
  const formatted = dateFormatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/** Domingo de esta semana a las 8pm — corte de edición ficticio. */
export function nextEditCutoff(from: Date = new Date()): string {
  const date = new Date(from);
  const SUNDAY = 0;
  const diff = (SUNDAY + 7 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + diff);
  const formatted = dateFormatter.format(date);
  return `${formatted.charAt(0).toUpperCase() + formatted.slice(1)} a las 8:00 p.m.`;
}
