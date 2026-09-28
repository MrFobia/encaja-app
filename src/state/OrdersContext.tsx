import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface OrderRecipe {
  id: string;
  name: string;
  slug: string;
  minutes: number;
  kcal: number;
  day: number;
}

export interface PaymentMethod {
  brand: string;
  last4: string;
}

export interface Order {
  id: string;
  email: string;
  placedAt: string;
  total: number;
  paymentMethod: PaymentMethod;
  recipes: OrderRecipe[];
  deliveryAddress: string;
  deliveryTimeSlot: string | null;
}

interface OrdersContextValue {
  ordersByEmail: (email: string) => Order[];
  addOrder: (order: Omit<Order, "id" | "placedAt">) => Order;
}

const ORDERS_KEY = "encaja-orders-v1";

function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function makeOrderId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `order-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

/** Historial de pedidos, uno por cuenta. Vive junto al pago simulado: no hay
 *  backend, así que la "confirmación" y el registro del pedido ocurren en el
 *  mismo paso, del lado del cliente. */
export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  useEffect(() => {
    try {
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // sin almacenamiento disponible: el historial no sobrevive al reload
    }
  }, [orders]);

  const ordersByEmail = useCallback(
    (email: string) =>
      orders
        .filter((o) => o.email === email.trim().toLowerCase())
        .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()),
    [orders],
  );

  const addOrder = useCallback((order: Omit<Order, "id" | "placedAt">) => {
    const full: Order = { ...order, id: makeOrderId(), placedAt: new Date().toISOString() };
    setOrders((prev) => [...prev, full]);
    return full;
  }, []);

  return (
    <OrdersContext.Provider value={{ ordersByEmail, addOrder }}>{children}</OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders debe usarse dentro de <OrdersProvider>");
  return ctx;
}
