import type { CSSProperties } from "react";
import { piecePath, pieceSrc } from "../../lib/piece";
import "./Piece.css";

export interface PieceProps {
  slug: string;
  /** "row": pieza horizontal (columna, resumen). "tile": loseta casi cuadrada (deck). */
  shape?: "row" | "tile";
  blocked?: boolean;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}

/**
 * Pieza troquelada de receta. La caja del elemento es el cuerpo de la pieza;
 * la imagen desborda por las pestañas y la sombra, así dos piezas contiguas
 * encajan pestaña con muesca sin cálculo extra.
 */
export function Piece({ slug, shape = "row", blocked = false, className = "", style, eager }: PieceProps) {
  return (
    <div className={`piece piece--${shape} ${className}`.trim()} style={style}>
      <img
        className="piece__img"
        src={pieceSrc(slug, blocked ? "blocked" : shape === "tile" ? "tile" : "row")}
        alt=""
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}

/** Hueco vacío: el contorno de la pieza en línea punteada. */
export function SlotOutline({
  className = "",
  tone = "light",
  shape = "row",
}: {
  className?: string;
  tone?: "light" | "dark";
  shape?: "row" | "tile";
}) {
  const [w, h] = shape === "row" ? [960, 315] : [840, 705];
  const pad = 70;
  return (
    <div className={`piece piece--${shape} slot-outline slot-outline--${tone} ${className}`.trim()} aria-hidden="true">
      <svg
        className="slot-outline__svg"
        viewBox={`${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`}
        style={{ left: `${(-pad / w) * 100}%`, top: `${(-pad / h) * 100}%`, width: `${((w + 2 * pad) / w) * 100}%`, height: `${((h + 2 * pad) / h) * 100}%` }}
      >
        <path d={piecePath(w, h)} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
