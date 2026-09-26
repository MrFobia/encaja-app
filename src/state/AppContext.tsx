import {
  createContext,
  useCallback,
  useContext,
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

interface AppState {
  allergies: ChipState;
  preferences: ChipState;
  /** ids en orden en que fueron guardados */
  kept: string[];
  /** ids descartados o de tarjetas bloqueadas ya reconocidas/descartadas */
  discarded: string[];
  confirmed: boolean;
}

type Action =
  | { type: "TOGGLE_ALLERGY"; id: string }
  | { type: "TOGGLE_PREFERENCE"; id: string }
  | { type: "KEEP_CURRENT" }
  | { type: "DISCARD_CURRENT" }
  | { type: "SWAP_KEPT"; id: string }
  | { type: "CONFIRM" }
  | { type: "ACCEPT_DEFAULT" }
  | { type: "RESET" };

const initialState: AppState = {
  allergies: initialAllergyState(),
  preferences: initialPreferenceState(),
  kept: [],
  discarded: [],
  confirmed: false,
};

/** Cola visible del mazo: orden fijo, ya decididas fuera, filtradas en vivo
 *  por preferencia blanda. Las bloqueadas por alergia SÍ se muestran (una
 *  vez) en estado bloqueado — transparencia en vez de desaparición muda. */
function visibleQueue(state: AppState): Recipe[] {
  const decided = new Set([...state.kept, ...state.discarded]);
  return DECK_ORDER.map((id) => recipeById(id))
    .filter((r): r is Recipe => Boolean(r))
    .filter((r) => !decided.has(r.id))
    .filter((r) => passesPreferences(r, state.preferences));
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "TOGGLE_ALLERGY":
      return {
        ...state,
        allergies: { ...state.allergies, [action.id]: !state.allergies[action.id] },
      };
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
      if (state.kept.includes(current.id)) return state;
      return { ...state, kept: [...state.kept, current.id] };
    }
    case "DISCARD_CURRENT": {
      const current = visibleQueue(state)[0];
      if (!current) return state;
      if (state.discarded.includes(current.id)) return state;
      return { ...state, discarded: [...state.discarded, current.id] };
    }
    case "SWAP_KEPT": {
      if (!state.kept.includes(action.id)) return state;
      const decided = new Set([...state.kept, ...state.discarded]);
      const replacement = findReplacement(decided, state.allergies, state.preferences);
      if (!replacement) return state;
      return {
        ...state,
        kept: state.kept.map((id) => (id === action.id ? replacement.id : id)),
        discarded: [...state.discarded, action.id],
      };
    }
    case "CONFIRM":
      return { ...state, confirmed: true };
    case "ACCEPT_DEFAULT":
      // "Mantener selección automática": salida sin culpa del resumen semanal,
      // hereda el mazo por defecto sin pasar por el swipe deck.
      return { ...state, kept: [...CORE_RECIPE_IDS], discarded: [] };
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
  swapKept: (id: string) => void;
  confirmOrder: () => void;
  acceptDefaultBox: () => void;
  resetAll: () => void;
  /** Receta visible en el tope del mazo (o undefined si ya no hay). */
  currentRecipe: Recipe | undefined;
  /** Próxima receta en cola, para renderizar la tarjeta "detrás". */
  nextRecipe: Recipe | undefined;
  isCurrentBlocked: boolean;
  blockedAllergens: string[];
  keptRecipes: Recipe[];
  availableCount: number;
  totalCount: number;
  progress: number;
  isComplete: boolean;
  /** true si hay al menos una receta disponible para "Cambiar" en el resumen. */
  hasReplacement: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleAllergy = useCallback((id: string) => dispatch({ type: "TOGGLE_ALLERGY", id }), []);
  const togglePreference = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_PREFERENCE", id }),
    [],
  );
  const keepCurrent = useCallback(() => dispatch({ type: "KEEP_CURRENT" }), []);
  const discardCurrent = useCallback(() => dispatch({ type: "DISCARD_CURRENT" }), []);
  const swapKept = useCallback((id: string) => dispatch({ type: "SWAP_KEPT", id }), []);
  const confirmOrder = useCallback(() => dispatch({ type: "CONFIRM" }), []);
  const acceptDefaultBox = useCallback(() => dispatch({ type: "ACCEPT_DEFAULT" }), []);
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
  const keptRecipes = useMemo(
    () => state.kept.map((id) => recipeById(id)).filter((r): r is Recipe => Boolean(r)),
    [state.kept],
  );
  const hasReplacement = useMemo(() => {
    const decided = new Set([...state.kept, ...state.discarded]);
    return Boolean(findReplacement(decided, state.allergies, state.preferences));
  }, [state.kept, state.discarded, state.allergies, state.preferences]);

  const value: AppContextValue = {
    state,
    toggleAllergy,
    togglePreference,
    keepCurrent,
    discardCurrent,
    swapKept,
    confirmOrder,
    acceptDefaultBox,
    resetAll,
    currentRecipe,
    nextRecipe,
    isCurrentBlocked,
    blockedAllergens,
    keptRecipes,
    availableCount: computeAvailableCount(state.allergies, state.preferences),
    totalCount: DECK_ORDER.length,
    progress: Math.min(state.kept.length / TARGET_KEPT, 1),
    isComplete: state.kept.length >= TARGET_KEPT,
    hasReplacement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState debe usarse dentro de <AppProvider>");
  return ctx;
}
