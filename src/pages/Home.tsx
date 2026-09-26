import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppContext";
import "./Home.css";

// Three.js/R3F/drei son ~1.3MB: separados en su propio chunk para que
// /preferencias, /deck, /resumen, etc. no paguen ese peso al navegar.
const Hero3D = lazy(() => import("../components/Hero3D/Hero3D").then((m) => ({ default: m.Hero3D })));

const STEPS = [
  {
    n: "1",
    title: "Preferencias",
    body: "Confirmá alergias (restricción real) y gustos (preferencia blanda) en un panel, no en un formulario largo.",
  },
  {
    n: "2",
    title: "Swipe Deck",
    body: "Derecha para mantener, izquierda para descartar. Lo prohibido por alergia nunca aparece guardable.",
  },
  {
    n: "3",
    title: "Resumen",
    body: "Tus 5 recetas confirmadas, precio total y un cambio puntual por fila si te arrepentís de alguna.",
  },
];

export function Home() {
  const navigate = useNavigate();
  const { acceptDefaultBox } = useAppState();

  const handleKeepDefault = () => {
    acceptDefaultBox();
    navigate("/resumen");
  };

  return (
    <div className="wrap home-hero">
      <div className="home-hero__copy">
        <h1 className="home-hero__title">
          Personalizar la caja <em>en un swipe</em>, no en un formulario.
        </h1>
        <p className="home-hero__lead">
          Encaja convierte elegir 5 recetas semanales en una secuencia de micro-decisiones
          rápidas: receta por receta, deslizás para mantener o cambiar. Las alergias se filtran
          de forma proactiva y visible, antes de que veas la primera tarjeta.
        </p>
        <div className="home-hero__pills">
          <div className="home-hero__pill">
            <b>Menos de 5 minutos</b>
            <span>Decidí la caja completa en los espacios muertos del día.</span>
          </div>
          <div className="home-hero__pill">
            <b>Alergias siempre filtradas</b>
            <span>Lo que contiene un alérgeno activo nunca llega guardable a tu mesa.</span>
          </div>
          <div className="home-hero__pill">
            <b>5 recetas, control real</b>
            <span>Swipe con física real, respaldo de botones y teclado en todo momento.</span>
          </div>
        </div>
        <div className="home-hero__actions">
          <button
            type="button"
            className="home-hero__cta"
            onClick={() => navigate("/preferencias")}
          >
            Personalizar mi caja
          </button>
          <button type="button" className="home-hero__secondary" onClick={handleKeepDefault}>
            Mantener selección automática
          </button>
        </div>
      </div>
      <div className="home-hero__visual">
        <Suspense fallback={<div className="home-hero__visual-loading" aria-hidden="true" />}>
          <Hero3D />
        </Suspense>
      </div>

      <ol className="home-steps">
        {STEPS.map((step) => (
          <li key={step.n} className="home-steps__step">
            <span className="home-steps__number">{step.n}</span>
            <div>
              <h2 className="home-steps__title">{step.title}</h2>
              <p className="home-steps__body">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
