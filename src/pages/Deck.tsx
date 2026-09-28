import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { allergyChips, preferenceChips } from "../data/chips";
import { SwipeDeck } from "../components/SwipeDeck/SwipeDeck";
import { RecipeCard } from "../components/RecipeCard/RecipeCard";
import { Shield } from "../components/Icons";
import { useAppState } from "../state/AppContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { recipes } from "../data/recipes";
import { nextDeliveryDate } from "../lib/format";
import "./Deck.css";

export function Deck() {
  const { state, isComplete } = useAppState();
  const reducedMotion = usePrefersReducedMotion();
  const [isArming, setIsArming] = useState(!isComplete);

  useEffect(() => {
    if (isComplete) {
      setIsArming(false);
      return;
    }
    const id = window.setTimeout(() => setIsArming(false), reducedMotion ? 80 : 750);
    return () => window.clearTimeout(id);
    // Solo se arma una vez al entrar al deck.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeAllergies = allergyChips.filter((c) => state.allergies[c.id]);
  const activePreferences = preferenceChips.filter((c) => state.preferences[c.id]);

  return (
    <div className="wrap deck-page">
      {!isComplete && (
        <header className="deck-page__header">
          <h1 className="deck-page__title">Elige tus 5 recetas</h1>
          <p className="deck-page__delivery">Tu caja llega el {nextDeliveryDate().toLowerCase()}.</p>
          <div className="deck-page__filters">
            {activeAllergies.map((c) => (
              <span key={c.id} className="deck-page__chip deck-page__chip--allergy">
                <Shield />
                {c.label}
              </span>
            ))}
            {activePreferences.map((c) => (
              <span key={c.id} className="deck-page__chip">
                {c.label}
              </span>
            ))}
            {activeAllergies.length === 0 && activePreferences.length === 0 && (
              <span className="deck-page__chip">Sin filtros</span>
            )}
            <Link to="/preferencias" className="deck-page__edit">
              Editar
            </Link>
          </div>
        </header>
      )}

      {isArming ? (
        <div className="deck-page__arming" aria-live="polite">
          <RecipeCard recipe={recipes[0]} state="loading" className="deck-page__arming-card" />
          <p className="deck-page__arming-text">Armando tu mazo con tus alergias ya filtradas…</p>
        </div>
      ) : (
        <SwipeDeck />
      )}
    </div>
  );
}
