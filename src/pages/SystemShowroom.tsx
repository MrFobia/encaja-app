import { RecipeCard, type RecipeCardState } from "../components/RecipeCard/RecipeCard";
import { recipeById } from "../data/recipes";
import "./SystemShowroom.css";

interface StateSpec {
  state: RecipeCardState;
  recipeId: string;
  blockedAllergens?: string[];
  modifier: string;
  note: string;
}

const STATES: StateSpec[] = [
  {
    state: "default",
    recipeId: "bowl-garbanzos",
    modifier: ".recipe-card",
    note: "Estado de reposo. Foto real con fallback a gradiente, meta con tiempo/kcal/tag.",
  },
  {
    state: "dragging",
    recipeId: "pollo-curry",
    modifier: ".recipe-card--dragging",
    note: "Mientras se arrastra: tinte salvia sobre la foto, etiqueta de estado en salvia.",
  },
  {
    state: "kept",
    recipeId: "salmon-teriyaki",
    modifier: ".recipe-card--kept",
    note: "Guardada con éxito: borde y halo salvia. Nunca rojo — el rojo es solo alergia.",
  },
  {
    state: "discarded",
    recipeId: "pasta-pesto",
    modifier: ".recipe-card--discarded",
    note: "Descartada por gusto: opacidad reducida, foto en gris. Color neutro, no alérgeno.",
  },
  {
    state: "blocked",
    recipeId: "ceviche-mixto",
    blockedAllergens: ["mariscos"],
    modifier: ".recipe-card--blocked",
    note: "Único estado que usa #C23B22. Bloqueo real de seguridad, no de preferencia.",
  },
  {
    state: "loading",
    recipeId: "poke-atun",
    modifier: ".recipe-card--loading",
    note: "Buscando reemplazo automático tras un descarte: shimmer + nombre oculto.",
  },
];

export function SystemShowroom() {
  return (
    <div className="wrap system-page">
      <h1 className="system-page__title">Tarjeta de receta — 6 estados</h1>
      <p className="system-page__lead">
        El componente que sostiene todo el flujo de personalización, con sus estados
        especificados de forma consistente. Cada tarjeta es el mismo bloque BEM
        <code> .recipe-card</code>, solo cambia el modificador.
      </p>

      <div className="system-page__grid">
        {STATES.map((spec) => {
          const recipe = recipeById(spec.recipeId);
          if (!recipe) return null;
          return (
            <figure key={spec.state} className="system-page__cell">
              <RecipeCard
                recipe={recipe}
                state={spec.state}
                blockedAllergens={spec.blockedAllergens}
                showStateTag
              />
              <figcaption className="system-page__caption">
                <code className="system-page__modifier">{spec.modifier}</code>
                <p>{spec.note}</p>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
