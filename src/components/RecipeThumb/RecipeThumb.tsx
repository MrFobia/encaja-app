import { motion } from "framer-motion";
import type { Recipe } from "../../types/recipe";
import { Piece } from "../Piece/Piece";
import "./RecipeThumb.css";

export interface RecipeThumbProps {
  recipe: Recipe;
  /** Mismo layoutId en el mazo y en el resumen: la pieza vuela entre pantallas. */
  layoutId?: string;
  className?: string;
}

/** La pieza horizontal de una receta, lista para encajar en una bandeja. */
export function RecipeThumb({ recipe, layoutId, className = "" }: RecipeThumbProps) {
  return (
    <motion.div layoutId={layoutId} className={`recipe-thumb ${className}`.trim()}>
      <Piece slug={recipe.slug} />
    </motion.div>
  );
}
