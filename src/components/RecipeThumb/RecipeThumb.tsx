import { useState } from "react";
import { motion } from "framer-motion";
import type { Recipe } from "../../types/recipe";
import "./RecipeThumb.css";

export interface RecipeThumbProps {
  recipe: Recipe;
  /** Mismo layoutId usado en el deck y en el resumen -> Framer Motion anima
   *  la transición shared-element entre esas dos pantallas. */
  layoutId?: string;
  className?: string;
}

/** Bloque BEM `.recipe-thumb` — miniatura cuadrada, distinta de `.recipe-card`
 *  (sin meta, sin estados de swipe). Se usa en el tray de "guardadas" del
 *  deck y en las filas del resumen. */
export function RecipeThumb({ recipe, layoutId, className = "" }: RecipeThumbProps) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.div layoutId={layoutId} className={`recipe-thumb ${className}`.trim()}>
      {!failed ? (
        <img
          className="recipe-thumb__image"
          src={`/images/recipes/${recipe.slug}.jpg`}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="recipe-thumb__gradient"
          style={{
            background: `linear-gradient(135deg, ${recipe.gradientFrom}, ${recipe.gradientTo})`,
          }}
        />
      )}
    </motion.div>
  );
}
