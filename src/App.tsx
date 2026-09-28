import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { LayoutGroup } from "framer-motion";
import { AppProvider } from "./state/AppContext";
import { AuthProvider } from "./state/AuthContext";
import { OrdersProvider } from "./state/OrdersContext";
import { NavBar } from "./components/Layout/NavBar";
import { Home } from "./pages/Home";
import { Preferences } from "./pages/Preferences";
import { Deck } from "./pages/Deck";
import { Summary } from "./pages/Summary";
import { Payment } from "./pages/Payment";
import { Confirmation } from "./pages/Confirmation";
import { Panel } from "./pages/Panel";
import { SystemShowroom } from "./pages/SystemShowroom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrdersProvider>
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
                  <Route path="/pago" element={<Payment />} />
                  <Route path="/confirmacion" element={<Confirmation />} />
                  <Route path="/panel" element={<Panel />} />
                  <Route path="/sistema" element={<SystemShowroom />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <footer className="site-footer on-dark">
                <div className="wrap site-footer__inner">
                  <img src="/brand/encaja-logo-invertido.svg" alt="Encaja" width="150" height="47" />
                  <p>Comida saludable local. Cinco recetas por semana, elegidas a tu medida.</p>
                </div>
              </footer>
            </LayoutGroup>
          </AppProvider>
        </OrdersProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
