import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { CORE_RECIPE_IDS, DECK_ORDER, TARGET_KEPT, recipeById } from "../data/recipes";
import type { Recipe } from "../types/recipe";
import {
  availableCount as computeAvailableCount,
  blockingAllergens,
  findReplacement,
  initialAllergyState,
  initialPreferenceState,
  isBlockedByAllergy,
  passesPreferences,
  type ChipState,
} from "./deckLogic";

/** Un hueco físico de la caja. `slotId` identifica el hueco (para key/día);
 *  `recipeId` es lo que hay adentro. Dos huecos pueden compartir `recipeId`
 *  cuando el usuario repite un plato para completar la caja. */
export interface KeptSlot {
  slotId: string;
  recipeId: string;
}

function makeSlotId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `slot-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface AppState {
  allergies: ChipState;
  preferences: ChipState;
  /** huecos en orden en que fueron llenados */
  kept: KeptSlot[];
  /** ids descartados o de tarjetas bloqueadas ya reconocidas/descartadas */
  discarded: string[];
  confirmed: boolean;
  /** Día de la semana (0=lunes..6=domingo) por hueco (slotId), no por receta:
   *  dos huecos con la misma receta repetida pueden tener días distintos. */
  days: Record<string, number>;
  /** Dirección de entrega — se hereda de semana a semana, como alergias. */
  deliveryAddress: string;
  /** Franja horaria de entrega (id de DELIVERY_TIME_SLOTS), o null sin elegir. */
  deliveryTimeSlot: string | null;
}

type Action =
  | { type: "TOGGLE_ALLERGY"; id: string }
  | { type: "TOGGLE_PREFERENCE"; id: string }
  | { type: "KEEP_CURRENT" }
  | { type: "DISCARD_CURRENT" }
  | { type: "SWAP_KEPT"; slotId: string }
  | { type: "REPEAT_RECIPE"; recipeId: string }
  | { type: "SET_DAY"; slotId: string; day: number }
  | { type: "SET_ADDRESS"; address: string }
  | { type: "SET_TIME_SLOT"; slot: string }
  | { type: "CONFIRM" }
  | { type: "ACCEPT_DEFAULT" }
  | { type: "START_NEW_WEEK" }
  | { type: "RESET" };

const initialState: AppState = {
  allergies: initialAllergyState(),
  preferences: initialPreferenceState(),
  kept: [],
  discarded: [],
  confirmed: false,
  days: {},
  deliveryAddress: "",
  deliveryTimeSlot: null,
};

/** Recuerda alergias, decisiones del mazo y confirmación entre visitas: sin
 *  esto, recargar la página "olvidaba" lo ya descartado y lo volvía a
 *  mostrar como si nunca se hubiera decidido. */
const STORAGE_KEY = "encaja-app-state-v1";

function loadPersistedState(): AppState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

/** Cola visible del mazo: orden fijo, ya decididas fuera, filtradas en vivo
 *  por preferencia blanda y por alergia — una receta con tu alérgeno nunca
 *  llega al swipe, no tiene sentido mostrarla si no se puede guardar. */
function visibleQueue(state: AppState): Recipe[] {
  const decided = new Set([...state.kept.map((s) => s.recipeId), ...state.discarded]);
  return DECK_ORDER.map((id) => recipeById(id))
    .filter((r): r is Recipe => Boolean(r))
    .filter((r) => !decided.has(r.id))
    .filter((r) => !isBlockedByAllergy(r, state.allergies))
    .filter((r) => passesPreferences(r, state.preferences));
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "TOGGLE_ALLERGY": {
      const allergies = { ...state.allergies, [action.id]: !state.allergies[action.id] };
      // Activar una alergia debe revalidar lo que ya está en la caja, no solo
      // filtrar el mazo hacia delante: es la garantía de seguridad del
      // producto ("ningún alérgeno llega a la mesa"), no una promesa de
      // letra chica. Una receta ya guardada que ahora choca se saca y, si
      // hay una disponible, se reemplaza automáticamente en su mismo hueco.
      const discarded = [...state.discarded];
      const days = { ...state.days };
      const kept: KeptSlot[] = [];
      for (const slot of state.kept) {
        const recipe = recipeById(slot.recipeId);
        if (recipe && isBlockedByAllergy(recipe, allergies)) {
          discarded.push(slot.recipeId);
          const decided = new Set([
            ...state.kept.map((s) => s.recipeId),
            ...kept.map((s) => s.recipeId),
            ...discarded,
          ]);
          const replacement = findReplacement(decided, allergies, state.preferences);
          if (replacement) {
            kept.push({ slotId: slot.slotId, recipeId: replacement.id });
          } else {
            delete days[slot.slotId];
          }
        } else {
          kept.push(slot);
        }
      }
      return { ...state, allergies, kept, discarded, days };
    }
    case "TOGGLE_PREFERENCE":
      return {
        ...state,
        preferences: { ...state.preferences, [action.id]: !state.preferences[action.id] },
      };
    case "KEEP_CURRENT": {
      const current = visibleQueue(state)[0];
      if (!current) return state;
      if (isBlockedByAllergy(current, state.allergies)) return state;
      if (state.kept.length >= TARGET_KEPT) return state;
      if (state.kept.some((s) => s.recipeId === current.id)) return state;
      // Día por defecto: cicla lunes..viernes en el orden en que se guardan;
      // el usuario lo puede verificar y cambiar en el resumen.
      const slotId = makeSlotId();
      const defaultDay = state.kept.length % 5;
      return {
        ...state,
        kept: [...state.kept, { slotId, recipeId: current.id }],
        days: { ...state.days, [slotId]: defaultDay },
      };
    }
    case "DISCARD_CURRENT": {
      const current = visibleQueue(state)[0];
      if (!current) return state;
      if (state.discarded.includes(current.id)) return state;
      return { ...state, discarded: [...state.discarded, current.id] };
    }
    case "SWAP_KEPT": {
      const slot = state.kept.find((s) => s.slotId === action.slotId);
      if (!slot) return state;
      const decided = new Set([...state.kept.map((s) => s.recipeId), ...state.discarded]);
      const replacement = findReplacement(decided, state.allergies, state.preferences);
      if (!replacement) return state;
      return {
        ...state,
        kept: state.kept.map((s) =>
          s.slotId === action.slotId ? { ...s, recipeId: replacement.id } : s,
        ),
        discarded: [...state.discarded, slot.recipeId],
      };
    }
    case "REPEAT_RECIPE": {
      // Válvula de escape cuando el mazo se agota corto: repetir un plato que
      // ya está en la caja para llenar el hueco que falta. Los platos no se
      // duplican en el mismo hueco; cada repetición ocupa un hueco nuevo.
      if (state.kept.length >= TARGET_KEPT) return state;
      if (!state.kept.some((s) => s.recipeId === action.recipeId)) return state;
      const slotId = makeSlotId();
      const defaultDay = state.kept.length % 5;
      return {
        ...state,
        kept: [...state.kept, { slotId, recipeId: action.recipeId }],
        days: { ...state.days, [slotId]: defaultDay },
      };
    }
    case "SET_DAY":
      if (!state.kept.some((s) => s.slotId === action.slotId)) return state;
      return { ...state, days: { ...state.days, [action.slotId]: action.day } };
    case "SET_ADDRESS":
      return { ...state, deliveryAddress: action.address };
    case "SET_TIME_SLOT":
      return { ...state, deliveryTimeSlot: action.slot };
    case "CONFIRM":
      return { ...state, confirmed: true };
    case "ACCEPT_DEFAULT": {
      // "Mantener selección automática": salida sin culpa del resumen semanal,
      // hereda el mazo por defecto sin pasar por el swipe deck.
      const slots = CORE_RECIPE_IDS.map((id) => ({ slotId: makeSlotId(), recipeId: id }));
      return {
        ...state,
        kept: slots,
        discarded: [],
        days: Object.fromEntries(slots.map((s, i) => [s.slotId, i % 5])),
      };
    }
    case "START_NEW_WEEK":
      // "Empezar otra semana": vacía la caja para volver a elegir, pero
      // conserva alergias y gustos — se heredan de semana a semana (ver
      // copy de Preferences: "Traemos las marcas de la semana pasada").
      // Un RESET total aquí borraría el alérgeno real del hogar. La
      // dirección también se hereda (mismo hogar); el horario se vuelve a
      // elegir porque la disponibilidad cambia semana a semana.
      return {
        ...state,
        kept: [],
        discarded: [],
        confirmed: false,
        days: {},
        deliveryTimeSlot: null,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  toggleAllergy: (id: string) => void;
  togglePreference: (id: string) => void;
  keepCurrent: () => void;
  discardCurrent: () => void;
  swapKept: (slotId: string) => void;
  repeatRecipe: (recipeId: string) => void;
  setDay: (slotId: string, day: number) => void;
  setDeliveryAddress: (address: string) => void;
  setDeliveryTimeSlot: (slot: string) => void;
  confirmOrder: () => void;
  acceptDefaultBox: () => void;
  startNewWeek: () => void;
  resetAll: () => void;
  /** Receta visible en el tope del mazo (o undefined si ya no hay). */
  currentRecipe: Recipe | undefined;
  /** Próxima receta en cola, para renderizar la tarjeta "detrás". */
  nextRecipe: Recipe | undefined;
  isCurrentBlocked: boolean;
  blockedAllergens: string[];
  /** Huecos de la caja con su receta resuelta, en orden. */
  keptSlots: { slotId: string; recipe: Recipe }[];
  keptRecipes: Recipe[];
  availableCount: number;
  totalCount: number;
  progress: number;
  isComplete: boolean;
  /** true si hay al menos una receta disponible para "Cambiar" en el resumen. */
  hasReplacement: boolean;
  /** true si el mazo se agotó sin llegar a 5 y todavía hay huecos por llenar. */
  deckExhausted: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadPersistedState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Almacenamiento no disponible (modo privado, cuota) — la sesión sigue
      // funcionando en memoria, solo no sobrevive a un reload.
    }
  }, [state]);

  const toggleAllergy = useCallback((id: string) => dispatch({ type: "TOGGLE_ALLERGY", id }), []);
  const togglePreference = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_PREFERENCE", id }),
    [],
  );
  const keepCurrent = useCallback(() => dispatch({ type: "KEEP_CURRENT" }), []);
  const discardCurrent = useCallback(() => dispatch({ type: "DISCARD_CURRENT" }), []);
  const swapKept = useCallback((slotId: string) => dispatch({ type: "SWAP_KEPT", slotId }), []);
  const repeatRecipe = useCallback(
    (recipeId: string) => dispatch({ type: "REPEAT_RECIPE", recipeId }),
    [],
  );
  const setDay = useCallback(
    (slotId: string, day: number) => dispatch({ type: "SET_DAY", slotId, day }),
    [],
  );
  const setDeliveryAddress = useCallback(
    (address: string) => dispatch({ type: "SET_ADDRESS", address }),
    [],
  );
  const setDeliveryTimeSlot = useCallback(
    (slot: string) => dispatch({ type: "SET_TIME_SLOT", slot }),
    [],
  );
  const confirmOrder = useCallback(() => dispatch({ type: "CONFIRM" }), []);
  const acceptDefaultBox = useCallback(() => dispatch({ type: "ACCEPT_DEFAULT" }), []);
  const startNewWeek = useCallback(() => dispatch({ type: "START_NEW_WEEK" }), []);
  const resetAll = useCallback(() => dispatch({ type: "RESET" }), []);

  const queue = useMemo(() => visibleQueue(state), [state]);
  const currentRecipe = queue[0];
  const nextRecipe = queue[1];
  const isCurrentBlocked = currentRecipe
    ? isBlockedByAllergy(currentRecipe, state.allergies)
    : false;
  const blockedAllergens = currentRecipe
    ? blockingAllergens(currentRecipe, state.allergies)
    : [];
  const keptSlots = useMemo(
    () =>
      state.kept
        .map((s) => {
          const recipe = recipeById(s.recipeId);
          return recipe ? { slotId: s.slotId, recipe } : null;
        })
        .filter((s): s is { slotId: string; recipe: Recipe } => Boolean(s)),
    [state.kept],
  );
  const keptRecipes = useMemo(() => keptSlots.map((s) => s.recipe), [keptSlots]);
  const hasReplacement = useMemo(() => {
    const decided = new Set([...state.kept.map((s) => s.recipeId), ...state.discarded]);
    return Boolean(findReplacement(decided, state.allergies, state.preferences));
  }, [state.kept, state.discarded, state.allergies, state.preferences]);

  const value: AppContextValue = {
    state,
    toggleAllergy,
    togglePreference,
    keepCurrent,
    discardCurrent,
    swapKept,
    repeatRecipe,
    setDay,
    setDeliveryAddress,
    setDeliveryTimeSlot,
    confirmOrder,
    acceptDefaultBox,
    startNewWeek,
    resetAll,
    currentRecipe,
    nextRecipe,
    isCurrentBlocked,
    blockedAllergens,
    keptSlots,
    keptRecipes,
    availableCount: computeAvailableCount(state.allergies, state.preferences),
    totalCount: DECK_ORDER.length,
    progress: Math.min(state.kept.length / TARGET_KEPT, 1),
    isComplete: state.kept.length >= TARGET_KEPT,
    hasReplacement,
    deckExhausted: state.kept.length < TARGET_KEPT && !currentRecipe,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState debe usarse dentro de <AppProvider>");
  return ctx;
}
