import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useOrders, type Order } from "../state/OrdersContext";
import { AuthForm } from "../components/AuthForm/AuthForm";
import { Piece } from "../components/Piece/Piece";
import { ArrowRight, Box, CreditCard, MapPin, User } from "../components/Icons";
import { formatPrice, timeSlotLabel, weekdayLabel } from "../lib/format";
import "./Panel.css";

type Tab = "pedidos" | "perfil" | "pagos";

const TABS: { id: Tab; label: string; icon: typeof Box }[] = [
  { id: "pedidos", label: "Pedidos", icon: Box },
  { id: "perfil", label: "Perfil", icon: User },
  { id: "pagos", label: "Pagos", icon: CreditCard },
];

function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}

function PromoBanner() {
  return (
    <div className="promo-banner">
      <img
        className="promo-banner__photo"
        src="/images/lifestyle/encaja-lifestyle-hero.jpg"
        alt="Una clienta sonríe al abrir su caja Encaja recién entregada."
        loading="lazy"
      />
      <div className="promo-banner__copy">
        <h3 className="promo-banner__title">Aún no tienes pedidos.</h3>
        <p className="promo-banner__lead">
          Arma tu primera caja: 5 recetas elegidas por ti, con tus alergias siempre respetadas.
        </p>
        <a href="/" className="btn btn--primary">
          Arma tu cajita
          <ArrowRight className="btn__arrow" />
        </a>
      </div>
    </div>
  );
}

function OrderCard({ order, current }: { order: Order; current?: boolean }) {
  const byDay = [...order.recipes].sort((a, b) => a.day - b.day);
  return (
    <article className={`order-card ${current ? "order-card--current" : ""}`}>
      <header className="order-card__head">
        <div>
          {current && <span className="order-card__badge">Pedido actual</span>}
          <p className="order-card__date">{formatOrderDate(order.placedAt)}</p>
        </div>
        <p className="order-card__total">{formatPrice(order.total)}</p>
      </header>
      <ul className="order-card__pieces" aria-label="Recetas del pedido">
        {byDay.map((r) => (
          <li key={`${order.id}-${r.id}`}>
            <Piece slug={r.slug} shape="tile" />
            <span>{weekdayLabel(r.day)}</span>
            <span className="order-card__piece-name">{r.name}</span>
          </li>
        ))}
      </ul>
      <p className="order-card__method">
        <CreditCard /> {order.paymentMethod.brand} terminada en {order.paymentMethod.last4}
      </p>
      {order.deliveryAddress && (
        <p className="order-card__method">
          <MapPin /> {order.deliveryAddress}
          {order.deliveryTimeSlot && ` · ${timeSlotLabel(order.deliveryTimeSlot)}`}
        </p>
      )}
    </article>
  );
}

function PedidosTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) return <PromoBanner />;
  const [current, ...past] = orders;
  return (
    <div className="panel__pedidos">
      <OrderCard order={current} current />
      {past.length > 0 && (
        <>
          <h3 className="panel__section-title">Pedidos anteriores</h3>
          <div className="panel__past-list">
            {past.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PerfilTab() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  return (
    <div className="panel__perfil">
      <label className="field">
        <span className="field__label">
          <User /> Nombre
        </span>
        <input
          className="field__input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
        />
      </label>
      <label className="field">
        <span className="field__label">Correo</span>
        <input className="field__input" type="email" value={user.email} disabled />
      </label>
      <div className="panel__perfil-actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            updateProfile(name.trim() || user.name);
            setSaved(true);
          }}
        >
          Guardar cambios
        </button>
        {saved && <span className="panel__saved">Guardado.</span>}
      </div>
      <button
        type="button"
        className="text-link"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

function PagosTab({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="panel__empty-note">Todavía no hay pagos registrados en tu cuenta.</p>;
  }
  return (
    <ul className="panel__payments" aria-label="Historial de pagos">
      {orders.map((o) => (
        <li key={o.id} className="payment-row">
          <div className="payment-row__method">
            <CreditCard />
            <span>
              {o.paymentMethod.brand} •••• {o.paymentMethod.last4}
            </span>
          </div>
          <span className="payment-row__date">{formatOrderDate(o.placedAt)}</span>
          <span className="payment-row__items">{o.recipes.map((r) => r.name).join(" · ")}</span>
          <span className="payment-row__total">{formatPrice(o.total)}</span>
        </li>
      ))}
    </ul>
  );
}

export function Panel() {
  const { user } = useAuth();
  const { ordersByEmail } = useOrders();
  const [tab, setTab] = useState<Tab>("pedidos");

  if (!user) {
    return (
      <div className="wrap panel panel--gate">
        <div className="panel__gate-copy">
          <h1 className="panel__title">Tu panel, con tu cuenta.</h1>
          <p className="panel__lead">
            Inicia sesión o crea una cuenta para ver tus pedidos, tu perfil y tus pagos.
          </p>
          <figure className="panel__gate-banner">
            <img
              src="/images/lifestyle/encaja-panel-banner.webp"
              alt="Dos amigos riendo mientras comen sus bowls Encaja en la mesa de la cocina."
              loading="lazy"
            />
            <figcaption>Así se siente tu semana cuando ya no tienes que pensar en qué cocinar.</figcaption>
          </figure>
        </div>
        <div className="panel__gate-auth on-dark">
          <AuthForm onSuccess={() => undefined} />
        </div>
      </div>
    );
  }

  const orders = ordersByEmail(user.email);

  return (
    <div className="wrap panel">
      <h1 className="panel__title">Hola, {user.name.split(" ")[0]}.</h1>
      <p className="panel__lead">Aquí vive todo lo que tiene que ver con tu cuenta y tus cajas.</p>

      <div className="panel__tabs" role="tablist" aria-label="Secciones del panel">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`panel__tab ${tab === id ? "is-active" : ""}`}
            onClick={() => setTab(id)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>

      <div className="panel__body">
        {tab === "pedidos" && <PedidosTab orders={orders} />}
        {tab === "perfil" && <PerfilTab />}
        {tab === "pagos" && <PagosTab orders={orders} />}
      </div>
    </div>
  );
}
