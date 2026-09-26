import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { LayoutGroup } from "framer-motion";
import { AppProvider } from "./state/AppContext";
import { NavBar } from "./components/Layout/NavBar";
import { Home } from "./pages/Home";
import { Preferences } from "./pages/Preferences";
import { Deck } from "./pages/Deck";
import { Summary } from "./pages/Summary";
import { Confirmation } from "./pages/Confirmation";
import { SystemShowroom } from "./pages/SystemShowroom";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        {/* LayoutGroup persiste entre rutas: es lo que permite que
            RecipeThumb comparta layoutId entre el mazo completo (/deck) y
            las filas del resumen (/resumen) para el shared-element. */}
        <LayoutGroup>
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/preferencias" element={<Preferences />} />
              <Route path="/deck" element={<Deck />} />
              <Route path="/resumen" element={<Summary />} />
              <Route path="/confirmacion" element={<Confirmation />} />
              <Route path="/sistema" element={<SystemShowroom />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </LayoutGroup>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
