# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary persona: Daniela Restrepo, 34, Product Manager at a fintech in Bogotá. 10+ hour days, crossfit 4x/week, orders a box for 2. Her partner has a real shellfish allergy (not a preference). She decides the weekly box in dead moments of the day (waiting for the elevator, between meetings), mostly on mobile. Grid catalogs exhaust her; she ends up accepting the automatic box and feels she overpaid. Responds well to quick-decision mechanics (Tinder, Duolingo) and light gamification.

## Product Purpose
Encaja is its own brand: a weekly subscription box of healthy local food (HelloFresh-type) whose differentiator is personalization. Choosing the 5 weekly recipes becomes a sequence of fast binary micro-decisions (swipe right keep, left discard with automatic replacement), with allergies filtered proactively and visibly before the first card appears. Success: the box is decided in under 5 minutes with absolute certainty that no allergen reaches the table.

## Positioning
Neither HelloFresh (allergens only in small print per recipe) nor Gousto (grid scanning, decision fatigue at scale) turns the catalog into low-cost binary decisions, nor makes the allergy filter a permanent, proactive visual object. Encaja does both.

## Operating Context
Flow: weekly push/email → weekly summary (delivery date, edit-cutoff countdown, default box, "Personalizar mi caja" + guilt-free "Mantener selección automática") → preferences/allergies panel (hard allergy chips vs soft taste chips, live "X de Y recetas disponibles") → narrative loading "Armando tu mazo" → swipe deck (core screen) → 5/5 goal celebration → summary/cart with per-row change, total price → confirmation → success with countdown to next cutoff.

## Capabilities and Constraints
- React 18 + Vite + TypeScript, framer-motion, React Three Fiber (hero 3D box model at public/models/recipe-box.glb), Tailwind v4 (custom CSS must live inside @layer).
- Routes: /, /preferencias, /deck, /resumen, /confirmacion, /sistema (component showroom).
- State and filtering logic in src/state (AppContext, deckLogic) must be preserved; this is a visual redesign.
- 16 recipes (5 core + 11 alternates, headroom so discard-heavy sessions don't run out of the deck before reaching 5 kept), prices in COP, delivery Thursday, edit cutoff Sunday 8 p.m.
- Accessibility is primary, not decorative: large keep/discard buttons as real desktop interaction, keyboard (arrows + Enter), screen reader announcements, "ver detalle" always visible.
- Motion spec from the concept: drag 1:1 with rotation up to ~10° and spring overshoot (~300-400ms); discard exits faster/more rotated than keep (~250ms); live allergy toggle pulses the header and fades invalidated queue cards (~150ms); deck→summary shared-element flight (~600ms). Everything honors prefers-reduced-motion.

## Brand Commitments
- Name: Encaja (own brand; Cosecha no longer appears in UI). Logo to be created as SVG in this redesign.
- Non-negotiable semantic rule: the true red is reserved exclusively for allergen blocking; never used for "discard because I don't like it".
- Voice: neutral Spanish (tú), no voseo. Warm, direct, no guilt.

## Evidence on Hand
- Concept document: ~/Desktop/encaja-prueba-tecnica-uxui.html (benchmark HelloFresh/Gousto, persona, flow, motion spec, risks).
- Recipe photos: public/images/recipes/*.jpg (8). Hero atmosphere photo: public/images/atmosphere/hero-atmosphere.jpg. 3D box: public/models/recipe-box.glb.
- No real customers, testimonials, press, or subscriber numbers exist. Do not fabricate them.

## Product Principles
1. Safety is visible, never a promise in small print.
2. Every decision costs one gesture; nothing forces a long form.
3. Gesture is optional, never required: buttons and keyboard are first-class.
4. Guilt-free exits: keeping the automatic box is a valid choice.
5. Keeping weighs more than discarding.

## Accessibility & Inclusion
WCAG 2.1 AA. Motor accessibility (no gesture-only paths), screen reader announcements for deck actions and allergy blocks, prefers-reduced-motion respected throughout.
