---
name: Encaja
description: A weekly box as a die-cut tray of five slots; each recipe is a piece that snaps in, and an allergen piece does not fit.
colors:
  maiz: "#ffd23f"
  maiz-deep: "#f2bd12"
  berenjena: "#2b1638"
  berenjena-2: "#3b2250"
  berenjena-3: "#4d3263"
  teal: "#0e7c6b"
  teal-deep: "#0a5f52"
  lila: "#c9b6ff"
  lila-soft: "#e6dcff"
  carton: "#eee2cc"
  carton-deep: "#d9c7a8"
  allergy: "#d7261e"
  allergy-soft: "#ffd9d4"
  ink-soft: "#5a4868"
  on-dark: "#f7f1ea"
  on-dark-soft: "#cdbfdc"
typography:
  display:
    fontFamily: "Gasoek One, Arial Black, sans-serif"
    fontSize: "clamp(46px, 15.6cqi, 120px)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Gasoek One, Arial Black, sans-serif"
    fontSize: "clamp(40px, 4.8vw, 72px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Gasoek One, Arial Black, sans-serif"
    fontSize: "clamp(28px, 3vw, 38px)"
    fontWeight: 400
    lineHeight: 0.98
  lead:
    fontFamily: "Figtree Variable, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Figtree Variable, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "tnum"
  label:
    fontFamily: "Figtree Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  meter-slot: "3px"
  focus: "8px"
  panel-sm: "18px"
  piece: "22px"
  card: "28px"
  tray: "36px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  container: "1240px"
  chip-gap: "8px"
  stack: "22px"
  section-gap: "48px 64px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.teal-deep}"
  button-dark:
    backgroundColor: "{colors.berenjena}"
    textColor: "{colors.maiz}"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "56px"
  button-dark-hover:
    backgroundColor: "{colors.berenjena-2}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.berenjena}"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "56px"
  deck-keep:
    backgroundColor: "{colors.teal}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 28px 0 22px"
    height: "64px"
  deck-discard:
    backgroundColor: "transparent"
    textColor: "{colors.berenjena}"
    rounded: "{rounded.pill}"
    padding: "0 28px 0 22px"
    height: "64px"
  chip-preference:
    backgroundColor: "rgb(255 255 255 / 0.35)"
    textColor: "{colors.berenjena}"
    rounded: "{rounded.pill}"
    padding: "0 20px 0 15px"
    height: "50px"
  chip-preference-on:
    backgroundColor: "{colors.berenjena}"
    textColor: "{colors.maiz}"
  chip-allergy-on:
    backgroundColor: "{colors.lila-soft}"
    textColor: "{colors.berenjena}"
  allergy-tag:
    backgroundColor: "{colors.allergy}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "5px 12px 5px 8px"
    typography: "{typography.label}"
  box-meter:
    backgroundColor: "{colors.lila}"
    textColor: "{colors.berenjena}"
    rounded: "{rounded.pill}"
    padding: "0 8px 0 16px"
    height: "46px"
  tray-panel:
    backgroundColor: "{colors.berenjena}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.tray}"
    padding: "40px 60px 36px 36px"
  nav:
    backgroundColor: "{colors.maiz}"
    textColor: "{colors.berenjena}"
    height: "76px"
---

# Design System: Encaja

## Overview

**Creative North Star: "The Die-Cut Tray"**

Encaja is a flat maize-yellow field on which aubergine trays hold speckled cardboard pieces. Every recipe is a die-cut piece with a tab on its top and right edges and a notch on its bottom and left, so pieces interlock in a column and in a row. The tray has five slots; an empty slot is a dashed outline of the same silhouette, a kept recipe is the solid piece. Safety is shown as physics: a piece that carries an active allergen is pushed out of its slot, desaturated, and labelled in the system's only red.

The world is loud in form and quiet in colour logic. A chunky heavy lowercase display face carries the voice; a plain humanist sans carries every instruction. Colour is spent by role, not by decoration: teal means act or keep, lilac is the quiet secondary, aubergine is the tray and the ink, red means "this can hurt you" and nothing else. Surfaces are flat colour fields; depth comes only from pieces and trays lifting off them.

Motion is tactile and asymmetric. Lists re-flow on springs, a blocked piece ejects on a long ease-out, keeping weighs more than discarding, and every path has a reduced-motion variant that keeps the information and drops the travel.

**Key Characteristics:**
- Flat maize field (#ffd23f) with aubergine tray panels, some rotated a couple of degrees or skewed at one edge.
- One interlocking piece silhouette, used raster (terrazzo cardboard with a food photo) and vector (dashed slot outline, step tiles, logo isotype).
- Teal is the single action colour; red exists only on allergen labels and the active allergy chip.
- Gasoek One display in lowercase-feeling heavy blocks; Figtree Variable for all UI text.
- Pill-shaped controls, large hit areas (50 to 66px tall), press scale on every control.
- Spring re-layout, 480ms eject, drawn snap bursts, reduced-motion variants throughout.

## Colors

A three-field palette (maize, aubergine, cardboard) with two role accents and one reserved alarm.

### Primary
- **Keep Teal** (#0e7c6b): the only colour for acting and keeping: primary CTA, deck "Guardar" button, keep stamp, the kept-card outline, the completion badge. Hover deepens to **Deep Teal** (#0a5f52). One teal action per view.

### Secondary
- **Quiet Lilac** (#c9b6ff): the secondary voice: the box meter in the nav, the middle step tile, match badges on recipe cards, count units on dark trays, selected-row highlights in the summary. **Soft Lilac** (#e6dcff) is the fill of an active allergy chip.

### Tertiary
- **Allergen Red** (#d7261e): reserved. Allergen tag fill, the ring and icon of an active allergy chip, and the allergen warning line in recipe detail. **Soft Allergen** (#ffd9d4) tints the shield icon on the dark meter badge.

### Neutral
- **Maize Field** (#ffd23f): the page ground, the nav, the first and third step tiles, and the ink colour on aubergine buttons. **Deep Maize** (#f2bd12) is its pressed/darker step.
- **Aubergine** (#2b1638): primary ink on maize, the tray panels, the footer, the dark button, the selected preference chip, focus rings. **Aubergine 2 / 3** (#3b2250, #4d3263) are hover and scrollbar steps on dark.
- **Cardboard** (#eee2cc): the rim of every piece and the band behind the step tiles; **Deep Cardboard** (#d9c7a8) is the piece edge stroke.
- **Soft Ink** (#5a4868): metadata, hints, and blocked recipe names on maize.
- **On-Dark** (#f7f1ea) and **On-Dark Soft** (#cdbfdc): text and quiet text on aubergine; dashed slot strokes on dark use On-Dark at 70%.

### Named Rules
**The Red Means Harm Rule.** Allergen Red appears only where an active allergen blocks a recipe: the allergen tag, the active allergy chip, the allergen warning line. Discarding by taste is neutral (aubergine outline button, aubergine "pass" stamp) and never red.

**The One Teal Rule.** Teal marks the single act-or-keep control in a view. Secondary actions are the aubergine outline, the aubergine solid, or an underlined text link.

## Typography

**Display Font:** Gasoek One (with Arial Black, sans-serif)
**Body Font:** Figtree Variable (with system-ui, sans-serif)

**Character:** A squat, ultra-heavy display that reads like die-cut cardboard lettering, set tight, against a friendly humanist sans that stays out of the way. Numbers are tabular everywhere.

### Hierarchy
- **Display** (400, clamp(46px, 15.6cqi, 120px), 0.9): the home headline only, in two deliberate lines sized to its container.
- **Headline** (400, clamp(40px, 4.8vw, 72px), 0.95; page titles run clamp(44px, 5.6vw, 84px)): section and page titles; balanced wrap, max ~16ch.
- **Title** (400, clamp(28px, 3vw, 38px), 0.98): recipe names on deck cards; 32px for step tile titles. Display-face numerals at 68-72px carry counters and step numbers.
- **Lead** (500, 19px, ~1.25-1.4): intros under headlines, max 40-52ch; the home lead scales to clamp(20px, 2.1vw, 30px).
- **Body** (400, 17px, 1.55): default text, `text-wrap: pretty`.
- **Label** (650-700, 13-15px): chip text, allergen tags, counts, meter figures. Sentence case, no tracking, never uppercase.

### Named Rules
**The Two Voices Rule.** Gasoek One is for headlines, recipe names, and big numerals only; every control, label, and sentence of instruction is Figtree. Display weight stays 400 (the face is already heavy).

## Layout

A single centred container (max 1240px, side padding clamp(16px, 4vw, 40px)). Pages are two-column on desktop (copy left, tray or deck right, e.g. 1.25fr / 0.75fr on the summary, 1fr / 0.9fr on deck completion) with 48-64px gaps, collapsing to one column below ~860-1020px. Home sections alternate full-bleed fields: maize, cardboard band, maize, aubergine, maize, aubergine footer. The hero tray panel bleeds off the right edge on desktop and becomes a full-width panel with a 40px top radius on tablet and below.

Density is low and thumb-first: primary controls 56-66px tall, chips 50px, deck actions 64px, the nav 76px (64px under 760px, where text links hide and the box meter stays). The deck stage is capped at 420px wide; its five-slot progress tray at 640px.

## Elevation & Depth

Surfaces are flat colour fields; depth belongs to objects. Pieces carry a baked drop shadow in their raster, trays lift with one soft long shadow, and the primary button has a tinted teal under-glow. Rotation is part of the depth language: trays sit at -2deg, loose pieces at -13 to 6deg, badges at -4deg.

### Shadow Vocabulary
- **Piece** (`box-shadow: 0 10px 22px -12px rgb(26 13 31 / 0.55)`): resting pieces and small lifted objects.
- **Lift** (`box-shadow: 0 22px 40px -18px rgb(26 13 31 / 0.6)`): aubergine trays (deck completion, home slot board).
- **Teal glow** (`box-shadow: 0 10px 20px -12px rgb(10 95 82 / 0.9)`): the teal button only.
- **Drag** (`filter: drop-shadow(0 18px 18px rgb(26 13 31 / 0.3))`): a deck piece while being dragged.

### Named Rules
**The Objects Lift, Fields Don't Rule.** No shadow on sections, the nav (a 1px aubergine hairline at 12% on inner pages), chips, or text containers. Shadows go under pieces, trays, and the teal action.

## Shapes

One silhouette governs the world: the Encaja piece, a rounded rectangle (corner radius 12% of height) with a tab out on the top and right edges and a notch in on the bottom and left (tab half-width 20% of height, depth 17%, top tab at 68% of width, side tab centred). It is defined once in code (`piecePath` in src/lib/piece.ts) and once in the raster generator (scripts/make-pieces.py), and both must stay identical. It renders as:
- **Raster piece**: cardboard rim (#eee2cc) speckled like terrazzo with dark and white specks, a thin darker edge, the real recipe photo in an inset rounded window. Row (960x315), tile (840x705), and blocked variants; the blocked variant greys the rim and desaturates the photo to 12%.
- **Slot outline**: the same path as a 2.5px dashed stroke (9/8 dash, round caps), light on dark trays, aubergine at 55% on maize.
- **Step tiles and logo**: flat-colour tiles with a 22px radius and a rounded 40x58px tab entering the next tile; the isotype is an aubergine piece with a maize "e".

Everything else is soft and round: pills (999px) for every control, 22px pieces and tiles, 28px cards, 36px trays, 18px detail panels. The one hard edge is the hero tray panel: a 52px top-left radius and a -4deg skew on its left edge.

## Components

### Buttons
Tactile, heavy, pill-shaped.
- **Shape:** full pill (999px), 56px tall (66px in the hero), 650 weight at 19px, arrow icon that nudges 3px right on hover.
- **Primary:** Keep Teal fill, white text, teal glow; hover to Deep Teal.
- **Dark:** Aubergine fill, maize text; hover to Aubergine 2.
- **Ghost:** transparent with a 2px inset aubergine ring; hover fills aubergine at 8%.
- **Press:** scale(0.97) over 140ms ease-out on every button, chip, and meter. Disabled at 45% opacity.
- **Text link:** 600 weight, 2px underline offset 0.25em; used for the guilt-free secondary ("Mantener la caja automática").

### Chips
- **Style:** 50px pill, white at 35% over maize, 2px inset aubergine ring at 35%, 17px/650, 20px leading icon.
- **Preference on:** solid aubergine with maize text, no ring.
- **Allergy on:** Soft Lilac fill with a 3px Allergen Red inset ring and red icon. On the dark hero tray the chip is outline-only (1.5px on-dark-soft ring) until active.

### Cards / Containers
- **Recipe card (deck):** a tile piece with a rotated lilac match badge top-left and, if blocked, a rotated allergen tag top-right; name in Title display, meta in Soft Ink. Kept: 4px teal outline offset 10px. Discarded: 55% opacity.
- **Trays:** aubergine, 36px radius, Lift shadow, rotated -2deg, pieces stacked with descending z-index so each tab overlaps the next notch.
- **Detail panel:** white at 40%, 18px radius, centred text, tags as 1.5px-ringed pills.
- **Summary aside:** Cardboard fill, 28px radius.

### Navigation
Sticky maize bar, 76px, logo 132px wide, text links 16px/550 with a 2px underline that grows from the left (220ms) on hover and stays for the active route. The right side holds the **Box Meter**: a lilac pill with five 10x16px slot glyphs (outlined, fill aubergine when a recipe is kept, lifting 1px), the "n/5" count, and an aubergine badge with a shield icon and the active allergy count.

### Swipe Deck (signature)
A single tile piece on a stage with one rotated ghost card behind it, a five-slot progress tray above that fills with pieces, and two 64px action pills below: "Descartar" (aubergine outline, cross icon) and "Guardar" (teal, heart icon). Drag is 1:1 with rotation mapped to ±14deg over ±260px; display-face stamps fade in (teal "keep" at -10deg, aubergine "pass" at 10deg). Snap-back is an underdamped spring (stiffness 320, damping 16, mass 0.7). Keep exits right in 460ms with 14-18deg; discard exits left faster (300ms) with 24-30deg, so keeping reads heavier. A blocked card refuses with a 380ms horizontal shake. Keyboard arrows and Enter mirror the buttons; reduced motion disables drag and exits by fade.

### Live Filter Column (signature)
The hero tray shows allergy chips, a display-numeral counter ("7 de 8"), and a column of row pieces with names. Toggling an allergy ejects the matching piece: `translate(22%, 5%) rotate(6deg)` over 480ms ease-out, the dashed slot appears behind it, the blocked raster swaps in with the red tag, and a white stroke burst draws itself in 420ms. Lists elsewhere (preferences, summary) re-flow with framer-motion layout springs (0.45s, bounce 0.15). Reduced motion: no transition, the piece shifts 8% sideways only, no burst.

### Icons
Custom inline SVG set on a 24px box, 2.4 stroke, round caps and joins, currentColor. No icon fonts or packages.

## Do's and Don'ts

### Do:
- **Do** build every new recipe surface from the Encaja piece silhouette (`piecePath`), raster for filled, dashed outline for empty.
- **Do** keep teal to the single act-or-keep control per view and hover it to Deep Teal.
- **Do** show an allergen block with all three signals together: displaced or greyed piece, red allergen tag, and text.
- **Do** set headlines and recipe names in Gasoek One at weight 400 and everything interactive in Figtree Variable.
- **Do** give every control a 140ms scale(0.97) press and at least a 50px height.
- **Do** ship a prefers-reduced-motion variant for every spring, eject, burst, and drag (fade or short shift instead of travel).
- **Do** use real recipe photos from public/images/recipes inside pieces; regenerate rasters with scripts/make-pieces.py.

### Don't:
- **Don't** use Allergen Red for discard, errors of taste, prices, or decoration; discard is aubergine.
- **Don't** introduce the category default of green-and-lime healthy branding or a second action colour.
- **Don't** put shadows on flat fields, chips, or the nav; depth is for pieces, trays, and the teal action.
- **Don't** uppercase or letter-space labels; labels are sentence case at 650-700 weight.
- **Don't** change the piece geometry in one place only; src/lib/piece.ts and scripts/make-pieces.py must match.
- **Don't** make any path gesture-only; buttons and keyboard stay first-class.
