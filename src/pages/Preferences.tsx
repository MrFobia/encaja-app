import { useNavigate } from "react-router-dom";
import { allergyChips, preferenceChips } from "../data/chips";
import { PreferenceChip } from "../components/PreferenceChip/PreferenceChip";
import { useAppState } from "../state/AppContext";
import "./Preferences.css";

export function Preferences() {
  const navigate = useNavigate();
  const { state, toggleAllergy, togglePreference, availableCount, totalCount } = useAppState();

  return (
    <div className="wrap preferences-page">
      <h1 className="preferences-page__title">Confirmá alergias y gustos</h1>
      <p className="preferences-page__lead">
        Los chips de la semana pasada quedan heredados. Las alergias son restricciones de
        seguridad — nunca aparece algo bloqueado como opción para guardar. Las preferencias son
        de gusto: filtran la cola, pero no son una promesa de seguridad.
      </p>

      <section className="preferences-page__section" aria-labelledby="allergies-heading">
        <h2 id="allergies-heading" className="preferences-page__section-title">
          Alergias
          <span className="preferences-page__section-tag preferences-page__section-tag--allergy">
            Restricción dura
          </span>
        </h2>
        <p className="preferences-page__section-hint">
          Bloquea por completo cualquier receta con este alérgeno. No se puede guardar aunque se
          intente.
        </p>
        <div className="preferences-page__chip-row">
          {allergyChips.map((chip) => (
            <PreferenceChip
              key={chip.id}
              label={chip.label}
              variant="allergy"
              active={Boolean(state.allergies[chip.id])}
              helper={chip.helper}
              onToggle={() => toggleAllergy(chip.id)}
            />
          ))}
        </div>
      </section>

      <section className="preferences-page__section" aria-labelledby="preferences-heading">
        <h2 id="preferences-heading" className="preferences-page__section-title">
          Preferencias
          <span className="preferences-page__section-tag preferences-page__section-tag--soft">
            Gusto
          </span>
        </h2>
        <p className="preferences-page__section-hint">
          Filtra la cola del mazo en vivo. Se puede editar en cualquier momento, incluso a mitad
          del swipe.
        </p>
        <div className="preferences-page__chip-row">
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

      <div className="preferences-page__counter" role="status">
        <span className="preferences-page__counter-value">{availableCount}</span>
        <span className="preferences-page__counter-label">
          de {totalCount} recetas disponibles con esta combinación
        </span>
      </div>

      <div className="preferences-page__actions">
        <button
          type="button"
          className="preferences-page__cta"
          onClick={() => navigate("/deck")}
          disabled={availableCount === 0}
        >
          Armar mi mazo
        </button>
        {availableCount === 0 && (
          <p className="preferences-page__warn">
            Con esta combinación no queda ninguna receta disponible. Desactivá algún filtro para
            continuar.
          </p>
        )}
      </div>
    </div>
  );
}
