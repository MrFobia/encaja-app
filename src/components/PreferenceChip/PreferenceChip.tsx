import "./PreferenceChip.css";

export interface PreferenceChipProps {
  label: string;
  active: boolean;
  /** "allergy" = chip duro (rojo cuando activo). "preference" = chip blando (terracota cuando activo). */
  variant: "allergy" | "preference";
  onToggle: () => void;
  helper?: string;
  id?: string;
}

/**
 * Bloque BEM `.preference-chip`. Los chips de alergia son restricciones de
 * seguridad (rojo real, exclusivo de este contexto); los de preferencia son
 * gusto (terracota). Nunca se intercambian los colores entre uno y otro.
 */
export function PreferenceChip({
  label,
  active,
  variant,
  onToggle,
  helper,
  id,
}: PreferenceChipProps) {
  const rootClass = [
    "preference-chip",
    `preference-chip--${variant}`,
    active ? "preference-chip--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      id={id}
      className={rootClass}
      aria-pressed={active}
      title={helper}
      onClick={onToggle}
    >
      {variant === "allergy" && (
        <span className="preference-chip__icon" aria-hidden="true">
          {active ? "⊘" : "+"}
        </span>
      )}
      <span className="preference-chip__label">{label}</span>
    </button>
  );
}
