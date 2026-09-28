import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { allergyChips, preferenceChips } from "../data/chips";
import { DECK_ORDER, recipeById } from "../data/recipes";
import { PreferenceChip } from "../components/PreferenceChip/PreferenceChip";
import { Piece } from "../components/Piece/Piece";
import { ArrowRight, NoEntry } from "../components/Icons";
import { useAppState } from "../state/AppContext";
import { isBlockedByAllergy, passesPreferences } from "../state/deckLogic";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { formatAllergenWarning } from "../lib/format";
import type { Recipe } from "../types/recipe";
import "./Preferences.css";

export function Preferences() {
  const navigate = useNavigate();
  const { state, toggleAllergy, togglePreference, availableCount, totalCount } = useAppState();
  const reduce = usePrefersReducedMotion();
  const recipes = DECK_ORDER.map((id) => recipeById(id)).filter((r): r is Recipe => Boolean(r));

  return (
    <div className="wrap prefs">
      <div className="prefs__form">
        <h1 className="prefs__title">Primero, lo que no puede entrar.</h1>
        <p className="prefs__lead">
          Traemos las marcas de la semana pasada. Cambia lo que haga falta y mira en vivo cuántas
          recetas quedan.
        </p>

        <section className="prefs__group" aria-labelledby="alergias">
          <h2 id="alergias" className="prefs__group-title">
            Alergias
          </h2>
          <p className="prefs__hint">
            Restricción de seguridad. Una receta con tu alérgeno nunca se puede guardar.
          </p>
          <div className="prefs__chips">
            {allergyChips.map((chip) => (
              <PreferenceChip
                key={chip.id}
                id={chip.id}
                label={chip.label}
                variant="allergy"
                active={Boolean(state.allergies[chip.id])}
                helper={chip.helper}
                onToggle={() => toggleAllergy(chip.id)}
              />
            ))}
          </div>
        </section>

        <section className="prefs__group" aria-labelledby="gustos">
          <h2 id="gustos" className="prefs__group-title">
            Gustos
          </h2>
          <p className="prefs__hint">
            Preferencias blandas: filtran el mazo, pero no son una promesa de seguridad. Puedes
            cambiarlas a mitad del swipe.
          </p>
          <div className="prefs__chips">
            {preferenceChips.map((chip) => (
              <PreferenceChip
                key={chip.id}
                label={chip.label}
                variant="preference"
                active={Boolean(state.preferences[chip.id])}
                helper={chip.helper}
                onToggle={() => togglePreference(chip.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <aside className="prefs__panel on-dark" aria-labelledby="prefs-count">
        <p id="prefs-count" className="prefs__count" role="status" aria-live="polite">
          <span className="prefs__num">
            {availableCount} de {totalCount}
          </span>
          <span className="prefs__unit">recetas disponibles con esta combinación</span>
        </p>

        <ul className="prefs__pieces" aria-label="Estado de cada receta">
          {recipes.map((r) => {
            const blocked = isBlockedByAllergy(r, state.allergies);
            const filtered = !blocked && !passesPreferences(r, state.preferences);
            const hits = r.allergens.filter((a) => state.allergies[a]);
            return (
              <motion.li
                key={r.id}
                layout={!reduce}
                className={`prefs__piece ${blocked ? "is-blocked" : ""} ${filtered ? "is-filtered" : ""}`}
                transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
              >
                <Piece slug={r.slug} blocked={blocked} />
                <span className="prefs__piece-name">{r.name}</span>
                {blocked && (
                  <span className="allergy-tag prefs__piece-tag">
                    <NoEntry />
                    {formatAllergenWarning(hits)}
                  </span>
                )}
                {filtered && <span className="prefs__piece-note">Fuera por tus gustos</span>}
              </motion.li>
            );
          })}
        </ul>

        <div className="prefs__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate("/deck")}
            disabled={availableCount === 0}
          >
            Arma tu cajita
            <ArrowRight className="btn__arrow" />
          </button>
          {availableCount === 0 && (
            <p className="prefs__warn">
              Con esta combinación no queda ninguna receta. Quita un gusto para continuar.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
