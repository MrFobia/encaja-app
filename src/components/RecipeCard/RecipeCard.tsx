import type { Recipe } from "../../types/recipe";
import { formatAllergenWarning } from "../../lib/format";
import { Piece, SlotOutline } from "../Piece/Piece";
import { NoEntry } from "../Icons";
import "./RecipeCard.css";

export type RecipeCardState = "default" | "dragging" | "kept" | "discarded" | "blocked" | "loading";

const STATE_TAG_LABEL: Record<RecipeCardState, string> = {
  default: "Reposo",
  dragging: "Arrastrando",
  kept: "Guardada",
  discarded: "Descartada",
  blocked: "Bloqueada",
  loading: "Buscando reemplazo",
};

export interface RecipeCardProps {
  recipe: Recipe;
  state?: RecipeCardState;
  blockedAllergens?: string[];
  showMatchBadge?: boolean;
  showStateTag?: boolean;
  className?: string;
}

/**
 * Tarjeta del mazo: la loseta troquelada de la receta más su ficha. Solo
 * pinta uno de sus 6 estados; la física del swipe vive en SwipeDeck.
 */
export function RecipeCard({
  recipe,
  state = "default",
  blockedAllergens = [],
  showMatchBadge = false,
  showStateTag = false,
  className = "",
}: RecipeCardProps) {
  const isLoading = state === "loading";
  const isBlocked = state === "blocked";

  return (
    <article className={`rcard rcard--${state} ${className}`.trim()} aria-label={isLoading ? "Buscando reemplazo" : recipe.name}>
      {showStateTag && <span className="rcard__state">{STATE_TAG_LABEL[state]}</span>}
      <div className="rcard__media">
        {isLoading ? (
          <SlotOutline shape="tile" tone="dark" className="rcard__loading" />
        ) : (
          <Piece slug={recipe.slug} shape="tile" blocked={isBlocked || state === "discarded"} eager />
        )}
        {showMatchBadge && !isLoading && !isBlocked && (
          <span className="rcard__match">{recipe.matchPercent}% afín a ti</span>
        )}
        {isBlocked && (
          <span className="allergy-tag rcard__allergy">
            <NoEntry />
            {formatAllergenWarning(blockedAllergens)}
          </span>
        )}
      </div>
      <div className="rcard__info">
        <h2 className="rcard__name">{isLoading ? "Buscando otra…" : recipe.name}</h2>
        {!isLoading && (
          <p className="rcard__meta">
            {recipe.minutes} min · {recipe.kcal} kcal · {recipe.tags.join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}
