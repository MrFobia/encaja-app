import { Link, NavLink, useLocation } from "react-router-dom";
import { allergyChips } from "../../data/chips";
import { TARGET_KEPT } from "../../data/recipes";
import { useAppState } from "../../state/AppContext";
import { useAuth } from "../../state/AuthContext";
import { Shield, User } from "../Icons";
import "./NavBar.css";

/**
 * Barra fija. A la derecha vive el instrumento de la caja: huecos llenos de
 * 5 y alergias activas, visible en todas las pantallas. Lleva al paso que
 * falta (mazo mientras no esté completa, resumen cuando sí).
 */
export function NavBar() {
  const { state, keptRecipes, isComplete } = useAppState();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const activeAllergies = allergyChips.filter((c) => state.allergies[c.id]);
  // Una vez pagada, esta caja ya no es "la que estás armando" — el
  // instrumento vuelve a 0/5 en vez de seguir mostrando la caja vieja llena.
  const filled = state.confirmed ? 0 : keptRecipes.length;
  const showComplete = isComplete && !state.confirmed;

  return (
    <header className={`site-nav ${onHome ? "site-nav--home" : ""}`}>
      <div className="wrap site-nav__inner">
        <Link to="/" className="site-nav__brand" aria-label="Encaja, inicio">
          <img src="/brand/encaja-logo.svg" alt="" width="132" height="41" />
        </Link>

        <nav className="site-nav__links" aria-label="Principal">
          <a href="/#como-funciona">Cómo funciona</a>
          <a href="/#recetas">Recetas</a>
          <NavLink to="/preferencias">Alergias</NavLink>
          <a href="/proceso.html" target="_blank" rel="noopener noreferrer">
            Proceso
          </a>
        </nav>

        <Link to="/panel" className="site-nav__account" aria-label="Mi cuenta">
          <User />
          <span className="site-nav__account-label">{user ? user.name.split(" ")[0] : "Mi cuenta"}</span>
        </Link>

        <Link
          to={showComplete ? "/resumen" : filled > 0 ? "/deck" : "/preferencias"}
          className="box-meter"
          aria-label={`Tu caja: ${filled} de ${TARGET_KEPT} recetas. ${
            activeAllergies.length
              ? `Alergias activas: ${activeAllergies.map((c) => c.label).join(", ")}.`
              : "Sin alergias activas."
          }`}
        >
          <span className="box-meter__slots" aria-hidden="true">
            {Array.from({ length: TARGET_KEPT }, (_, i) => (
              <span key={i} className={`box-meter__slot ${i < filled ? "is-filled" : ""}`} />
            ))}
          </span>
          <span className="box-meter__count">
            {filled}/{TARGET_KEPT}
          </span>
          {activeAllergies.length > 0 && (
            <span className="box-meter__allergy" title={activeAllergies.map((c) => c.label).join(", ")}>
              <Shield />
              {activeAllergies.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
