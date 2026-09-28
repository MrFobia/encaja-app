import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppState } from "../state/AppContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { nextEditCutoff, timeSlotLabel, weekdayLabel } from "../lib/format";
import { RecipeThumb } from "../components/RecipeThumb/RecipeThumb";
import { ArrowRight, Clock, MapPin } from "../components/Icons";
import "./Confirmation.css";

export function Confirmation() {
  const navigate = useNavigate();
  const { state, keptSlots, keptRecipes, startNewWeek } = useAppState();
  const byDay = [...keptSlots].sort(
    (a, b) => (state.days[a.slotId] ?? 0) - (state.days[b.slotId] ?? 0),
  );
  const reduce = usePrefersReducedMotion();
  const [upsellShown, setUpsellShown] = useState(false);

  if (!state.confirmed) {
    return (
      <div className="wrap confirm confirm--empty">
        <h1 className="confirm__title">Tu caja aún no está confirmada.</h1>
        <p className="confirm__lead">Vuelve al resumen para revisar tus 5 recetas y confirmar.</p>
        <Link to="/resumen" className="btn btn--primary">
          Ir al resumen
          <ArrowRight className="btn__arrow" />
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap confirm">
      <div className="confirm__copy">
        <h1 className="confirm__title">Listo. Tu caja encajó.</h1>
        <p className="confirm__lead">
          Tus {keptRecipes.length} recetas ya están en la lista de esta semana. Puedes cambiarlas
          hasta el corte; después empezamos a prepararlas.
        </p>
        <p className="confirm__cutoff">
          <Clock />
          <span>
            Editable hasta el <b>{nextEditCutoff().replace(/^./, (c) => c.toLowerCase())}</b>
          </span>
        </p>

        <p className="confirm__delivery-details">
          <MapPin />
          <span>
            {state.deliveryAddress || "Sin dirección registrada"}
            {state.deliveryTimeSlot && ` · ${timeSlotLabel(state.deliveryTimeSlot)}`}
          </span>
        </p>

        <img
          className="confirm__packshot"
          src="/images/packaging/encaja-packaging-hero.jpg"
          alt="Bandejas troqueladas de Encaja dentro de su caja de cartón, junto a la bolsa de entrega de la marca."
          loading="lazy"
        />
      </div>

      <div className="confirm__box on-dark">
        <h2 className="confirm__box-title">Tu semana, día por día.</h2>
        <ol className="confirm__box-list" aria-label="Recetas confirmadas, por día">
          {byDay.map(({ slotId, recipe }, i) => (
            <motion.li
              key={slotId}
              initial={reduce ? false : { opacity: 0, transform: "translateY(-60px) rotate(-6deg)" }}
              animate={{ opacity: 1, transform: "translateY(0px) rotate(0deg)" }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.22, delay: reduce ? 0 : 0.12 + i * 0.07 }}
            >
              <RecipeThumb recipe={recipe} layoutId={`recipe-shared-${slotId}`} />
              <span className="confirm__box-day" aria-hidden="true">
                {weekdayLabel(state.days[slotId] ?? 0)}
              </span>
              <span className="visually-hidden">
                {weekdayLabel(state.days[slotId] ?? 0)}: {recipe.name}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="confirm__after">
        <div className="confirm__upsell">
          <p>¿Un extra para esta semana? Es un swipe más, no una obligación.</p>
          <button
            type="button"
            className="text-link"
            onClick={() => setUpsellShown(true)}
            aria-expanded={upsellShown}
          >
            Ver un extra opcional
          </button>
          {upsellShown && (
            <p className="confirm__note">
              Esta semana todavía no hay extras cargados. Aparecerán aquí cuando estén disponibles.
            </p>
          )}
        </div>

        <div className="confirm__cta-row">
          <button type="button" className="btn btn--primary" onClick={() => navigate("/panel")}>
            Ver mi pedido en el panel
            <ArrowRight className="btn__arrow" />
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              startNewWeek();
              navigate("/preferencias");
            }}
          >
            Empezar otra semana
          </button>
        </div>
      </div>
    </div>
  );
}
