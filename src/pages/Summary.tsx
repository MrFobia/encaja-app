import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RecipeThumb } from "../components/RecipeThumb/RecipeThumb";
import { useAppState } from "../state/AppContext";
import { formatPrice, nextDeliveryDate } from "../lib/format";
import "./Summary.css";

const PRICE_PER_BOX = 142000;

export function Summary() {
  const navigate = useNavigate();
  const { keptRecipes, hasReplacement, swapKept, confirmOrder } = useAppState();
  const [nutritionOpen, setNutritionOpen] = useState(false);

  if (keptRecipes.length < 5) {
    return (
      <div className="wrap summary-page">
        <h1 className="summary-page__title">Todavía faltan recetas</h1>
        <p className="summary-page__lead">
          Guardaste {keptRecipes.length} de 5. Volvé al mazo para completar tu caja antes de ver
          el resumen.
        </p>
        <Link to="/deck" className="summary-page__cta">
          Ir al deck
        </Link>
      </div>
    );
  }

  const totalKcal = keptRecipes.reduce((sum, r) => sum + r.kcal, 0);
  const totalMinutes = keptRecipes.reduce((sum, r) => sum + r.minutes, 0);

  const handleConfirm = () => {
    confirmOrder();
    navigate("/confirmacion");
  };

  return (
    <div className="wrap summary-page">
      <h1 className="summary-page__title">Tu caja quedó lista</h1>

      <ul className="summary-page__list">
        {keptRecipes.map((recipe) => (
          <li key={recipe.id} className="summary-page__row">
            <RecipeThumb recipe={recipe} layoutId={`recipe-shared-${recipe.id}`} />
            <div className="summary-page__row-text">
              <b>{recipe.name}</b>
              <span>
                {recipe.minutes} min · {recipe.kcal} kcal
              </span>
            </div>
            <button
              type="button"
              className="summary-page__swap"
              disabled={!hasReplacement}
              onClick={() => swapKept(recipe.id)}
              title={hasReplacement ? "Cambiar por otra receta disponible" : "No hay reemplazos disponibles"}
            >
              Cambiar
            </button>
            <span className="summary-page__check" aria-hidden="true">
              ✓
            </span>
          </li>
        ))}
      </ul>

      <div className="summary-page__nutrition">
        <button
          type="button"
          className="summary-page__nutrition-toggle"
          aria-expanded={nutritionOpen}
          onClick={() => setNutritionOpen((v) => !v)}
        >
          {nutritionOpen ? "Ocultar resumen nutricional" : "Ver resumen nutricional"}
        </button>
        {nutritionOpen && (
          <p className="summary-page__nutrition-body">
            {totalKcal} kcal totales · {Math.round(totalKcal / 5)} kcal promedio por receta ·{" "}
            {totalMinutes} min de cocina en total esta semana.
          </p>
        )}
      </div>

      <div className="summary-page__footer">
        <div className="summary-page__price-row">
          <span>Entrega {nextDeliveryDate()}</span>
          <b>{formatPrice(PRICE_PER_BOX)}</b>
        </div>
        <button type="button" className="summary-page__confirm" onClick={handleConfirm}>
          Confirmar caja de esta semana
        </button>
      </div>
    </div>
  );
}
