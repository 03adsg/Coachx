# COACHX — Codex Autonomous Work Order

## Objective
Work independently on everything that can be completed without secrets, external credentials, production data, or human product decisions.

The current visual source of truth is the Stitch master package supplied to the project. Do not replace Stitch UX/UI with generic fitness-app design.

## Current product rules
- Mobile-first iPhone/PWA.
- Deep black `#050505`.
- Surface `#121212`.
- Fluorescent lime `#B6FF00` used surgically for active/primary/success states.
- Hanken Grotesk visual language as established by Stitch.
- 44px+ touch targets and comfortable one-hand interaction.
- 20px card rounding and established COACHX spacing hierarchy.
- One primary action per screen.
- Supabase is source of truth for persisted user data.
- OpenAI must be server-side only and must never be the source of truth.
- Never expose secrets in client code.

## Work autonomously now
1. Inspect the repository and determine the actual implementation state.
2. If the application scaffold is missing, create the minimum solid Next.js + TypeScript + PWA foundation required by the existing roadmap. Do not over-architect.
3. Establish the COACHX design tokens and reusable UI primitives from the Stitch design system: colors, typography, spacing, radii, buttons, cards, inputs, navigation, loading, empty and error states.
4. Build the iPhone-first app shell and responsive viewport behavior.
5. Build the bottom navigation with exactly the existing four MVP destinations: Today, Calendar, Progress, Profile.
6. Build the routing structure required for the current roadmap, including `/day/[date]`, without inventing additional product behavior.
7. Build static/mock-data versions of the already-designed screens where this can be done without real user data, while keeping data access behind clean interfaces so Supabase can replace mocks later.
8. Implement the Calendar interaction and day navigation using local/mock data only if real Supabase credentials are unavailable.
9. Add PWA manifest, icons/placeholders where needed, installability metadata, viewport configuration and iPhone-safe-area handling.
10. Add reusable exercise, muscle-group, meal, metric and progress components only where they are supported by the existing Stitch screens and roadmap.
11. Add basic client-side validation, loading states, empty states and error states.
12. Add tests for pure utilities and important navigation/data transformations where practical.
13. Add a local development README with exact commands and environment variables required, but do not add or request secrets.
14. Run available lint/typecheck/test/build commands and fix issues that are locally solvable.
15. Keep a concise implementation log in `CODEX_PROGRESS.md` describing what was completed, what is blocked, and the exact next step.

## Do NOT do autonomously
- Do not invent final visual designs that conflict with Stitch.
- Do not proceed into AI-generated routines/diets until the required schemas and safety rules are explicitly established.
- Do not require real Supabase credentials to finish static shell work.
- Do not require real OpenAI credentials to finish static shell work.
- Do not connect Apple Health/Watch without explicit product/API decisions.
- Do not create a coach/admin system yet.
- Do not introduce billing, payments, notifications, analytics or unrelated features.
- Do not fabricate Angie production data.
- Do not commit secrets, `.env` values, API keys or personal health information.
- Do not silently change the product roadmap.

## Stitch fidelity requirement
When a Stitch screen is available, treat it as the visual source of truth. Match its hierarchy, layout, controls, icon treatment, typography, color usage, anatomical visual treatment and interaction model. If a detail cannot be determined from the available Stitch material, choose the smallest neutral implementation and record the uncertainty in `CODEX_PROGRESS.md` instead of inventing a new design system.

## Definition of done for this autonomous pass
- Repository has a runnable iPhone-first foundation or the existing foundation is verified.
- Design tokens/primitives exist and are reusable.
- Four-tab app shell exists.
- Calendar and day routing work with mock/local data without credentials.
- PWA/iPhone viewport basics are implemented.
- Existing Stitch screens can be progressively mapped into the application without rewriting the design language.
- Typecheck/lint/build/tests pass where configured.
- `CODEX_PROGRESS.md` clearly records completed work and blockers.

## Working principle
Make small, coherent changes. Prefer working software over speculative architecture. Do not wait for unavailable credentials when the task can be completed with mocks/interfaces. Stop only when a human decision, secret, external account permission, or missing Stitch specification is genuinely required.
