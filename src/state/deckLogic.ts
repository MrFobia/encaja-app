import { allergyChips, preferenceChips } from "../data/chips";
import { DECK_ORDER, recipeById, recipes } from "../data/recipes";
import type { Recipe } from "../types/recipe";

export type ChipState = Record<string, boolean>;

export const initialAllergyState = (): ChipState =>
  Object.fromEntries(allergyChips.map((c) => [c.id, c.defaultActive]));

export const initialPreferenceState = (): ChipState =>
  Object.fromEntries(preferenceChips.map((c) => [c.id, c.defaultActive]));

/** true si la receta debe bloquearse por un alérgeno activo (chip duro). */
export function isBlockedByAllergy(recipe: Recipe, allergies: ChipState): boolean {
  return recipe.allergens.some((allergen) => allergies[allergen]);
}

/** Alérgenos activos que efectivamente afectan a esta receta (para el copy de la tarjeta bloqueada). */
export function blockingAllergens(recipe: Recipe, allergies: ChipState): string[] {
  return recipe.allergens.filter((allergen) => allergies[allergen]);
}

/** true si la receta pasa los filtros blandos de preferencia (gusto, no seguridad). */
export function passesPreferences(recipe: Recipe, preferences: ChipState): boolean {
  return preferenceChips.every((chip) => {
    if (!preferences[chip.id]) return true;
    if (chip.kind === "exclude") {
      return !recipe.contains.includes(chip.key);
    }
    return recipe.dietTags.includes(chip.id);
  });
}

/** Recetas realmente disponibles: pasan preferencias Y no están bloqueadas por alergia. */
export function availableRecipes(allergies: ChipState, preferences: ChipState): Recipe[] {
  return recipes.filter(
    (r) => passesPreferences(r, preferences) && !isBlockedByAllergy(r, allergies),
  );
}

export function availableCount(allergies: ChipState, preferences: ChipState): number {
  return availableRecipes(allergies, preferences).length;
}

/** Próxima receta candidata a reemplazo: primera en el orden fijo del mazo
 *  que no esté ya decidida (guardada o descartada), no bloqueada por
 *  alergia y que pase las preferencias blandas activas. Usada tanto por el
 *  auto-reemplazo del deck como por "Cambiar" en el resumen. */
export function findReplacement(
  decidedIds: Set<string>,
  allergies: ChipState,
  preferences: ChipState,
): Recipe | undefined {
  for (const id of DECK_ORDER) {
    if (decidedIds.has(id)) continue;
    const recipe = recipeById(id);
    if (!recipe) continue;
    if (isBlockedByAllergy(recipe, allergies)) continue;
    if (!passesPreferences(recipe, preferences)) continue;
    return recipe;
  }
  return undefined;
}
