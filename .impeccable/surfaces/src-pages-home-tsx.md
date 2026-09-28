---
version: 1
slug: "src-pages-home-tsx"
primary_target: "src/pages/Home.tsx"
related_targets: ["src/pages/Deck.tsx","src/pages/Preferences.tsx","src/pages/Summary.tsx","src/pages/Confirmation.tsx"]
---

# Surface brief · Home (/) and the Encaja app flow

Scope: home landing (Persuade) plus the app flow /preferencias, /deck, /resumen, /confirmacion (Operate), all in one world.
Audience: Daniela, Bogotá PM deciding the weekly box in dead moments, mostly mobile. Action: "Arma tu caja" (→ /preferencias); guilt-free "Mantener la caja automática" (→ /resumen).
Approved comp: .impeccable/mocks/comp-c.png (C · Filtro vivo). Decision comp: .impeccable/mocks/decision/assigned.png.

## Direction contract

THESIS: The box is a die-cut tray of 5 interlocking slots; each recipe is a piece that snaps in, and a piece with an active allergen physically does not fit. Refuses the category default of green-and-lime healthy branding with a bowl photo and three feature icons.

OWN-WORLD: Flat maize-yellow field, aubergine tray panels, pieces as speckled die-cut card with tabs and notches holding real food photos; empty slot = dashed outline, kept piece = solid; deep teal is the only "act/keep" colour, lilac the quiet secondary; the true red exists only on allergen labels and the active allergy chip. Chunky heavy lowercase display, plain humanist UI sans.

STORY: The visitor sees the filter already working (chips, "7 de 8 recetas disponibles", the shellfish piece pushed out), understands that safety happens before choosing, and acts on "Arma tu caja".

FIRST VIEWPORT: Left ~55%: nav, two-line headline "Tu semana, encajada." at display scale, subline, teal pill CTA, text link, one loose bowl piece. Right ~45%: aubergine panel angled at its top-left corner with 4 allergy chips, the counter, a column of 5 interlocking recipe pieces with names, the 4th (Ceviche mixto) displaced out with the red "Contiene mariscos" label. Bottom edge: three interlocking step tiles (Alergias, Swipe, Resumen) peeking in.

FORM: Encaje modular, candidate 7 of 7 on the grounded list (literal reading made functional), seed 6d6f3ee8. Raises: dashed/solid cut state and matching notches (sewing pattern); single red as centre of gravity (neon night); fixed box instrument with trend (six-pack); each placement displaces neighbours (ebru).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Notes
- Comp copy fixes at build: "Confirmá" → "Confirma" (no voseo); recipe names come from src/data/recipes.ts, never the comp's invented ones.
- Signature interaction: live allergy toggle on the hero panel re-filters the column (pieces displace, blocked piece slides out with red label, counter ticks).
