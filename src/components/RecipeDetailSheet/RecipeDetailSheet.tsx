import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Recipe } from "../../types/recipe";
import { Cross, NoEntry } from "../Icons";
import { formatAllergenWarning } from "../../lib/format";
import "./RecipeDetailSheet.css";

export interface RecipeDetailSheetProps {
  recipe: Recipe | null;
  blocked?: boolean;
  blockedAllergens?: string[];
  onClose: () => void;
}

/** Modal en desktop, bottom sheet en mobile — misma marca, un solo componente.
 *  La forma cambia por CSS (media query), no por detección de viewport en JS. */
export function RecipeDetailSheet({
  recipe,
  blocked = false,
  blockedAllergens = [],
  onClose,
}: RecipeDetailSheetProps) {
  useEffect(() => {
    if (!recipe) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [recipe, onClose]);

  if (!recipe) return null;

  return createPortal(
    <div className="detail-sheet__backdrop" onClick={onClose}>
      <div
        className="detail-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="detail-sheet__handle" aria-hidden="true" />
        <button type="button" className="detail-sheet__close" onClick={onClose} aria-label="Cerrar detalle">
          <Cross />
        </button>
        <div className="detail-sheet__media">
          <img
            className={`detail-sheet__photo ${blocked ? "is-blocked" : ""}`}
            src={`/images/recipes/${recipe.slug}.jpg`}
            alt={recipe.name}
          />
        </div>
        <div className="detail-sheet__body">
          <h2 id="detail-sheet-title" className="detail-sheet__name">
            {recipe.name}
          </h2>
          <p className="detail-sheet__meta">
            {recipe.minutes} min · {recipe.kcal} kcal
          </p>
          <ul className="detail-sheet__tags">
            {recipe.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <h3 className="detail-sheet__ingredients-title">Ingredientes de la porción</h3>
          <ul className="detail-sheet__ingredients">
            {recipe.ingredients.map((ing) => (
              <li key={ing.name}>
                <span className="detail-sheet__ing-name">{ing.name}</span>
                <span className="detail-sheet__ing-grams">{ing.grams} g</span>
                <span className="detail-sheet__ing-kcal">{ing.kcal} kcal</span>
              </li>
            ))}
            <li className="detail-sheet__ing-total">
              <span className="detail-sheet__ing-name">Total de la porción</span>
              <span className="detail-sheet__ing-grams">
                {recipe.ingredients.reduce((sum, ing) => sum + ing.grams, 0)} g
              </span>
              <span className="detail-sheet__ing-kcal">{recipe.kcal} kcal</span>
            </li>
          </ul>
          {blocked && (
            <p className="detail-sheet__warn">
              <NoEntry />
              {formatAllergenWarning(blockedAllergens)}. Bloqueada por un alérgeno activo en
              tus preferencias.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
