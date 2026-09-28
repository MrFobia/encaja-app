/** Identificador de alérgeno (chip duro / restricción de seguridad). */
export type AllergenId = "mariscos" | "gluten" | "lacteos" | "frutos-secos";

/** Identificador de preferencia blanda (chip de gusto, no de seguridad). */
export type PreferenceId =
  | "sin-cilantro"
  | "bajo-carbohidratos"
  | "vegetariano"
  | "alto-proteina";

export interface Recipe {
  id: string;
  /** Usado para /images/recipes/<slug>.jpg */
  slug: string;
  name: string;
  minutes: number;
  kcal: number;
  /** Chips visibles en la tarjeta (dato, no filtro). */
  tags: string[];
  /** Gradiente placeholder mientras no hay foto (misma dirección que el mockup). */
  gradientFrom: string;
  gradientTo: string;
  /** Alérgenos reales que contiene la receta -> bloquean si el chip duro está activo. */
  allergens: AllergenId[];
  /** Ingredientes que una preferencia blanda "sin X" puede excluir. */
  contains: string[];
  /** Atributos que satisfacen preferencias blandas de tipo "requiere". */
  dietTags: PreferenceId[];
  /** Porcentaje de afinidad mostrado como "94% match". */
  matchPercent: number;
  /** true = receta del "mazo" inicial; false = alterna usada como reemplazo. */
  isCore: boolean;
  /** Ingredientes de la porción con su aporte calórico y peso; suman el `kcal` y los gramos totales. */
  ingredients: { name: string; kcal: number; grams: number }[];
}
