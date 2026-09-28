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
    modifier: ".rcard",
    note: "Reposo: la loseta troquelada con la foto real, nombre en display y ficha.",
  },
  {
    state: "dragging",
    recipeId: "pollo-curry",
    modifier: ".rcard--dragging",
    note: "Mientras se arrastra: la pieza se levanta con sombra más larga.",
  },
  {
    state: "kept",
    recipeId: "salmon-teriyaki",
    modifier: ".rcard--kept",
    note: "Guardada: contorno teal, el color de actuar. Nunca rojo.",
  },
  {
    state: "discarded",
    recipeId: "pasta-pesto",
    modifier: ".rcard--discarded",
    note: "Descartada por gusto: pieza apagada y en gris, sin rojo.",
  },
  {
    state: "blocked",
    recipeId: "ceviche-mixto",
    blockedAllergens: ["mariscos"],
    modifier: ".rcard--blocked",
    note: "Único estado con el rojo #D7261E: bloqueo de seguridad, no de gusto.",
  },
  {
    state: "loading",
    recipeId: "poke-atun",
    modifier: ".rcard--loading",
    note: "Buscando reemplazo tras un descarte: hueco punteado que respira.",
  },
];

export function SystemShowroom() {
  return (
    <div className="wrap system-page">
      <h1 className="system-page__title">Tarjeta de receta, 6 estados</h1>
      <p className="system-page__lead">
        El componente que sostiene el flujo de personalización. Cada tarjeta es el mismo
        bloque <code>.rcard</code>; solo cambia el modificador.
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
