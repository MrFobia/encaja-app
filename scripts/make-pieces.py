"""Genera las piezas troqueladas de Encaja a partir de las fotos reales de recetas.

Cada pieza es cartón moteado con muescas (pestaña arriba y a la derecha, muesca
abajo y a la izquierda: así una pieza encaja con la siguiente en columna y en
fila) y la foto de la receta embutida. Se escribe SVG y se rasteriza con
rsvg-convert. La geometría es la misma que src/lib/piece.ts dibuja en código.

Uso: python3 scripts/make-pieces.py
"""
import base64
import random
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "public/images/recipes"
OUT = ROOT / "public/images/pieces"
PLATES = ROOT / "assets/plates"

RIM = "#EEE2CC"
RIM_EDGE = "#D9C7A8"
SPECKS = ["#2A1C17", "#3B2A22", "#6B5443", "#8C7358", "#A38B6E", "#FFFFFF"]


def piece_path(w, h, r, k, t, knob_x=0.68, side_y=0.5):
    """Contorno de la pieza. k = semiancho de la pestaña, t = su alto."""
    c = min(k * 0.55, t * 0.9)
    cx = w * knob_x
    cy = h * side_y
    d = [f"M {r} 0"]
    # arriba: pestaña hacia afuera
    d += [f"H {cx - k}", f"V {-t + c}", f"A {c} {c} 0 0 1 {cx - k + c} {-t}",
          f"H {cx + k - c}", f"A {c} {c} 0 0 1 {cx + k} {-t + c}", "V 0"]
    d += [f"H {w - r}", f"A {r} {r} 0 0 1 {w} {r}"]
    # derecha: pestaña hacia afuera
    d += [f"V {cy - k}", f"H {w + t - c}", f"A {c} {c} 0 0 1 {w + t} {cy - k + c}",
          f"V {cy + k - c}", f"A {c} {c} 0 0 1 {w + t - c} {cy + k}", f"H {w}"]
    d += [f"V {h - r}", f"A {r} {r} 0 0 1 {w - r} {h}"]
    # abajo: muesca hacia adentro (recibe la pestaña de la pieza siguiente)
    d += [f"H {cx + k}", f"V {h - t + c}", f"A {c} {c} 0 0 0 {cx + k - c} {h - t}",
          f"H {cx - k + c}", f"A {c} {c} 0 0 0 {cx - k} {h - t + c}", f"V {h}"]
    d += [f"H {r}", f"A {r} {r} 0 0 1 0 {h - r}"]
    # izquierda: muesca hacia adentro
    d += [f"V {cy + k}", f"H {t - c}", f"A {c} {c} 0 0 0 {t} {cy + k - c}",
          f"V {cy - k + c}", f"A {c} {c} 0 0 0 {t - c} {cy - k}", "H 0"]
    d += [f"V {r}", f"A {r} {r} 0 0 1 {r} 0", "Z"]
    return " ".join(d)


def piece_svg(photo, w, h, *, blocked=False, rotate=0.0, seed=1):
    rng = random.Random(seed)
    r, k, t = h * 0.12, h * 0.2, h * 0.17
    m = h * 0.12  # borde de terrazo alrededor de la foto
    pad = t + 40
    W, H = w + 2 * pad, h + 2 * pad
    img = base64.b64encode(photo.read_bytes()).decode()
    specks = "".join(
        f'<circle cx="{rng.uniform(-t, w + t):.1f}" cy="{rng.uniform(-t, h + t):.1f}" '
        f'r="{rng.choice([0.9, 1.3, 1.8, 2.6, 3.4]):.1f}" fill="{rng.choice(SPECKS)}" '
        f'opacity="{rng.uniform(0.35, 0.8):.2f}"/>'
        for _ in range(int(w * h / 180))
    )
    photo_filter = 'filter="url(#mute)"' if blocked else ""
    rim = "#CFC6BD" if blocked else RIM
    return f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{W}" height="{H}" viewBox="{-pad} {-pad} {W} {H}">
<defs>
  <clipPath id="shape"><path d="{piece_path(w, h, r, k, t)}"/></clipPath>
  <clipPath id="win"><rect x="{m}" y="{m}" width="{w - 2 * m}" height="{h - 2 * m}" rx="{r * 0.7}"/></clipPath>
  <mask id="rimonly" maskUnits="userSpaceOnUse" x="{-pad}" y="{-pad}" width="{W}" height="{H}"><path d="{piece_path(w, h, r, k, t)}" fill="#fff"/><rect x="{m}" y="{m}" width="{w - 2 * m}" height="{h - 2 * m}" rx="{r * 0.7}" fill="#000"/></mask>
  <filter id="drop" x="-20%" y="-20%" width="140%" height="160%">
    <feDropShadow dx="0" dy="{h * 0.03:.1f}" stdDeviation="{h * 0.035:.1f}" flood-color="#1A0D1F" flood-opacity="0.45"/>
  </filter>
  <filter id="mute"><feColorMatrix type="saturate" values="0.12"/><feComponentTransfer><feFuncR type="linear" slope="0.8" intercept="0.08"/><feFuncG type="linear" slope="0.8" intercept="0.08"/><feFuncB type="linear" slope="0.8" intercept="0.1"/></feComponentTransfer></filter>
</defs>
<g transform="rotate({rotate} {w / 2} {h / 2})">
  <g filter="url(#drop)"><path d="{piece_path(w, h, r, k, t)}" fill="{rim}"/></g>
  <path d="{piece_path(w, h, r, k, t)}" fill="none" stroke="{RIM_EDGE}" stroke-width="{h * 0.012:.1f}"/>
  <g clip-path="url(#shape)"><rect x="{m - 2}" y="{m - 2}" width="{w - 2 * m + 4}" height="{h - 2 * m + 4}" rx="{r * 0.7 + 2}" fill="#8A7458" opacity="0.55"/>
  <g clip-path="url(#win)"><image xlink:href="data:image/jpeg;base64,{img}" x="{m}" y="{m - (w - 2 * m - (h - 2 * m)) / 2}" width="{w - 2 * m}" height="{w - 2 * m}" preserveAspectRatio="xMidYMid slice" {photo_filter}/></g></g>
  <g clip-path="url(#shape)"><path d="{piece_path(w, h, r, k, t)}" fill="none" stroke="{rim}" stroke-width="{m * 1.6:.1f}"/></g>
  <g clip-path="url(#shape)"><g mask="url(#rimonly)">{specks}</g>
    <path d="{piece_path(w, h, r, k, t)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="{h * 0.03:.1f}" transform="translate({-h * 0.012:.1f} {-h * 0.012:.1f})"/>
    <path d="{piece_path(w, h, r, k, t)}" fill="none" stroke="#6B5443" stroke-opacity="0.45" stroke-width="{h * 0.03:.1f}" transform="translate({h * 0.014:.1f} {h * 0.014:.1f})"/>
  </g>
  <path d="{piece_path(w, h, r, k, t)}" fill="none" stroke="{RIM_EDGE}" stroke-width="{h * 0.012:.1f}"/>
</g>
</svg>"""


def render(svg, out):
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_suffix(".svg")
    tmp.write_text(svg)
    subprocess.run(["rsvg-convert", str(tmp), "-o", str(out)], check=True)
    tmp.unlink()
    if out.parent == OUT:
        # la web sirve WebP: ~8 veces más liviano que el PNG con alfa
        subprocess.run(["cwebp", "-quiet", "-q", "84", "-alpha_q", "90", str(out), "-o", str(out.with_suffix(".webp"))], check=True)
        out.unlink()


def main():
    slugs = sorted(p.stem for p in PHOTOS.glob("*.jpg"))
    for i, slug in enumerate(slugs):
        photo = PHOTOS / f"{slug}.jpg"
        # pieza horizontal (columna del hero, deck, resumen)
        render(piece_svg(photo, 960, 315, seed=i + 1), OUT / f"{slug}.png")
        # variante bloqueada por alérgeno
        render(piece_svg(photo, 960, 315, blocked=True, seed=i + 1), OUT / f"{slug}-bloqueada.png")
        # loseta casi cuadrada (pieza suelta, tarjeta del deck)
        render(piece_svg(photo, 840, 705, seed=i + 11), OUT / f"{slug}-loseta.png")
    # plates del comp aprobado
    render(piece_svg(PHOTOS / "bowl-garbanzos.jpg", 840, 705, rotate=-14, seed=31), PLATES / "bowl-piece.png")
    render(piece_svg(PHOTOS / "ceviche-mixto.jpg", 960, 315, blocked=True, rotate=9, seed=32), PLATES / "piece-blocked.png")
    print("ok", len(slugs), "recetas")


if __name__ == "__main__":
    main()
