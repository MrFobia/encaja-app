import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { RecipeThumb } from "../components/RecipeThumb/RecipeThumb";
import { ArrowRight, Calendar, Check, Clock, MapPin } from "../components/Icons";
import { useAppState } from "../state/AppContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { DELIVERY_TIME_SLOTS, formatPrice, nextDeliveryDate, WEEKDAYS } from "../lib/format";
import { PRICE_PER_BOX } from "../lib/pricing";
import "./Summary.css";

export function Summary() {
  const navigate = useNavigate();
  const {
    state,
    keptSlots,
    keptRecipes,
    hasReplacement,
    swapKept,
    setDay,
    setDeliveryAddress,
    setDeliveryTimeSlot,
  } = useAppState();
  const reduce = usePrefersReducedMotion();
  const [nutritionOpen, setNutritionOpen] = useState(false);

  if (keptRecipes.length < 5) {
    return (
      <div className="wrap summary summary--empty">
        <h1 className="summary__title">Todavía faltan piezas.</h1>
        <p className="summary__lead">
          Guardaste {keptRecipes.length} de 5. Vuelve al mazo para completar tu caja.
        </p>
        <Link to="/deck" className="btn btn--primary">
          Ir al mazo
          <ArrowRight className="btn__arrow" />
        </Link>
      </div>
    );
  }

  const totalKcal = keptRecipes.reduce((sum, r) => sum + r.kcal, 0);
  const totalMinutes = keptRecipes.reduce((sum, r) => sum + r.minutes, 0);
  const canCheckout = state.deliveryAddress.trim().length > 0 && Boolean(state.deliveryTimeSlot);

  return (
    <div className="wrap summary">
      <div className="summary__head">
        <h1 className="summary__title">Tu caja quedó lista.</h1>
        <p className="summary__lead">
          ¿Te arrepientes de alguna? Cámbiala y entra la siguiente disponible, con tus alergias
          ya respetadas. Verifica también en qué día vas a cocinar cada una — puedes repetir
          día, cada receta ya es única.
        </p>
      </div>

      <ol className="summary__tray on-dark">
        <AnimatePresence initial={false} mode="popLayout">
          {keptSlots.map(({ slotId, recipe }) => (
            <motion.li
              key={slotId}
              layout={!reduce}
              className="summary__row"
              initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateX(40px)" }}
              animate={{ opacity: 1, transform: "translateX(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateX(-40px)" }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            >
              <RecipeThumb recipe={recipe} layoutId={`recipe-shared-${slotId}`} />
              <div className="summary__row-text">
                <span className="summary__name">{recipe.name}</span>
                <span className="summary__meta">
                  {recipe.minutes} min · {recipe.kcal} kcal
                </span>
                <div
                  className="summary__days"
                  role="group"
                  aria-label={`Día para cocinar ${recipe.name}`}
                >
                  {WEEKDAYS.map((day, i) => (
                    <button
                      key={day.label}
                      type="button"
                      className="summary__day"
                      aria-pressed={state.days[slotId] === i}
                      aria-label={day.label}
                      title={day.label}
                      onClick={() => setDay(slotId, i)}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="summary__swap"
                disabled={!hasReplacement}
                onClick={() => swapKept(slotId)}
                aria-label={`Cambiar ${recipe.name}`}
                title={hasReplacement ? "Cambiar por otra receta disponible" : "No quedan reemplazos disponibles"}
              >
                Cambiar
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      <aside className="summary__checkout">
        <button
          type="button"
          className="summary__nutrition-toggle"
          aria-expanded={nutritionOpen}
          onClick={() => setNutritionOpen((v) => !v)}
        >
          {nutritionOpen ? "Ocultar resumen nutricional" : "Ver resumen nutricional"}
        </button>
        {nutritionOpen && (
          <p className="summary__nutrition">
            {totalKcal.toLocaleString("es-CO")} kcal en total · {Math.round(totalKcal / 5)} kcal
            por receta · {totalMinutes} min de cocina en la semana.
          </p>
        )}
        <p className="summary__delivery">
          <Calendar />
          Entrega el {nextDeliveryDate().toLowerCase()}
        </p>

        <label className="summary__field" htmlFor="delivery-address">
          <span className="summary__field-label">
            <MapPin /> Dirección de entrega
          </span>
          <input
            id="delivery-address"
            className="summary__address-input"
            type="text"
            placeholder="Calle, número, barrio, ciudad"
            autoComplete="street-address"
            value={state.deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </label>

        <div className="summary__field">
          <span className="summary__field-label">
            <Clock /> Horario de entrega
          </span>
          <div className="summary__slots" role="group" aria-label="Elige un horario de entrega">
            {DELIVERY_TIME_SLOTS.map((slot) => (
              <button
                key={slot.id}
                type="button"
                className={`summary__slot ${state.deliveryTimeSlot === slot.id ? "is-active" : ""}`}
                aria-pressed={state.deliveryTimeSlot === slot.id}
                onClick={() => setDeliveryTimeSlot(slot.id)}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>

        <p className="summary__price">
          <span>Total de la caja</span>
          <b>{formatPrice(PRICE_PER_BOX)}</b>
        </p>
        {!canCheckout && (
          <p className="summary__warn">
            Agrega tu dirección y elige un horario de entrega para continuar.
          </p>
        )}
        <button
          type="button"
          className="btn btn--primary summary__confirm"
          onClick={() => navigate("/pago")}
          disabled={!canCheckout}
        >
          <Check className="btn__arrow" />
          Ir a pagar
        </button>
      </aside>
    </div>
  );
}
