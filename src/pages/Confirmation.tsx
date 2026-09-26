import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppContext";
import { nextEditCutoff } from "../lib/format";
import "./Confirmation.css";

export function Confirmation() {
  const navigate = useNavigate();
  const { state, keptRecipes, resetAll } = useAppState();
  const [upsellShown, setUpsellShown] = useState(false);

  if (!state.confirmed) {
    return (
      <div className="wrap confirmation-page">
        <h1 className="confirmation-page__title">Todavía no confirmaste tu caja</h1>
        <p className="confirmation-page__lead">
          Volvé al resumen para revisar tus 5 recetas y confirmar.
        </p>
        <Link to="/resumen" className="confirmation-page__cta">
          Ir al resumen
        </Link>
      </div>
    );
  }

  const handleRestart = () => {
    resetAll();
    navigate("/preferencias");
  };

  return (
    <div className="wrap confirmation-page">
      <div className="confirmation-page__badge" aria-hidden="true">
        ✓
      </div>
      <h1 className="confirmation-page__title">
        Listo. Tus {keptRecipes.length} recetas están en camino.
      </h1>
      <p className="confirmation-page__lead">
        Podés editar tu caja hasta el corte de esta semana. Después de eso, empieza a
        prepararse.
      </p>
      <div className="confirmation-page__countdown">
        <span className="confirmation-page__countdown-label">Podés editar hasta</span>
        <b className="confirmation-page__countdown-value">{nextEditCutoff()}</b>
      </div>

      <div className="confirmation-page__upsell">
        <p>¿Querés un extra para esta semana? Es un swipe más, no una obligación.</p>
        <button
          type="button"
          className="confirmation-page__upsell-cta"
          onClick={() => setUpsellShown(true)}
          aria-expanded={upsellShown}
        >
          Ver un extra opcional
        </button>
        {upsellShown && (
          <p className="confirmation-page__upsell-note">
            Todavía no hay extras cargados esta semana — vas a poder agregarlos acá cuando estén
            disponibles.
          </p>
        )}
      </div>

      <button type="button" className="confirmation-page__restart" onClick={handleRestart}>
        Empezar la próxima semana desde cero
      </button>
    </div>
  );
}
