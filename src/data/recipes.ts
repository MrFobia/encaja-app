import type { Recipe } from "../types/recipe";

/**
 * Las 5 recetas "core" son el mazo por defecto (heredado de la semana
 * pasada). Las 3 alternas entran como reemplazo automático cuando el
 * usuario descarta una receta del mazo. Slugs alineados 1:1 con los
 * archivos ya presentes en /public/images/recipes/<slug>.jpg.
 */
export const recipes: Recipe[] = [
  {
    id: "bowl-garbanzos",
    slug: "bowl-garbanzos",
    name: "Bowl de garbanzos con tahini",
    minutes: 25,
    kcal: 480,
    tags: ["Veggie", "Alto en fibra"],
    gradientFrom: "#E8865F",
    gradientTo: "#C9773F",
    allergens: [],
    contains: [],
    dietTags: ["vegetariano"],
    matchPercent: 94,
    isCore: true,
  },
  {
    id: "salmon-teriyaki",
    slug: "salmon-teriyaki",
    name: "Salmón teriyaki",
    minutes: 20,
    kcal: 440,
    tags: ["Alto en prot."],
    gradientFrom: "#4F7A5A",
    gradientTo: "#2F5A3A",
    allergens: [],
    contains: [],
    dietTags: ["bajo-carbohidratos", "alto-proteina"],
    matchPercent: 91,
    isCore: true,
  },
  {
    id: "curry-lentejas",
    slug: "curry-lentejas",
    name: "Curry de lentejas",
    minutes: 28,
    kcal: 460,
    tags: ["Vegetariano", "Reconfortante"],
    gradientFrom: "#D98B1D",
    gradientTo: "#B3720F",
    allergens: [],
    contains: ["cilantro"],
    dietTags: ["vegetariano"],
    matchPercent: 88,
    isCore: true,
  },
  {
    id: "pollo-limon",
    slug: "pollo-limon",
    name: "Pollo al limón",
    minutes: 22,
    kcal: 500,
    tags: ["Alto en prot."],
    gradientFrom: "#8FAE8B",
    gradientTo: "#4F7A5A",
    allergens: [],
    contains: [],
    dietTags: ["bajo-carbohidratos", "alto-proteina"],
    matchPercent: 90,
    isCore: true,
  },
  {
    id: "poke-atun",
    slug: "poke-atun",
    name: "Poke de atún",
    minutes: 15,
    kcal: 420,
    tags: ["Sin gluten", "Alto en prot."],
    gradientFrom: "#1F3A3D",
    gradientTo: "#0F2224",
    allergens: [],
    contains: ["cilantro"],
    dietTags: ["bajo-carbohidratos", "alto-proteina"],
    matchPercent: 93,
    isCore: true,
  },
  {
    id: "pollo-curry",
    slug: "pollo-curry",
    name: "Pollo al curry",
    minutes: 30,
    kcal: 520,
    tags: ["Sin gluten"],
    gradientFrom: "#E8865F",
    gradientTo: "#C9773F",
    allergens: ["lacteos"],
    contains: ["cilantro"],
    dietTags: [],
    matchPercent: 82,
    isCore: false,
  },
  {
    id: "pasta-pesto",
    slug: "pasta-pesto",
    name: "Pasta al pesto",
    minutes: 18,
    kcal: 510,
    tags: ["Vegetariano"],
    gradientFrom: "#E8865F",
    gradientTo: "#C9773F",
    allergens: ["gluten", "frutos-secos"],
    contains: [],
    dietTags: ["vegetariano"],
    matchPercent: 78,
    isCore: false,
  },
  {
    id: "ceviche-mixto",
    slug: "ceviche-mixto",
    name: "Ceviche mixto",
    minutes: 15,
    kcal: 320,
    tags: ["Bajo en carbos"],
    gradientFrom: "#E8865F",
    gradientTo: "#C9773F",
    allergens: ["mariscos"],
    contains: ["cilantro"],
    dietTags: ["bajo-carbohidratos"],
    matchPercent: 85,
    isCore: false,
  },
];

export const CORE_RECIPE_IDS = recipes.filter((r) => r.isCore).map((r) => r.id);
export const ALTERNATE_RECIPE_IDS = recipes
  .filter((r) => !r.isCore)
  .map((r) => r.id);

/** Orden fijo del mazo: 5 recetas core primero, 3 alternas de reemplazo después. */
export const DECK_ORDER = [...CORE_RECIPE_IDS, ...ALTERNATE_RECIPE_IDS];

export const recipeById = (id: string): Recipe | undefined =>
  recipes.find((r) => r.id === id);

export const TARGET_KEPT = 5;
