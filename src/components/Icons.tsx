/** Íconos de Encaja: trazo de 2.4 sobre caja de 24, puntas redondas. */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Base>
);

export const Cross = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);

export const Heart = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />
  </Base>
);

export const Check = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Base>
);

export const Plus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

/** Escudo: alergia activa (protección). */
export const Shield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6l7-3z" />
    <path d="M8.8 12l2.2 2.2 4.2-4.4" />
  </Base>
);

/** Prohibido: contiene alérgeno. */
export const NoEntry = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M6 6l12 12" />
  </Base>
);

export const Box = (p: IconProps) => (
  <Base {...p}>
    <path d="M3.5 8L12 4l8.5 4v8L12 20l-8.5-4V8z" />
    <path d="M3.5 8L12 12l8.5-4M12 12v8" />
  </Base>
);

export const Calendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="3" />
    <path d="M8 3.5v4M16 3.5v4M4 10.5h16" />
  </Base>
);

export const Clock = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
);

export const Zap = (p: IconProps) => (
  <Base {...p}>
    <path d="M12.5 3L5 13.5h5.5L11 21l7.5-10.5H13L12.5 3z" strokeLinejoin="round" />
  </Base>
);

export const Undo = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 8H14.5a5 5 0 0 1 0 10H9M8 8l3.5-3.5M8 8l3.5 3.5" />
  </Base>
);

/* Alérgenos, tachados: se muestran en el chip inactivo ("sin …"). */
const Slash = () => <path d="M4 4l16 16" />;

export const NoShellfish = (p: IconProps) => (
  <Base {...p}>
    <path d="M17 7.5c-3.6-2-8.8-.6-10.5 3.2-1.2 2.7.4 5.8 3.3 6.3l1.2-2.6M9.5 9.8l2.6 1.6M8 13l3 .9" />
    <path d="M17 7.5l2.5-2M17 7.5l2.8.8" />
    <Slash />
  </Base>
);

export const NoWheat = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21V8M12 8c0-2.2 1.3-3.8 3-4.5-.2 2.3-1.3 3.8-3 4.5zM12 8c0-2.2-1.3-3.8-3-4.5.2 2.3 1.3 3.8 3 4.5zM12 13.5c1.6-1.9 3.6-2.4 5-2-.9 1.8-2.9 2.5-5 2zM12 13.5c-1.6-1.9-3.6-2.4-5-2 .9 1.8 2.9 2.5 5 2z" />
    <Slash />
  </Base>
);

export const NoMilk = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 3.5h6M9.5 3.5v3L7.5 9.5v10a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5v-10L14.5 6.5v-3M7.5 12.5h9" />
    <Slash />
  </Base>
);

export const NoNut = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4c3.8 0 6.5 3.3 6.5 7.6 0 4.6-2.9 8.4-6.5 8.4s-6.5-3.8-6.5-8.4C5.5 7.3 8.2 4 12 4zM12 4v2.5M9 11h6" />
    <Slash />
  </Base>
);

export const User = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.4-3.8 4.4-5.8 7.5-5.8s6.1 2 7.5 5.8" />
  </Base>
);

export const Lock = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="3" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </Base>
);

export const Mail = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="3" />
    <path d="M4.5 7l7.5 6 7.5-6" />
  </Base>
);

export const CreditCard = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="6" width="18" height="12.5" rx="3" />
    <path d="M3 10h18M6.5 14.5h4" />
  </Base>
);

export const Eye = (p: IconProps) => (
  <Base {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </Base>
);

export const EyeOff = (p: IconProps) => (
  <Base {...p}>
    <path d="M2.5 12S6 5.5 12 5.5c1.9 0 3.5.5 4.9 1.3M21.5 12S19.8 15 16.6 17M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="M4 4l16 16" />
  </Base>
);

export const MapPin = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.6" />
  </Base>
);

export const ALLERGEN_ICONS: Record<string, (p: IconProps) => JSX.Element> = {
  mariscos: NoShellfish,
  gluten: NoWheat,
  lacteos: NoMilk,
  "frutos-secos": NoNut,
};
