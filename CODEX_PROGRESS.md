# COACHX Codex Progress

## Completed

- Bootstrapped a Next.js App Router + TypeScript foundation.
- Implemented the COACHX shell with mobile-first styling, safe-area handling, bottom navigation, and centralized design tokens.
- Added a GSAP motion layer with reduced-motion support.
- Implemented the core routes: `/`, `/calendar`, `/day/[date]`, `/progress`, and `/profile`.
- Added the Batch A workout foundation: workout overview, active log, alternatives, summary, adjust flows, exercise library/detail, and safety flows.
- Centralized the demo day and workout session so the public screens and workout routes share one fixture state.
- Added agent docs and routing guidance under `.agents/`, `AGENTS.md`, and `AGENT_ROUTING.md`.

## Visual Fidelity Pass

- `Today` — MATCHED TO STITCH
- `Calendar` — MATCHED TO STITCH
- `Day Detail` — MATCHED TO STITCH
- `Progress` — TEMPORARY
- `Profile` — MATCHED TO STITCH
- `Workout Overview` — MATCHED TO STITCH
- `Active Log` — MATCHED TO STITCH
- `Exercise Library` — MATCHED TO STITCH
- `Exercise Detail` — MATCHED TO STITCH
- `Adjust Workout` — MATCHED TO STITCH
- `Safety Flow` — MATCHED TO STITCH
- `Workout Summary` — MATCHED TO STITCH

## Visual corrections made

- Replaced the remote profile portrait with a local placeholder avatar asset so the UI renders reliably offline.
- Tightened mobile spacing and button widths to avoid overlap in the 390px viewport.
- Kept the black/charcoal section rhythm inside the Stitch layout instead of changing page composition.
- Added local favicon and Apple touch icon assets to remove the remaining COACHX 404 for standalone and browser installs.
- Added a semantic workout anatomy path so posterior lower-body work no longer resolves to an anterior torso visual.
- Removed duplicated fixture values by deriving all workout screens from one shared demo session.
- Added a temporary exercise placeholder asset for missing approved imagery.

## GSAP corrections

- Centralized screen and card entrances in `motion/transitions.ts`.
- Scoped transitions through `components/screen.tsx` instead of scattering motion calls.
- Added `prefers-reduced-motion` handling in `motion/useReducedMotion.ts`.
- Extended the shared motion targets to cover the new workout, library, and safety surfaces.

## Responsive corrections

- Preserved safe-area padding for iPhone-style bottom navigation.
- Kept sticky CTAs and the bottom nav aligned to the 390px mobile target.
- Verified no horizontal overflow in the implemented routes during the 390px pass.
- Kept the workout shell and new flows within the same 390px mobile grid as the existing Stitch-backed screens.

## Placeholder assets

- `public/coachx-avatar.svg` is a development placeholder, not final brand photography.
- `public/exercise-placeholder.svg` is a development placeholder, not final exercise imagery.

## Remaining differences

- `/progress` is still a synthesized temporary screen because the Stitch ZIP did not contain a dedicated Progress export or asset set.
- The avatar art is a temporary local placeholder until an approved athlete asset exists.
- The exercise placeholder art remains temporary until approved Stitch assets are available for every movement family.

## Stitch fidelity

- Used `coachx_today`, `coachx_calendar`, `coachx_day_detail`, and `coachx_profile_final_review` as the main visual references.
- Used `coachx_workout_overview` patterns for workout card treatment.
- Used the master `DESIGN.md` for shared color, spacing, and typography rules.
- Used the Batch A Stitch exports for workout overview, active log, alternatives, summary, adjust, exercise library/detail, and safety screens.

## Files changed

- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/calendar/page.tsx`
- `app/day/[date]/page.tsx`
- `app/progress/page.tsx`
- `app/profile/page.tsx`
- `app/exercises/page.tsx`
- `app/exercises/[exerciseId]/page.tsx`
- `app/workout/[sessionId]/page.tsx`
- `app/workout/[sessionId]/exercise/[exerciseId]/page.tsx`
- `app/workout/[sessionId]/exercise/[exerciseId]/alternatives/page.tsx`
- `app/workout/[sessionId]/exercise/[exerciseId]/safety/page.tsx`
- `app/workout/[sessionId]/exercise/[exerciseId]/safety/location/page.tsx`
- `app/workout/[sessionId]/exercise/[exerciseId]/safety/resolution/page.tsx`
- `app/workout/[sessionId]/adjust/page.tsx`
- `app/workout/[sessionId]/adjust/shorter/page.tsx`
- `app/workout/[sessionId]/adjust/reorganize/page.tsx`
- `app/workout/[sessionId]/adjust/updated/page.tsx`
- `app/workout/[sessionId]/summary/page.tsx`
- `components/screen.tsx`
- `components/ui.tsx`
- `lib/coachx-data.ts`
- `lib/workout-data.ts`
- `motion/transitions.ts`
- `motion/useReducedMotion.ts`
- `AGENTS.md`
- `AGENT_ROUTING.md`
- `.agents/frontend-stitch.md`
- `.agents/visual-qa.md`
- `.agents/architecture-typescript.md`
- `.agents/qa-testing.md`
- `README.md`
- `ROADMAP.md`
- `CODEX_AUTONOMOUS_PHASE1.md`
- `docs/COACHX_VISUAL_SYSTEM_UPDATE.md`
- `CODEX_PROGRESS.md`
- `public/manifest.json`
- `public/coachx-icon.svg`
- `public/coachx-avatar.svg`
- `public/favicon.ico`
- `public/apple-touch-icon.png`
- `public/icon.png`
- `public/stitch-assets/hip_thrust.png`
- `public/stitch-assets/romanian_deadlift.png`

## Routes implemented

- `/`
- `/calendar`
- `/day/[date]`
- `/progress`
- `/profile`
- `/exercises`
- `/exercises/[exerciseId]`
- `/workout/[sessionId]`
- `/workout/[sessionId]/exercise/[exerciseId]`
- `/workout/[sessionId]/exercise/[exerciseId]/alternatives`
- `/workout/[sessionId]/exercise/[exerciseId]/safety`
- `/workout/[sessionId]/exercise/[exerciseId]/safety/location`
- `/workout/[sessionId]/exercise/[exerciseId]/safety/resolution`
- `/workout/[sessionId]/adjust`
- `/workout/[sessionId]/adjust/shorter`
- `/workout/[sessionId]/adjust/reorganize`
- `/workout/[sessionId]/adjust/updated`
- `/workout/[sessionId]/summary`

## Components implemented

- `Screen`
- `BottomNav`
- `Card`
- `Section`
- `PrimaryButton`
- `SecondaryButton`
- `IconButton`
- `StatTile`
- `WorkoutShell`

## Mock data

- Centralized in `lib/coachx-data.ts`.
- Uses typed fixtures for today, calendar days, progress metrics, profile sections, and workout movements.
- Keeps the UI independent from production Supabase data.

## Validation

- `pnpm typecheck` via bundled Node: passed.
- `pnpm lint` via bundled Node: passed.
- `pnpm build` via bundled Node: passed.

## Batch A Live QA

- Preview URL: `https://coachx-33007opj6-projectmanagmentnotion-costacleans-projects.vercel.app`
- Flows verified in deployed HTML: `/`, `/calendar`, `/day/2026-08-08`, `/workout/coachx-demo-session`, `/exercises`, exercise detail, adjust flow, summary, and rest-day state.
- Viewport review: a 390px browser render exposed a Today CTA collision; the CTA now flows normally on Today/Day Detail while workout flows keep their sticky action.
- Issues fixed: Today page sticky CTA collision, plus the live preview was redeployed from commit `fda2b20`.
- Remaining temporary assets: `public/coachx-avatar.svg`, `public/exercise-placeholder.svg`, and the provisional `Progress` screen.

## Known differences from Stitch

- The `Progress` screen remains temporary until a dedicated Stitch export is available.
- The avatar art is a temporary local placeholder until an approved athlete asset exists.
- The exercise placeholder art remains temporary until approved Stitch assets are available for every movement family.

## Blockers

- None currently.

## Next autonomous action

- Refine shared primitives only if a newly implemented Stitch screen demands them, or connect the existing data layer to Supabase behind the current interfaces.

## Batch B — Nutrition

### Visual Fidelity Pass

- `Daily Nutrition` — MATCHED TO STITCH
- `Meal Options` — TEMPORARY / PROVISIONAL

### Visual corrections made

- Added a shared nutrition fixture layer so Today, Day Detail, and Nutrition all derive from the same demo day data.
- Implemented the physical `/day/[date]/nutrition` screen from the v2 export structure.
- Kept Meal Options provisional and lightweight, with a confirmable chooser flow instead of a redesigned surface.
- Reused the exported breakfast image locally as a hostable asset instead of relying on a remote dependency.

### GSAP corrections

- Extended the shared screen motion targets to include the nutrition surfaces and chooser.
- Added a restrained nutrition sheet entrance that respects `prefers-reduced-motion`.

### Responsive corrections

- Kept the nutrition shell inside the same iPhone-first 390px layout grid.
- Preserved safe-area-aware spacing for the sticky shell and chooser.
- Kept the nutrition cards and sheet touch targets at mobile-friendly sizes.

### Placeholder assets

- `public/stitch-assets/nutrition-breakfast.png` is a locally hosted export asset for the meal card image.

### Remaining differences

- `Meal Options` remains provisional until Stitch provides a dedicated physical export.
- `/progress` remains temporary.

### Batch B Live QA

- 375px, 390px, and 430px route sweeps showed no horizontal overflow.
- 390px routes tested: `/`, `/calendar`, `/day/2026-08-08`, `/day/2026-08-08/nutrition`, `/progress`, `/profile`.
- `390px` screenshots reviewed for `/day/2026-08-08` and `/day/2026-08-08/nutrition`.
- Local mobile render is clean after the nutrition typography fix.
- Preview deployment URL: `https://coachx-gn2kd2nb7-projectmanagmentnotion-costacleans-projects.vercel.app`
- Live preview is currently gated at `/login` in anonymous/headless browser sessions, so browser-side QA on the hosted preview remains blocked by external access protection.

## Batch C — Progress + Reviews

### Visual Fidelity Pass

- `Measurements Update` â MATCHED TO STITCH
- `Progress Photos` â MATCHED TO STITCH
- `Detailed Trends` â MATCHED TO STITCH
- `Phase Review` â MATCHED TO STITCH
- `Progress` â TEMPORARY / provisional hub only

### Visual corrections made

- Added a centralized progress data/provider layer so measurements, photos, trends, and phase review all share one fixture-backed state.
- Implemented the physical Batch C routes: `/progress/measurements`, `/progress/measurements/success`, `/progress/photos`, `/progress/photos/capture/[pose]`, `/progress/photos/compare`, `/progress/trends`, and `/progress/phase-review`.
- Kept `/progress` as the provisional entry hub and did not redesign it into a false Stitch match.
- Added local placeholder progress-photo SVG assets instead of relying on remote imagery.
- Added the measurement guidance modal, photo preparation guidance, accessible compare slider fallback, and review decision controls.
- Normalized the measurement decimal input so it renders as `72.8` instead of a locale comma variant.
- Fixed a stale localStorage photo asset reference that was producing a 404 on the capture screen.

### GSAP corrections

- Extended the shared motion targets to include the new progress surfaces, comparison cards, and review cards.
- Kept screen entry and card motion restrained and transform-based.
- Preserved reduced-motion handling across the new Batch C surfaces.

### Responsive corrections

- Verified 375px, 390px, and 430px layouts for the Batch C routes.
- Removed the measurement screen overflow caused by the numeric input width.
- Kept the capture, compare, and review flows inside the same iPhone-first shell with safe-area-aware fixed actions.

### Placeholder assets

- `public/progress-photo-front.svg` is a development placeholder.
- `public/progress-photo-side.svg` is a development placeholder.
- `public/progress-photo-back.svg` is a development placeholder.

### Remaining differences

- `/progress` is still provisional because the Stitch ZIP does not contain a dedicated physical export for the main dashboard.
- The progress-photo assets are local placeholders until approved production imagery exists.
- The review photos are fixture-backed mock comparisons, not camera captures.

### Batch C validation

- `pnpm typecheck` via bundled Node: passed.
- `pnpm lint` via bundled Node: passed.
- `pnpm build` via bundled Node: passed.
- 375px, 390px, and 430px browser sweeps: no horizontal overflow and no console errors on the implemented routes.
- 390px screenshots reviewed for `/progress/measurements`, `/progress/measurements/success`, `/progress/photos`, `/progress/photos/capture/front`, `/progress/photos/compare`, `/progress/trends`, and `/progress/phase-review`.


## Batch D ??? Onboarding + Program

### Screens implemented

- `Entry` ??? provisional login / entry flow
- `Onboarding` ??? intro
- `Profile` ??? name, age, height, weight, units
- `Goals` ??? main goal and reorderable priorities
- `Training Experience` ??? experience, confidence, loads, and movement familiarity
- `Training Preferences` ??? weekly structure, duration, equipment, style, and movement preferences
- `Schedule & Lifestyle` ??? work pattern, sleep, energy, hydration, and reminders
- `Health & Limitations` ??? calm private limitation capture with coach review detection
- `Nutrition Preferences` ??? safety-first preference capture with allergy priority preserved
- `Baseline` ??? measurements and optional private progress photo setup
- `Final Review` ??? edit-before-build summary
- `Building Your Plan` ??? deterministic processing state
- `Plan Reveal` ??? proposed phase, structure, and activation CTA
- `Program Overview` ??? active plan summary

### Routes

- `/entry`
- `/onboarding`
- `/onboarding/profile`
- `/onboarding/goals`
- `/onboarding/training-experience`
- `/onboarding/training-preferences`
- `/onboarding/schedule`
- `/onboarding/health`
- `/onboarding/nutrition`
- `/onboarding/baseline`
- `/onboarding/review`
- `/onboarding/building-plan`
- `/onboarding/plan-ready`
- `/program`

### Reused components

- `Screen`
- `Card`
- `PrimaryButton`
- `SecondaryButton`
- `ChoiceButton`
- `PillToggle`
- `OnboardingStepHeader`
- `OnboardingStickyActions`
- `ProgressProvider`
- `OnboardingProvider`

### Data models

- `AthleteProfile`
- `GoalProfile`
- `TrainingExperience`
- `TrainingPreferences`
- `ScheduleLifestyle`
- `HealthLimitations`
- `NutritionPreferences`
- `BaselineState`
- `OnboardingProgress`
- `ProgramState`
- `ProgramRecommendation`

### Conditional logic

- Progression through onboarding preserves state when moving Back or resuming later.
- `coachReviewRequired` becomes true for meaningful limitation language and remains calm/private in the UI.
- Allergy and restriction safety remain above preference and variety.
- `START MY PROGRAM` activates the fixture program state and seeds the progress baseline.
- `ENTRY` routes new users to onboarding, incomplete users to resume, and completed users back to Today.

### Baseline integration

- Onboarding baseline measurements and photos hydrate the existing progress fixture store.
- Baseline photos remain optional and private by default.
- No duplicate baseline architecture was introduced.

### Program activation

- `Plan Reveal` keeps the program in `proposed` state until confirmation.
- `START MY PROGRAM` transitions the fixture program to `active` and routes to Today.
- `Program Overview` reflects the same typed program state.

### Accessibility

- Semantic headings are present on each implemented route.
- Buttons remain real buttons with labels, not gesture-only controls.
- Browser Back / visible Back / iOS edge-back remain coherent where possible.
- Large-text wrapping and 44px touch targets were preserved.

### GSAP

- Reused the centralized motion layer for onboarding and program cards.
- Kept transitions restrained: fade/translate on enter and small card staggers.
- Preserved reduced-motion behavior.

### Viewport QA

- 375px, 390px, and 430px mobile passes were rerun on the onboarding and program routes.
- No horizontal overflow was found on `/`, `/entry`, `/onboarding`, `/onboarding/profile`, `/onboarding/review`, `/onboarding/plan-ready`, or `/program`.

### Remaining gaps

- `Entry` remains provisional because there is no standalone physical Stitch export for welcome/login.
- Production auth is not connected yet.
- `Meal Options` and the main `/progress` dashboard remain provisional from earlier batches.
