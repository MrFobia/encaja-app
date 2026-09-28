/**
 * Geometría de la pieza troquelada de Encaja: pestaña arriba y a la derecha,
 * muesca abajo y a la izquierda, así una pieza encaja con la siguiente en
 * columna y en fila. Es la misma que scripts/make-pieces.py usa para las
 * piezas rasterizadas; aquí se dibuja en código (huecos punteados, marcos).
 */
export function piecePath(
  w: number,
  h: number,
  r = h * 0.12,
  k = h * 0.2,
  t = h * 0.17,
  knobX = 0.68,
  sideY = 0.5,
): string {
  const c = Math.min(k * 0.55, t * 0.9);
  const cx = w * knobX;
  const cy = h * sideY;
  return [
    `M ${r} 0`,
    `H ${cx - k} V ${-t + c} A ${c} ${c} 0 0 1 ${cx - k + c} ${-t}`,
    `H ${cx + k - c} A ${c} ${c} 0 0 1 ${cx + k} ${-t + c} V 0`,
    `H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r}`,
    `V ${cy - k} H ${w + t - c} A ${c} ${c} 0 0 1 ${w + t} ${cy - k + c}`,
    `V ${cy + k - c} A ${c} ${c} 0 0 1 ${w + t - c} ${cy + k} H ${w}`,
    `V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `H ${cx + k} V ${h - t + c} A ${c} ${c} 0 0 0 ${cx + k - c} ${h - t}`,
    `H ${cx - k + c} A ${c} ${c} 0 0 0 ${cx - k} ${h - t + c} V ${h}`,
    `H ${r} A ${r} ${r} 0 0 1 0 ${h - r}`,
    `V ${cy + k} H ${t - c} A ${c} ${c} 0 0 0 ${t} ${cy + k - c}`,
    `V ${cy - k + c} A ${c} ${c} 0 0 0 ${t - c} ${cy - k} H 0`,
    `V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`,
  ].join(" ");
}

/** Proporción de las piezas rasterizadas (public/images/pieces): 960×315 más
 *  el margen de pestañas y sombra que agrega el script. */
export const PIECE_PNG = { w: 1148, h: 503, bodyW: 960, bodyH: 315 } as const;

export const pieceSrc = (slug: string, variant: "row" | "blocked" | "tile" = "row") =>
  `/images/pieces/${slug}${variant === "blocked" ? "-bloqueada" : variant === "tile" ? "-loseta" : ""}.webp`;
