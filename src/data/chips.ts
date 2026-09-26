import type { AllergyChip, PreferenceChipDef } from "../types/chip";

/**
 * Chips duros (alergias). "Sin mariscos" viene heredado y activo por
 * defecto de la semana anterior — es la restricción real de la persona
 * (Daniela Restrepo, cuya pareja es alérgica a los mariscos), no una
 * preferencia estética. El resto empieza apagado.
 */
export const allergyChips: AllergyChip[] = [
  {
    id: "mariscos",
    label: "Sin mariscos",
    helper: "Bloquea recetas con mariscos. Restricción de seguridad, no de gusto.",
    defaultActive: true,
  },
  {
    id: "gluten",
    label: "Sin gluten",
    helper: "Bloquea recetas que contienen gluten.",
    defaultActive: false,
  },
  {
    id: "lacteos",
    label: "Sin lácteos",
    helper: "Bloquea recetas con lácteos.",
    defaultActive: false,
  },
  {
    id: "frutos-secos",
    label: "Sin frutos secos",
    helper: "Bloquea recetas con frutos secos.",
    defaultActive: false,
  },
];

/**
 * Chips blandos (preferencias de gusto). Filtran la cola del deck en vivo,
 * pero nunca usan el rojo de alérgeno: son "no me gusta", no "me hace daño".
 */
export const preferenceChips: PreferenceChipDef[] = [
  {
    id: "sin-cilantro",
    label: "Sin cilantro",
    kind: "exclude",
    key: "cilantro",
    helper: "Oculta recetas con cilantro.",
    defaultActive: false,
  },
  {
    id: "bajo-carbohidratos",
    label: "Bajo en carbohidratos",
    kind: "require",
    key: "bajo-carbohidratos",
    helper: "Solo recetas bajas en carbohidratos.",
    defaultActive: false,
  },
  {
    id: "vegetariano",
    label: "Vegetariano",
    kind: "require",
    key: "vegetariano",
    helper: "Solo recetas vegetarianas.",
    defaultActive: false,
  },
  {
    id: "alto-proteina",
    label: "Alto en proteína",
    kind: "require",
    key: "alto-proteina",
    helper: "Solo recetas altas en proteína.",
    defaultActive: false,
  },
];
