# COACHX Visual System Update — Charcoal / Black Rhythm

## New visual rule

COACHX keeps its established visual identity but now adds a **Charcoal** surface/background family to create controlled alternation between sections.

### Core palette

- Deep Black: `#050505` — primary app background, immersive workout mode, high-focus states.
- Charcoal: `#1A1A1A` — secondary background/section field used to create visual rhythm and separation.
- Surface: `#121212` — cards, inputs, elevated controls and compact content surfaces.
- Fluorescent Lime: `#B6FF00` — primary action, active state, progression, selected muscle and key emphasis only.
- Primary text: white.
- Secondary text: muted gray.

## Alternating section rhythm

Do not make every screen a flat black canvas and do not turn the UI into a striped black/charcoal pattern.

Use black and charcoal as **large visual zones** that alternate naturally between meaningful sections. The rhythm should feel intentional and premium:

- Hero / primary focus → Deep Black.
- Secondary information block → Charcoal.
- Dense interactive content → Deep Black or Surface cards.
- Supporting/context section → Charcoal where useful.
- Return to Deep Black for important CTA or high-focus action.

The transition between colors should happen at section boundaries, not behind every individual card.

## UX intent

The purpose is to add subtle visual movement and prevent long screens from feeling monotonous while preserving the minimalist iPhone-first aesthetic.

Avoid gradients, decorative color noise, excessive shadows, or arbitrary color changes.

Charcoal is a structural design token, not a decorative accent.

## Stitch fidelity

Stitch remains the visual source of truth. Existing Stitch screens must not be generically redesigned. When implementing existing screens, preserve their established hierarchy and only introduce Charcoal where it improves section separation without changing the composition.

## Codex implementation rule

Codex should centralize these values as design tokens and reusable section/surface primitives. Do not hardcode alternate background colors repeatedly across pages.

This update is additive: it does not replace the existing COACHX black/lime system.
