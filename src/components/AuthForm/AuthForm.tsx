import { useState, type FormEvent } from "react";
import { useAuth } from "../../state/AuthContext";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "../Icons";
import "./AuthForm.css";

export interface AuthFormProps {
  onSuccess: () => void;
}

/** Login/registro simulados en un solo formulario. Vive en el paso de pago y
 *  en la puerta del panel — misma cuenta, dos entradas distintas. */
export function AuthForm({ onSuccess }: AuthFormProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = mode === "login" ? login(email, password) : register(name, email, password);
    if (result.ok) {
      setError(null);
      onSuccess();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form__tabs" role="tablist" aria-label="Iniciar sesión o crear cuenta">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={`auth-form__tab ${mode === "login" ? "is-active" : ""}`}
          onClick={() => {
            setMode("login");
            setError(null);
          }}
        >
          Ya tengo cuenta
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          className={`auth-form__tab ${mode === "register" ? "is-active" : ""}`}
          onClick={() => {
            setMode("register");
            setError(null);
          }}
        >
          Crear cuenta
        </button>
      </div>

      <form className="auth-form__fields" onSubmit={onSubmit}>
        {mode === "register" && (
          <label className="field">
            <span className="field__label">
              <User /> Nombre
            </span>
            <input
              className="field__input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        )}
        <label className="field">
          <span className="field__label">
            <Mail /> Correo
          </span>
          <input
            className="field__input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field__label">
            <Lock /> Clave
          </span>
          <div className="field__input-wrap">
            <input
              className="field__input"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={4}
              required
            />
            <button
              type="button"
              className="field__toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </label>

        {error && <p className="auth-form__error">{error}</p>}

        <button type="submit" className="btn btn--primary auth-form__submit">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          <ArrowRight className="btn__arrow" />
        </button>
      </form>
    </div>
  );
}
