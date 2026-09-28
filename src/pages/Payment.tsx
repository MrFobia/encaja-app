import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../state/AppContext";
import { useAuth } from "../state/AuthContext";
import { useOrders } from "../state/OrdersContext";
import { AuthForm } from "../components/AuthForm/AuthForm";
import { RecipeThumb } from "../components/RecipeThumb/RecipeThumb";
import { ArrowRight, Check, CreditCard, Lock } from "../components/Icons";
import { formatPrice } from "../lib/format";
import { PRICE_PER_BOX } from "../lib/pricing";
import "./Payment.css";

function cardBrand(digits: string): string {
  if (digits.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  return "Tarjeta";
}

export function Payment() {
  const navigate = useNavigate();
  const { state, keptSlots, keptRecipes, confirmOrder } = useAppState();
  const { user } = useAuth();
  const { addOrder } = useOrders();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (keptRecipes.length < 5) {
    return (
      <div className="wrap payment payment--empty">
        <h1 className="payment__title">Todavía faltan piezas.</h1>
        <p className="payment__lead">
          Guardaste {keptRecipes.length} de 5. Vuelve al mazo para completar tu caja antes de pagar.
        </p>
        <Link to="/deck" className="btn btn--primary">
          Ir al mazo
          <ArrowRight className="btn__arrow" />
        </Link>
      </div>
    );
  }

  if (state.confirmed) {
    return (
      <div className="wrap payment payment--empty">
        <h1 className="payment__title">Esta caja ya está pagada.</h1>
        <p className="payment__lead">Revisa el detalle en tu confirmación.</p>
        <Link to="/confirmacion" className="btn btn--primary">
          Ver confirmación
          <ArrowRight className="btn__arrow" />
        </Link>
      </div>
    );
  }

  const digits = cardNumber.replace(/\D/g, "");

  const onPay = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (digits.length < 12 || !cardName.trim() || !expiry.trim() || cvv.length < 3) {
      setError("Revisa los datos de la tarjeta: número, nombre, vencimiento y CVV.");
      return;
    }
    setError(null);
    addOrder({
      email: user.email,
      total: PRICE_PER_BOX,
      paymentMethod: { brand: cardBrand(digits), last4: digits.slice(-4) },
      recipes: keptSlots.map(({ slotId, recipe }) => ({
        id: recipe.id,
        name: recipe.name,
        slug: recipe.slug,
        minutes: recipe.minutes,
        kcal: recipe.kcal,
        day: state.days[slotId] ?? 0,
      })),
      deliveryAddress: state.deliveryAddress,
      deliveryTimeSlot: state.deliveryTimeSlot,
    });
    confirmOrder();
    navigate("/confirmacion");
  };

  return (
    <div className="wrap payment">
      <div className="payment__copy">
        <h1 className="payment__title">
          {user ? "Un último paso: pagar." : "Primero, tu cuenta."}
        </h1>
        <p className="payment__lead">
          {user
            ? "Guarda tu método de pago y tu caja queda encargada."
            : "Inicia sesión o crea una cuenta para guardar tu pedido y poder verlo después en tu panel."}
        </p>

        <ul className="payment__recap" aria-label="Recetas en tu caja">
          {keptSlots.map(({ slotId, recipe }) => (
            <li key={slotId}>
              <RecipeThumb recipe={recipe} />
            </li>
          ))}
        </ul>
        <p className="payment__total">
          <span>Total de la caja</span>
          <b>{formatPrice(PRICE_PER_BOX)}</b>
        </p>

        <figure className="payment__banner">
          <img
            src="/images/lifestyle/encaja-payment-banner.webp"
            alt="Una clienta sonríe al abrir su caja Encaja, con un bowl de salmón y vegetales recién entregado."
            loading="lazy"
          />
          <figcaption>Así llega tu caja: fresca, lista y con tus alergias siempre respetadas.</figcaption>
        </figure>
      </div>

      <div className="payment__panel on-dark">
        {!user ? (
          <AuthForm onSuccess={() => setError(null)} />
        ) : (
          <form className="payment__form" onSubmit={onPay}>
            <p className="payment__account">
              Conectado como <b>{user.name}</b> · {user.email}
            </p>

            <label className="field">
              <span className="field__label">
                <CreditCard /> Nombre en la tarjeta
              </span>
              <input
                className="field__input"
                type="text"
                autoComplete="cc-name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field__label">
                <CreditCard /> Número de tarjeta
              </span>
              <input
                className="field__input"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4111 1111 1111 1111"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </label>

            <div className="payment__form-row">
              <label className="field">
                <span className="field__label">Vencimiento</span>
                <input
                  className="field__input"
                  type="text"
                  placeholder="MM/AA"
                  autoComplete="cc-exp"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                />
              </label>
              <label className="field">
                <span className="field__label">
                  <Lock /> CVV
                </span>
                <input
                  className="field__input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </label>
            </div>

            {error && <p className="auth-form__error">{error}</p>}

            <button type="submit" className="btn btn--primary payment__pay">
              <Check className="btn__arrow" />
              Pagar {formatPrice(PRICE_PER_BOX)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
