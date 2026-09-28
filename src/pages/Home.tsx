import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { allergyChips } from "../data/chips";
import { DECK_ORDER, TARGET_KEPT, recipeById } from "../data/recipes";
import { useAppState } from "../state/AppContext";
import { useAuth } from "../state/AuthContext";
import { useOrders } from "../state/OrdersContext";
import { blockingAllergens, isBlockedByAllergy } from "../state/deckLogic";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { formatAllergenWarning, nextDeliveryDate, nextEditCutoff } from "../lib/format";
import { Piece, SlotOutline } from "../components/Piece/Piece";
import { RecipeDetailSheet } from "../components/RecipeDetailSheet/RecipeDetailSheet";
import { ALLERGEN_ICONS, ArrowRight, Calendar, Clock, NoEntry, Shield, Zap } from "../components/Icons";
import type { Recipe } from "../types/recipe";
import "./Home.css";

/** Muestra del mazo para el filtro del hero: una pieza por cada alérgeno
 *  posible, así cualquier chip que se active expulsa algo visible. */
const DEMO_COLUMN = ["salmon-teriyaki", "pasta-pesto", "curry-lentejas", "ceviche-mixto", "pollo-curry"];

const STEPS = [
  {
    n: "1",
    title: "Alergias",
    body: "Cuéntanos qué evitar.",
  },
  {
    n: "2",
    title: "Swipe",
    body: "Elige tus 5 recetas.",
  },
  {
    n: "3",
    title: "Resumen",
    body: "Confirma tu caja.",
  },
];

const spring = { type: "spring", duration: 0.55, bounce: 0.18 } as const;

function HeroFilter() {
  const { state, toggleAllergy, availableCount, totalCount } = useAppState();
  const reduce = usePrefersReducedMotion();
  const column = DEMO_COLUMN.map((id) => recipeById(id)).filter((r): r is Recipe => Boolean(r));
  const blockedFor = (r: Recipe) => r.allergens.filter((a) => state.allergies[a]);

  return (
    <section className="hero-filter on-dark" aria-labelledby="hero-filter-title">
      <h2 id="hero-filter-title" className="visually-hidden">
        Filtro de alergias en vivo
      </h2>
      <div className="hero-filter__chips" role="group" aria-label="Alergias de tu hogar">
        {allergyChips.map((chip) => {
          const on = Boolean(state.allergies[chip.id]);
          const Off = ALLERGEN_ICONS[chip.id];
          return (
            <button
              key={chip.id}
              type="button"
              className={`allergy-chip ${on ? "is-on" : ""}`}
              aria-pressed={on}
              title={chip.helper}
              onClick={() => toggleAllergy(chip.id)}
            >
              {on ? <Shield /> : <Off />}
              {chip.label}
            </button>
          );
        })}
      </div>

      <p className="hero-filter__count" role="status" aria-live="polite">
        <span className="hero-filter__num">
          {availableCount} de {totalCount}
        </span>
        <span className="hero-filter__unit">recetas disponibles</span>
      </p>

      <LayoutGroup>
        <ol className="hero-filter__column">
          {column.map((recipe, i) => {
            const hits = blockedFor(recipe);
            const blocked = isBlockedByAllergy(recipe, state.allergies);
            return (
              <motion.li
                key={recipe.id}
                className={`hero-filter__row ${blocked ? "is-blocked" : ""}`}
                initial={reduce ? false : { opacity: 0, transform: "translateY(24px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                transition={{ ...spring, delay: reduce ? 0 : 0.15 + i * 0.06 }}
              >
                <div className="hero-filter__slot">
                  <SlotOutline />
                  {blocked && (
                    <svg className="hero-filter__burst" viewBox="0 0 60 60" aria-hidden="true">
                      <path d="M30 8l-4 14M44 14l-9 10M50 30l-13 2" />
                    </svg>
                  )}
                  <div className="hero-filter__piece">
                    <Piece slug={recipe.slug} blocked={blocked} eager />
                  </div>
                </div>
                <div className="hero-filter__label">
                  <span className="hero-filter__name">{recipe.name}</span>
                  <AnimatePresence initial={false}>
                    {blocked && (
                      <motion.span
                        className="allergy-tag"
                        initial={{ opacity: 0, transform: "scale(0.92)" }}
                        animate={{ opacity: 1, transform: "scale(1)" }}
                        exit={{ opacity: 0, transform: "scale(0.92)" }}
                        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <NoEntry />
                        {formatAllergenWarning(hits)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </LayoutGroup>
    </section>
  );
}

function RecipeRail() {
  const { state } = useAppState();
  const recipes = DECK_ORDER.map((id) => recipeById(id)).filter((r): r is Recipe => Boolean(r));
  const [detailId, setDetailId] = useState<string | null>(null);
  const detailRecipe = detailId ? recipeById(detailId) ?? null : null;

  const railRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = () => {
    const el = railRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = railRef.current;
    if (!el) return;
    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollByPage = (direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section id="recetas" className="rail-section" aria-labelledby="rail-title">
      <div className="wrap rail-section__head">
        <h2 id="rail-title" className="section-title">
          {DECK_ORDER.length} recetas en el mazo de esta semana.
        </h2>
        <p className="section-lead">
          Cinco vienen armadas por defecto; el resto espera como reemplazo. Las que chocan con tus
          alergias se marcan antes de que llegues al swipe.
        </p>
      </div>
      <div className="rail-wrap">
        <button
          type="button"
          className="rail__nav rail__nav--prev"
          onClick={() => scrollByPage(-1)}
          disabled={!canScrollPrev}
          aria-label="Ver recetas anteriores"
        >
          <ArrowRight />
        </button>
        <button
          type="button"
          className="rail__nav rail__nav--next"
          onClick={() => scrollByPage(1)}
          disabled={!canScrollNext}
          aria-label="Ver más recetas"
        >
          <ArrowRight />
        </button>
        <ul className="rail" aria-label="Recetas de la semana" ref={railRef} onScroll={updateScrollState}>
        {recipes.map((r) => {
          const blocked = isBlockedByAllergy(r, state.allergies);
          const hits = r.allergens.filter((a) => state.allergies[a]);
          return (
            <li key={r.id} className={`rail__item ${blocked ? "is-blocked" : ""}`}>
              <button type="button" className="rail__button" onClick={() => setDetailId(r.id)}>
                <Piece slug={r.slug} shape="tile" blocked={blocked} />
                <div className="rail__text">
                  <h3 className="rail__name">{r.name}</h3>
                  <p className="rail__meta">
                    {r.minutes} min · {r.kcal} kcal · {r.isCore ? "En tu caja" : "Reemplazo"}
                  </p>
                  {blocked ? (
                    <span className="allergy-tag">
                      <NoEntry />
                      {formatAllergenWarning(hits)}
                    </span>
                  ) : (
                    <p className="rail__tags">{r.tags.join(" · ")}</p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
        </ul>
      </div>

      <RecipeDetailSheet
        recipe={detailRecipe}
        blocked={detailRecipe ? isBlockedByAllergy(detailRecipe, state.allergies) : false}
        blockedAllergens={detailRecipe ? blockingAllergens(detailRecipe, state.allergies) : []}
        onClose={() => setDetailId(null)}
      />
    </section>
  );
}

function PeopleSubscribe() {
  const navigate = useNavigate();
  return (
    <section className="people-cta" aria-labelledby="people-cta-title">
      <div className="wrap people-cta__inner">
        <div className="people-cta__copy">
          <h2 id="people-cta-title" className="section-title">
            Así se ve un martes sin estrés.
          </h2>
          <p className="section-lead">
            Encaja llega a tu puerta ya armada. Tú decides qué entra en menos de lo que
            tarda el café en enfriarse — el resto lo cocinas cuando quieras.
          </p>
          <button type="button" className="btn btn--primary" onClick={() => navigate("/preferencias")}>
            Quiero mi caja
            <ArrowRight className="btn__arrow" />
          </button>
        </div>
        <img
          className="people-cta__photo"
          src="/images/lifestyle/encaja-lifestyle-hero.jpg"
          alt="Una clienta sonríe al abrir su caja Encaja recién entregada sobre la mesada de su cocina."
          loading="lazy"
        />
      </div>
    </section>
  );
}

function BoxSubscribe() {
  const navigate = useNavigate();
  return (
    <section className="box-cta on-dark" aria-labelledby="box-cta-title">
      <div className="wrap box-cta__inner">
        <div className="box-cta__copy">
          <h2 id="box-cta-title" className="box-cta__title">
            Tu semana ya puede estar encajada.
          </h2>
          <p>Una caja, un gesto, cinco aciertos. Sin permanencia, sin letra chica.</p>
          <button type="button" className="btn btn--primary" onClick={() => navigate("/preferencias")}>
            Suscribirme
            <ArrowRight className="btn__arrow" />
          </button>
        </div>
        <img
          className="box-cta__photo"
          src="/images/packaging/encaja-packaging-hero.jpg"
          alt="Caja Encaja abierta con una bandeja troquelada y la bolsa térmica de entrega al lado."
          loading="lazy"
        />
      </div>
    </section>
  );
}

function ClosingTray() {
  const navigate = useNavigate();
  const { keptRecipes, acceptDefaultBox, isComplete } = useAppState();
  const slots = Array.from({ length: TARGET_KEPT }, (_, i) => keptRecipes[i]);

  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="wrap closing__inner">
        <div className="closing__copy">
          <h2 id="closing-title" className="section-title">
            {isComplete ? "Tu caja ya encajó." : "Cinco piezas. Encaja las tuyas."}
          </h2>
          <ul className="closing__facts">
            <li>
              <Calendar />
              Entrega el {nextDeliveryDate().toLowerCase()}
            </li>
            <li>
              <Clock />
              Puedes editar hasta el {nextEditCutoff().replace(/^./, (c) => c.toLowerCase())}
            </li>
          </ul>
          <div className="closing__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate(isComplete ? "/resumen" : "/preferencias")}
            >
              {isComplete ? "Ver mi caja" : "Arma tu caja"}
              <ArrowRight className="btn__arrow" />
            </button>
            {!isComplete && (
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  acceptDefaultBox();
                  navigate("/resumen");
                }}
              >
                Mantener la caja automática
              </button>
            )}
          </div>
        </div>
        <ol className="tray" aria-label={`Tu caja: ${keptRecipes.length} de ${TARGET_KEPT} recetas`}>
          {slots.map((r, i) => (
            <li key={`slot-${i}`} className="tray__slot">
              {r ? (
                <>
                  <Piece slug={r.slug} />
                  <span className="visually-hidden">{r.name}</span>
                </>
              ) : (
                <>
                  <SlotOutline />
                  <span className="visually-hidden">Hueco libre</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { state, acceptDefaultBox, startNewWeek } = useAppState();
  const { user } = useAuth();
  const { ordersByEmail } = useOrders();
  const hasOrder = Boolean(user && ordersByEmail(user.email).length > 0);

  const [heroDetailOpen, setHeroDetailOpen] = useState(false);
  const proofRecipe = recipeById("bowl-garbanzos");
  const proofBlocked = proofRecipe ? isBlockedByAllergy(proofRecipe, state.allergies) : false;
  const reduceMotion = usePrefersReducedMotion();

  return (
    <>
      <section className="hero">
        <div className="hero-mobile">
          <video
            className="hero-mobile__video"
            src="/videos/encaja-hero-mobile.mp4"
            poster="/videos/encaja-hero-poster.jpg"
            autoPlay={!reduceMotion}
            loop={!reduceMotion}
            muted
            playsInline
            aria-hidden="true"
          />
          <div className="hero-mobile__scrim" aria-hidden="true" />
          <div className="hero-mobile__content">
            <h1 className="hero-mobile__title">Tu semana, encajada.</h1>
            <p className="hero-mobile__lead">
              Elige 5 recetas con un gesto. Lo que tiene tus alergias no entra.
            </p>
            {hasOrder ? (
              <button type="button" className="btn btn--primary" onClick={() => navigate("/panel")}>
                Ver mi pedido
                <ArrowRight className="btn__arrow" />
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={() => navigate("/deck")}>
                Arma tu cajita
                <ArrowRight className="btn__arrow" />
              </button>
            )}
          </div>
        </div>
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <h1 className="hero__title">
              <span className="hero__line hero__line--first">
                Tu semana,
                <svg className="hero__ticks hero__ticks--comma" viewBox="0 0 60 60" aria-hidden="true">
                  <path d="M30 6l-5 16M46 16l-12 11M52 34l-15 2" />
                </svg>
              </span>
              <span className="hero__line">encajada.</span>
            </h1>
            <p className="hero__lead">
              <span>Elige 5 recetas con un gesto.</span> <span>Lo que tiene tus alergias no entra.</span>
            </p>
            <div className="hero__actions">
              {hasOrder ? (
                <>
                  <button type="button" className="btn btn--primary" onClick={() => navigate("/panel")}>
                    Ver mi pedido
                    <ArrowRight className="btn__arrow" />
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => {
                      startNewWeek();
                      navigate("/deck");
                    }}
                  >
                    Crear otra cajita
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn--primary" onClick={() => navigate("/deck")}>
                    Arma tu cajita
                    <ArrowRight className="btn__arrow" />
                  </button>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      acceptDefaultBox();
                      navigate("/resumen");
                    }}
                  >
                    Mantener la caja automática
                  </button>
                </>
              )}
            </div>
            <div className="hero__proof">
              <div className="hero__proof-piece-wrap">
                <img
                  className="hero__proof-decor hero__proof-decor--leaf"
                  src="/images/decor/encaja-decor-cilantro.webp"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <img
                  className="hero__proof-decor hero__proof-decor--pepper"
                  src="/images/decor/encaja-decor-pimienta.webp"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <button
                  type="button"
                  className="hero__proof-piece"
                  onClick={() => setHeroDetailOpen(true)}
                  aria-label={`Ver detalle de ${proofRecipe?.name ?? "la receta"}`}
                >
                  <Piece slug="bowl-garbanzos" shape="tile" eager />
                </button>
              </div>
              <div className="hero__proof-badge">
                <span className="hero__proof-icon" aria-hidden="true">
                  <Zap />
                </span>
                <p>
                  <strong>Menos de 2 minutos.</strong>
                  <span>Interactivo: deslizas, guardas, listo.</span>
                </p>
              </div>
            </div>
          </div>
          <HeroFilter />
        </div>
      </section>

      <RecipeDetailSheet
        recipe={heroDetailOpen ? proofRecipe ?? null : null}
        blocked={proofBlocked}
        blockedAllergens={proofRecipe ? blockingAllergens(proofRecipe, state.allergies) : []}
        onClose={() => setHeroDetailOpen(false)}
      />

      <section id="como-funciona" className="steps" aria-labelledby="steps-title">
        <div className="wrap">
          <h2 id="steps-title" className="visually-hidden">
            Cómo funciona
          </h2>
          <ol className="steps__row">
            {STEPS.map((s) => (
              <li key={s.n} className="step">
                <span className="step__n" aria-hidden="true">
                  {s.n}
                </span>
                <div>
                  <h3 className="step__title">{s.title}</h3>
                  <p className="step__body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <RecipeRail />

      <PeopleSubscribe />

      <section className="rule on-dark" aria-labelledby="rule-title">
        <div className="wrap rule__inner">
          <div className="rule__demo" aria-hidden="true">
            <div className="rule__case">
              <Piece slug="pollo-limon" className="rule__piece rule__piece--out" />
              <p className="rule__caption">Descartada por gusto: sale sin drama y entra otra.</p>
            </div>
            <div className="rule__case">
              <Piece slug="ceviche-mixto" blocked className="rule__piece rule__piece--blocked" />
              <span className="allergy-tag rule__tag">
                <NoEntry />
                Contiene mariscos
              </span>
              <p className="rule__caption">Con tu alérgeno: marcada en rojo y sin opción de guardar.</p>
            </div>
          </div>
          <div className="rule__copy">
            <h2 id="rule-title" className="rule__title">
              El rojo es solo para lo que te hace daño.
            </h2>
            <p>
              Descartar porque no te provoca es un gesto neutro. El rojo aparece únicamente cuando
              una receta contiene un alérgeno que marcaste, así lo ves antes de leer una sola
              etiqueta.
            </p>
          </div>
        </div>
      </section>

      <ClosingTray />

      <BoxSubscribe />
    </>
  );
}
