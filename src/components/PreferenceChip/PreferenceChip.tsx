import { ALLERGEN_ICONS, Check, Plus, Shield } from "../Icons";
import "./PreferenceChip.css";

export interface PreferenceChipProps {
  label: string;
  active: boolean;
  /** "allergy" = restricción dura (anillo rojo al activarse). "preference" = gusto (nunca rojo). */
  variant: "allergy" | "preference";
  onToggle: () => void;
  helper?: string;
  id?: string;
}

export function PreferenceChip({ label, active, variant, onToggle, helper, id }: PreferenceChipProps) {
  const Icon = active
    ? variant === "allergy"
      ? Shield
      : Check
    : (variant === "allergy" && id && ALLERGEN_ICONS[id]) || Plus;
  return (
    <button
      type="button"
      id={id}
      className={`pchip pchip--${variant} ${active ? "is-on" : ""}`}
      aria-pressed={active}
      title={helper}
      onClick={onToggle}
    >
      <Icon className="pchip__icon" />
      <span>{label}</span>
    </button>
  );
}
