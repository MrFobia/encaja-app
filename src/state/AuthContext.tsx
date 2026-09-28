import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface AuthUser {
  name: string;
  email: string;
}

interface StoredAccount extends AuthUser {
  password: string;
}

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: AuthUser | null;
  register: (name: string, email: string, password: string) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  updateProfile: (name: string) => void;
}

const ACCOUNTS_KEY = "encaja-auth-accounts-v1";
const SESSION_KEY = "encaja-auth-session-v1";

function loadAccounts(): Record<string, StoredAccount> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredAccount>) : {};
  } catch {
    return {};
  }
}

function loadSession(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Auth simulada: sin backend, cuentas guardadas en localStorage. Suficiente
 *  para el prototipo — nunca tratar `password` aquí como dato seguro real. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Record<string, StoredAccount>>(loadAccounts);
  const [sessionEmail, setSessionEmail] = useState<string | null>(loadSession);

  useEffect(() => {
    try {
      window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch {
      // sin almacenamiento disponible: la sesión sigue en memoria
    }
  }, [accounts]);

  useEffect(() => {
    try {
      if (sessionEmail) window.localStorage.setItem(SESSION_KEY, sessionEmail);
      else window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // sin almacenamiento disponible
    }
  }, [sessionEmail]);

  const register = useCallback(
    (name: string, email: string, password: string): AuthResult => {
      const key = email.trim().toLowerCase();
      if (!name.trim() || !key || password.length < 4) {
        return { ok: false, error: "Completa nombre, correo y una clave de al menos 4 caracteres." };
      }
      if (accounts[key]) {
        return { ok: false, error: "Ya existe una cuenta con ese correo. Inicia sesión." };
      }
      setAccounts((prev) => ({ ...prev, [key]: { name: name.trim(), email: key, password } }));
      setSessionEmail(key);
      return { ok: true };
    },
    [accounts],
  );

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const key = email.trim().toLowerCase();
      const account = accounts[key];
      if (!account || account.password !== password) {
        return { ok: false, error: "Correo o clave incorrectos." };
      }
      setSessionEmail(key);
      return { ok: true };
    },
    [accounts],
  );

  const logout = useCallback(() => setSessionEmail(null), []);

  const updateProfile = useCallback(
    (name: string) => {
      if (!sessionEmail) return;
      setAccounts((prev) =>
        prev[sessionEmail] ? { ...prev, [sessionEmail]: { ...prev[sessionEmail], name } } : prev,
      );
    },
    [sessionEmail],
  );

  const user = useMemo<AuthUser | null>(() => {
    if (!sessionEmail || !accounts[sessionEmail]) return null;
    const { name, email } = accounts[sessionEmail];
    return { name, email };
  }, [sessionEmail, accounts]);

  const value: AuthContextValue = { user, register, login, logout, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
