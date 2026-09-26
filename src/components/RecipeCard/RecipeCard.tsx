import { useState } from "react";
import type { Recipe } from "../../types/recipe";
import { formatAllergenWarning } from "../../lib/format";
import "./RecipeCard.css";

export type RecipeCardState =
  | "default"
  | "dragging"
  | "kept"
  | "discarded"
  | "blocked"
  | "loading";

const STATE_TAG_LABEL: Record<RecipeCardState, string> = {
  default: "Default",
  dragging: "Arrastrando",
  kept: "Guardada",
  discarded: "Descartada",
  blocked: "Bloqueada",
  loading: "Cargando reemplazo",
};

export interface RecipeCardProps {
  recipe: Recipe;
  state?: RecipeCardState;
  /** Alérgenos activos que están bloqueando esta receta (para el copy exacto). */
  blockedAllergens?: string[];
  /** Insignia "94% match" — solo tiene sentido dentro del deck. */
  showMatchBadge?: boolean;
  /** Etiqueta de estado arriba a la izquierda — usado en el showroom /sistema. */
  showStateTag?: boolean;
  className?: string;
}

/**
 * Bloque BEM `.recipe-card`. Presentacional puro: no sabe de drag ni de
 * routing, solo pinta uno de sus 6 estados. La física de swipe vive en
 * SwipeDeck; esto es la unidad visual reutilizada ahí y en /sistema.
 */
export function RecipeCard({
  recipe,
  state = "default",
  blockedAllergens = [],
  showMatchBadge = false,
  showStateTag = false,
  className = "",
}: RecipeCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const isLoading = state === "loading";
  const isBlocked = state === "blocked";

  const modifierClass = state !== "default" ? `recipe-card--${state}` : "";
  const rootClass = ["recipe-card", modifierClass, className].filter(Boolean).join(" ");

  const photoClass = [
    "recipe-card__photo",
    isLoading ? "recipe-card__photo--loading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={rootClass} aria-label={recipe.name}>
      {showStateTag && (
        <span className="recipe-card__state-tag">{STATE_TAG_LABEL[state]}</span>
      )}
      {showMatchBadge && !isLoading && (
        <span className="recipe-card__why">{recipe.matchPercent}% match</span>
      )}
      <div
        className={photoClass}
        style={
          isLoading || imgFailed
            ? {
                background: `linear-gradient(135deg, ${recipe.gradientFrom}, ${recipe.gradientTo})`,
              }
            : undefined
        }
      >
        {!isLoading && !imgFailed && (
          <img
            className="recipe-card__image"
            src={`/images/recipes/${recipe.slug}.jpg`}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
        <span className="recipe-card__name">{isLoading ? "···" : recipe.name}</span>
      </div>
      <div className="recipe-card__meta">
        {isLoading ? (
          <span className="recipe-card__meta-item">Buscando…</span>
        ) : isBlocked ? (
          <span className="recipe-card__meta-item recipe-card__meta-item--warn">
            {formatAllergenWarning(blockedAllergens)}
          </span>
        ) : (
          <>
            <span className="recipe-card__meta-item">{recipe.minutes} min</span>
            <span className="recipe-card__meta-item">{recipe.kcal} kcal</span>
            {recipe.tags.slice(0, 1).map((tag) => (
              <span key={tag} className="recipe-card__meta-item">
                {tag}
              </span>
            ))}
          </>
        )}
      </div>
    </article>
  );
}
