import { NavLink } from "react-router-dom";
import "./NavBar.css";

const LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/preferencias", label: "Preferencias" },
  { to: "/deck", label: "Deck" },
  { to: "/resumen", label: "Resumen" },
  { to: "/sistema", label: "Sistema" },
];

export function NavBar() {
  return (
    <nav className="site-nav">
      <div className="wrap site-nav__inner">
        <NavLink to="/" className="site-nav__brand">
          <span className="site-nav__dot" aria-hidden="true" />
          Encaja
        </NavLink>
        <ul className="site-nav__links">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `site-nav__link ${isActive ? "site-nav__link--active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
