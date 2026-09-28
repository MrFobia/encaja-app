"""Dibuja el logo de Encaja en SVG.

Wordmark: "encaja" con los contornos de Gasoek One (OFL), apretado a mano, y el
punto de la j reemplazado por una pieza troquelada con pestaña que cae en su
hueco: el nombre hace lo que hace el producto. Isotipo: esa misma pieza con la
"e" calada. Salidas en public/brand/ y el favicon en public/favicon.svg.

Uso: python3 scripts/make-logo.py
"""
from pathlib import Path

from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
import importlib.util
_spec = importlib.util.spec_from_file_location("pieces", Path(__file__).with_name("make-pieces.py"))
pieces = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(pieces)

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "node_modules/@fontsource/gasoek-one/files/gasoek-one-latin-400-normal.woff"
OUT = ROOT / "public/brand"

INK = "#2B1638"      # berenjena
MAIZ = "#FFD23F"     # amarillo maíz
TRACK = 14          # apriete entre letras, en unidades de la fuente


def contours(glyphset, name, dx, baseline):
    """Devuelve cada contorno del glifo como path SVG (y hacia abajo)."""
    rec = RecordingPen()
    glyphset[name].draw(rec)
    parts, current = [], []
    for op, args in rec.value:
        current.append((op, args))
        if op in ("closePath", "endPath"):
            parts.append(current)
            current = []
    out = []
    for part in parts:
        pen = SVGPathPen(glyphset)
        tp = TransformPen(pen, (1, 0, 0, -1, dx, baseline))
        for op, args in part:
            getattr(tp, op)(*args)
        pts = [pt for op, args in part for pt in args if isinstance(pt, tuple)]
        xs = [px + dx for px, _ in pts]
        ys = [baseline - py for _, py in pts]
        out.append((pen.getCommands(), max(py for _, py in pts), (min(xs), min(ys), max(xs), max(ys))))
    return out


def piece(cx, cy, s, rot, fill):
    """Pieza troquelada chica: cuadrado redondeado con pestaña arriba."""
    h = s / 2
    r = s * 0.22
    k = s * 0.2
    t = s * 0.2
    d = (f"M {-h + r} {-h} H {-k} V {-h - t + k * 0.5} "
         f"A {k * 0.5} {k * 0.5} 0 0 1 {-k + k * 0.5} {-h - t} H {k - k * 0.5} "
         f"A {k * 0.5} {k * 0.5} 0 0 1 {k} {-h - t + k * 0.5} V {-h} "
         f"H {h - r} A {r} {r} 0 0 1 {h} {-h + r} V {h - r} A {r} {r} 0 0 1 {h - r} {h} "
         f"H {-h + r} A {r} {r} 0 0 1 {-h} {h - r} V {-h + r} A {r} {r} 0 0 1 {-h + r} {-h} Z")
    return f'<path d="{d}" fill="{fill}" transform="translate({cx:.1f} {cy:.1f}) rotate({rot})"/>'


def wordmark(ink, accent):
    font = TTFont(FONT)
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    asc = font["hhea"].ascent
    x = 0
    paths = []
    tittle = None
    for ch in "encaja":
        name = cmap[ord(ch)]
        cs = contours(gs, name, x, asc)
        if ch == "j":
            # el contorno más alto de la j es su punto: se cambia por la pieza
            cs.sort(key=lambda c: -c[1])
            dot = cs.pop(0)
            x0, y0, x1, y1 = dot[2]
            tittle = ((x0 + x1) / 2, (y0 + y1) / 2, x1 - x0)
        paths += [c[0] for c in cs]
        x += gs[name].width + TRACK
    width = x - TRACK
    cx, cy, size = tittle
    body = "".join(f'<path d="{p}"/>' for p in paths)
    mark = piece(cx, cy - size * 0.42, size * 0.98, 180, accent)
    return width, asc + 260, body, mark, upm


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for label, ink, accent in (("encaja-logo", INK, INK), ("encaja-logo-invertido", MAIZ, MAIZ)):
        w, h, body, mark, _ = wordmark(ink, accent)
        pad = 40
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad - 60} {w + 2 * pad} {h + 2 * pad}" '
               f'role="img" aria-label="Encaja"><g fill="{ink}">{body}</g>{mark}</svg>')
        (OUT / f"{label}.svg").write_text(svg)

    # isotipo: la pieza con la e calada (sirve de favicon)
    font = TTFont(FONT)
    gs = font.getGlyphSet()
    e = contours(gs, font.getBestCmap()[ord("e")], 0, 0)
    ew = gs[font.getBestCmap()[ord("e")]].width
    e_path = "".join(c[0] for c in e)
    x0 = min(c[2][0] for c in e); y0 = min(c[2][1] for c in e)
    x1 = max(c[2][2] for c in e); y1 = max(c[2][3] for c in e)
    sc = 430 / (x1 - x0)
    tx, ty = 410 - (x0 + x1) / 2 * sc, 360 - (y0 + y1) / 2 * sc
    iso = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -230 1220 1160" role="img" aria-label="Encaja">'
           f'<path d="{pieces.piece_path(900, 820, 190, 170, 150)}" fill="{INK}"/>'
           f'<g transform="translate({tx:.0f} {ty:.0f}) scale({sc:.3f})" fill="{MAIZ}"><path d="{e_path}"/></g></svg>')
    (OUT / "encaja-isotipo.svg").write_text(iso)
    (ROOT / "public/favicon.svg").write_text(iso)
    print("ok")


if __name__ == "__main__":
    main()
