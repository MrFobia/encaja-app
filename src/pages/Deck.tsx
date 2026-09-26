import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { allergyChips, preferenceChips } from "../data/chips";
import { SwipeDeck } from "../components/SwipeDeck/SwipeDeck";
import { RecipeCard } from "../components/RecipeCard/RecipeCard";
import { useAppState } from "../state/AppContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { recipes } from "../data/recipes";
import "./Deck.css";

export function Deck() {
  const navigate = useNavigate();
  const { state, keptRecipes, isComplete } = useAppState();
  const reducedMotion = usePrefersReducedMotion();
  const [isArming, setIsArming] = useState(!isComplete);

  useEffect(() => {
    if (isComplete) {
      setIsArming(false);
      return;
    }
    const delay = reducedMotion ? 80 : 750;
    const id = window.setTimeout(() => setIsArming(false), delay);
    return () => window.clearTimeout(id);
    // Solo se arma una vez al entrar al deck.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeAllergies = allergyChips.filter((c) => state.allergies[c.id]);
  const activePreferences = preferenceChips.filter((c) => state.preferences[c.id]);

  return (
    <div className="wrap deck-page">
      <header className="deck-page__header">
        <div className="deck-page__title-row">
          <h1 className="deck-page__title">Elige tus 5 recetas</h1>
          <Link to="/preferencias" className="deck-page__edit-link">
            Editar preferencias
          </Link>
        </div>
        <p className="deck-page__delivery">Tu caja de esta semana llega el jueves.</p>
        <div className="deck-page__chipbar">
          {activeAllergies.map((c) => (
            <span key={c.id} className="deck-page__chip deck-page__chip--allergy">
              {c.label}
            </span>
          ))}
          {activePreferences.map((c) => (
            <span key={c.id} className="deck-page__chip">
              {c.label}
            </span>
          ))}
          {activeAllergies.length === 0 && activePreferences.length === 0 && (
            <span className="deck-page__chip deck-page__chip--muted">Sin filtros activos</span>
          )}
        </div>
      </header>

      {isArming ? (
        <div className="deck-page__arming" aria-live="polite">
          <RecipeCard recipe={recipes[0]} state="loading" className="deck-page__arming-card" />
          <p className="deck-page__arming-text">Armando tu mazo según tus preferencias…</p>
        </div>
      ) : (
        <SwipeDeck />
      )}

      {isComplete && !isArming && (
        <div className="deck-page__complete-actions">
          <button
            type="button"
            className="deck-page__summary-cta"
            onClick={() => navigate("/resumen")}
          >
            Ver resumen ({keptRecipes.length}/5)
          </button>
        </div>
      )}
    </div>
  );
}
