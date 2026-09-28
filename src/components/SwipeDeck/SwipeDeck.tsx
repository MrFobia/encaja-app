import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  animate as animateValue,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { useAppState } from "../../state/AppContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { RecipeCard } from "../RecipeCard/RecipeCard";
import { RecipeThumb } from "../RecipeThumb/RecipeThumb";
import type { Recipe } from "../../types/recipe";
import { SlotOutline } from "../Piece/Piece";
import { RecipeDetailSheet } from "../RecipeDetailSheet/RecipeDetailSheet";
import { ArrowRight, Check, Cross, Heart } from "../Icons";
import { Link, useNavigate } from "react-router-dom";
import "./SwipeDeck.css";

type ExitDirection = { type: "keep" | "discard"; velocity: number } | null;

const DRAG_THRESHOLD = 90;

function buildExitVariant(dir: ExitDirection, reducedMotion: boolean) {
  if (reducedMotion || !dir) {
    return { opacity: 0, transition: { duration: 0.001 } };
  }
  // Asimetría intencional: guardar "pesa" más (más lento, menos rotación),
  // descartar sale más liviano y con más giro — nunca al revés.
  const boost = Math.min(Math.abs(dir.velocity) / 1000, 1);
  if (dir.type === "keep") {
    return {
      x: 480 + boost * 160,
      rotate: 14 + boost * 4,
      opacity: 0,
      transition: { duration: 0.46 - boost * 0.1, ease: [0.2, 0.9, 0.25, 1] as const },
    };
  }
  return {
    x: -560 - boost * 220,
    rotate: -24 - boost * 6,
    opacity: 0,
    transition: { duration: 0.3 - boost * 0.06, ease: [0.2, 0.9, 0.25, 1] as const },
  };
}

interface DeckCardProps {
  recipe: Recipe;
  blocked: boolean;
  blockedAllergens: string[];
  reducedMotion: boolean;
  refused: boolean;
  exitDirection: ExitDirection;
  onCommit: (type: "keep" | "discard", velocity: number) => void;
  onBlockedAttempt: () => void;
}

/** Una tarjeta individual del mazo: dueña de su propia física de drag.
 *  Al montar una nueva (nueva `key` = nuevo recipe.id) arranca siempre en
 *  x=0 — nunca hereda el desplazamiento de la tarjeta anterior. */
function DeckCard({
  recipe,
  blocked,
  blockedAllergens,
  reducedMotion,
  refused,
  exitDirection,
  onCommit,
  onBlockedAttempt,
}: DeckCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 0, 260], [-14, 0, 14], { clamp: true });
  const keepStampOpacity = useTransform(x, [20, 120], [0, 1], { clamp: true });
  const discardStampOpacity = useTransform(x, [-120, -20], [1, 0], { clamp: true });

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      if (Math.abs(info.offset.x) > DRAG_THRESHOLD) {
        onCommit(info.offset.x > 0 ? "keep" : "discard", info.velocity.x);
        return;
      }
      // Snap-back con spring subamortiguado -> leve overshoot, tal como pide el spec.
      animateValue(x, 0, { type: "spring", stiffness: 320, damping: 16, mass: 0.7 });
    },
    [onCommit, x],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (blocked) onBlockedAttempt();
        else onCommit("keep", 0);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        onCommit("discard", 0);
      }
    },
    [blocked, onCommit, onBlockedAttempt],
  );

  const cardState = isDragging ? "dragging" : blocked ? "blocked" : "default";

  return (
    <motion.div
      className="swipe-deck__card"
      role="group"
      tabIndex={0}
      aria-roledescription="tarjeta de receta deslizable"
      aria-label={`${recipe.name}. ${
        blocked
          ? "Bloqueada por alergia, no se puede guardar."
          : "Flecha derecha para guardar, flecha izquierda para descartar."
      }`}
      onKeyDown={handleKeyDown}
      style={reducedMotion ? undefined : { x, rotate }}
      drag={!reducedMotion && !blocked ? "x" : false}
      dragElastic={0.65}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={buildExitVariant(exitDirection, reducedMotion)}
      transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] as const }}
    >
      {!reducedMotion && (
        <>
          <motion.span
            className="swipe-deck__stamp swipe-deck__stamp--keep"
            style={{ opacity: keepStampOpacity }}
          >
            Guardada
          </motion.span>
          <motion.span
            className="swipe-deck__stamp swipe-deck__stamp--pass"
            style={{ opacity: discardStampOpacity }}
          >
            Descartada
          </motion.span>
        </>
      )}
      <RecipeCard
        recipe={recipe}
        state={cardState}
        blockedAllergens={blockedAllergens}
        className={refused ? "swipe-deck__recipe-card--refused" : ""}
      />
    </motion.div>
  );
}

export function SwipeDeck() {
  const {
    currentRecipe,
    isCurrentBlocked,
    blockedAllergens,
    keepCurrent,
    discardCurrent,
    keptSlots,
    keptRecipes,
    repeatRecipe,
    isComplete,
    deckExhausted,
  } = useAppState();
  const reducedMotion = usePrefersReducedMotion();
  const navigate = useNavigate();

  const [exitDirection, setExitDirection] = useState<ExitDirection>(null);
  const [refused, setRefused] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (!isComplete) return;
    const timer = window.setTimeout(() => navigate("/resumen"), 5000);
    return () => window.clearTimeout(timer);
  }, [isComplete, navigate]);

  const commitDecision = useCallback(
    (type: "keep" | "discard", velocity: number) => {
      if (!currentRecipe) return;
      setExitDirection({ type, velocity });
      setDetailOpen(false);
      if (type === "keep") {
        setAnnouncement(`Guardada: ${currentRecipe.name}.`);
        keepCurrent();
      } else {
        setAnnouncement(`Descartada: ${currentRecipe.name}.`);
        discardCurrent();
      }
    },
    [currentRecipe, keepCurrent, discardCurrent],
  );

  const handleBlockedAttempt = useCallback(() => {
    if (!currentRecipe) return;
    setRefused(true);
    setAnnouncement(`Bloqueada por alergia: ${currentRecipe.name}. No se puede guardar.`);
    window.setTimeout(() => setRefused(false), 420);
  }, [currentRecipe]);

  const handleKeepAction = useCallback(() => {
    if (isCurrentBlocked) handleBlockedAttempt();
    else commitDecision("keep", 0);
  }, [isCurrentBlocked, handleBlockedAttempt, commitDecision]);

  const handleDiscardAction = useCallback(() => commitDecision("discard", 0), [commitDecision]);

  const handleRepeat = useCallback(
    (recipeName: string, recipeId: string) => {
      repeatRecipe(recipeId);
      setAnnouncement(`Repetiste ${recipeName} para completar tu caja.`);
    },
    [repeatRecipe],
  );

  if (isComplete || !currentRecipe) {
    return (
      <div className="swipe-deck swipe-deck--complete">
        <div className="swipe-deck__complete-copy">
          <span className="swipe-deck__complete-badge" aria-hidden="true">
            <Check />
          </span>
          <h2 className="swipe-deck__complete-title">
            {isComplete ? "Tu caja encajó." : "Se acabó el mazo."}
          </h2>
          <p className="swipe-deck__complete-lead">
            {isComplete
              ? "Cinco recetas en su hueco. Revisa el resumen para confirmar la caja de esta semana."
              : `Guardaste ${keptRecipes.length} de 5 y no queda ninguna receta más para mostrarte. Repite una de las que ya elegiste para completar la caja, o afloja algún gusto en preferencias.`}
          </p>
          <Link to={isComplete ? "/resumen" : "/preferencias"} className="btn btn--primary">
            {isComplete ? "Ver resumen" : "Editar preferencias"}
            <ArrowRight className="btn__arrow" />
          </Link>
          {isComplete && (
            <p className="swipe-deck__complete-redirect">Te llevamos al resumen en unos segundos…</p>
          )}
        </div>
        <ol className={`swipe-deck__complete-tray ${deckExhausted ? "swipe-deck__complete-tray--repeatable" : ""}`}>
          {keptSlots.map(({ slotId, recipe }) =>
            deckExhausted ? (
              <li key={slotId}>
                <button
                  type="button"
                  className="swipe-deck__repeat"
                  onClick={() => handleRepeat(recipe.name, recipe.id)}
                >
                  <RecipeThumb recipe={recipe} layoutId={`recipe-shared-${slotId}`} />
                  <span className="swipe-deck__repeat-badge" aria-hidden="true">
                    +
                  </span>
                  <span className="visually-hidden">
                    Repetir {recipe.name} para completar tu caja
                  </span>
                </button>
              </li>
            ) : (
              <li key={slotId}>
                <RecipeThumb recipe={recipe} layoutId={`recipe-shared-${slotId}`} />
              </li>
            ),
          )}
        </ol>
        <p className="visually-hidden" role="status" aria-live="polite">
          {announcement}
        </p>
      </div>
    );
  }

  return (
    <div className="swipe-deck">
      <div className="swipe-deck__progress" role="group" aria-label="Progreso del mazo">
        <ol className="swipe-deck__tray" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => {
            const slot = keptSlots[i];
            return (
              <li key={slot?.slotId ?? `hueco-${i}`} className="swipe-deck__tray-slot">
                {slot ? (
                  <RecipeThumb recipe={slot.recipe} layoutId={`recipe-shared-${slot.slotId}`} />
                ) : (
                  <SlotOutline tone="dark" />
                )}
              </li>
            );
          })}
        </ol>
        <span className="swipe-deck__progress-label">
          {keptRecipes.length} de 5 en tu caja
        </span>
      </div>

      <div className="swipe-deck__stage">
        <div className="swipe-deck__behind" aria-hidden="true" />
        <AnimatePresence custom={exitDirection} mode="wait">
          <DeckCard
            key={currentRecipe.id}
            recipe={currentRecipe}
            blocked={isCurrentBlocked}
            blockedAllergens={blockedAllergens}
            reducedMotion={reducedMotion}
            refused={refused}
            exitDirection={exitDirection}
            onCommit={commitDecision}
            onBlockedAttempt={handleBlockedAttempt}
          />
        </AnimatePresence>
      </div>

      <div className="swipe-deck__detail">
        <button
          type="button"
          className="swipe-deck__detail-toggle"
          aria-haspopup="dialog"
          onClick={() => setDetailOpen(true)}
        >
          Ver detalle
        </button>
      </div>

      <RecipeDetailSheet
        recipe={detailOpen ? currentRecipe : null}
        blocked={isCurrentBlocked}
        blockedAllergens={blockedAllergens}
        onClose={() => setDetailOpen(false)}
      />

      <div className="swipe-deck__actions">
        <button
          type="button"
          className="swipe-deck__action swipe-deck__action--discard"
          onClick={handleDiscardAction}
          aria-label={`Descartar ${currentRecipe.name}`}
        >
          <Cross />
          <span className="swipe-deck__action-label">Descartar</span>
        </button>
        <button
          type="button"
          className={`swipe-deck__action swipe-deck__action--keep ${
            isCurrentBlocked ? "swipe-deck__action--disabled" : ""
          }`}
          onClick={handleKeepAction}
          aria-label={
            isCurrentBlocked
              ? `${currentRecipe.name} bloqueada por alergia, no se puede guardar`
              : `Guardar ${currentRecipe.name}`
          }
          aria-disabled={isCurrentBlocked}
        >
          <Heart />
          <span className="swipe-deck__action-label">Guardar</span>
        </button>
      </div>

      <p className="swipe-deck__hint">
        {isCurrentBlocked
          ? "Tiene tu alérgeno: descártala para seguir."
          : "Arrastra la pieza, usa los botones o las flechas del teclado."}
      </p>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
