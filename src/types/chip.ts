import type { AllergenId, PreferenceId } from "./recipe";

export interface AllergyChip {
  id: AllergenId;
  label: string;
  /** Copy corto que explica qué bloquea, para lectores de pantalla / tooltip. */
  helper: string;
  /** Chips heredados de la semana anterior vienen pre-activados. */
  defaultActive: boolean;
}

export type PreferenceKind = "exclude" | "require";

export interface PreferenceChipDef {
  id: PreferenceId;
  label: string;
  kind: PreferenceKind;
  /** Si kind = "exclude": recetas con este ingrediente en `contains` se ocultan.
   *  Si kind = "require": recetas sin este tag en `dietTags` se ocultan. */
  key: string;
  helper: string;
  defaultActive: boolean;
}
