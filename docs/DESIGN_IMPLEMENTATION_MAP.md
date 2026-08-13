# Design Implementation Map

This map ties the canonical design system to the real repository code.

## Canonical Athlete Loop

`TRAIN -> TRACK -> CHECK-IN -> ADJUST`

## Screen Responsibilities

| Surface | Code path(s) | Status | Responsibility |
| --- | --- | --- | --- |
| Today | `app/page.tsx` | Implemented | Answers "What should I do now?" |
| Calendar | `app/calendar/page.tsx` | Implemented | Answers "What is planned?" |
| Day Detail | `app/day/[date]/page.tsx` | Implemented | Connects the day to workout and nutrition actions. |
| Day Nutrition | `app/day/[date]/nutrition/page.tsx` | Implemented | Day-level nutrition entry point. |
| Workout Overview | `app/workout/[sessionId]/page.tsx` + `components/workout-provider.tsx` | Implemented | Session shell and workout entry. |
| Active Workout | `app/workout/[sessionId]/exercise/[exerciseId]/page.tsx` + `lib/workout-live-state.ts` + `lib/workout-session-service.ts` + `motion/workout.ts` | Live verified | Logs actual sets and preserves workout state truth. |
| Workout Summary | `app/workout/[sessionId]/summary/page.tsx` + `motion/workout.ts` | Live verified | Summarizes the real completed session. |
| Exercise Alternatives | `app/workout/[sessionId]/exercise/[exerciseId]/alternatives/page.tsx` + `lib/workout-data.ts` | Implemented / partial | Offers swaps that preserve movement intent. |
| Exercise Safety | `app/workout/[sessionId]/exercise/[exerciseId]/safety/page.tsx` + subroutes | Implemented | Handles discomfort and safety responses. |
| Nutrition | `app/nutrition/page.tsx` + `components/nutrition-screen.tsx` + `components/nutrition-provider.tsx` + `lib/nutrition-service.ts` | Implemented | Answers "What do I need to eat or complete today?" |
| Progress | `app/progress/page.tsx` + `app/progress/*` + `components/progress-*.tsx` + `lib/progress-*.ts` | Implemented | Answers "How am I progressing?" |
| Check-in | `app/progress/check-in/page.tsx` + `app/progress/check-in/completion/page.tsx` + `components/checkin-flow.tsx` | Implemented | Answers "How am I responding?" |
| Profile / Settings | `app/profile/page.tsx` + `app/profile/preferences/*` + `components/profile-settings-flow.tsx` + `components/profile-settings-provider.tsx` | Implemented | Identity, preferences, account, and locale management. |
| Entry / Auth | `app/entry/page.tsx` + `app/login/page.tsx` + `app/auth/callback/route.ts` + `components/auth-provider.tsx` + `lib/auth/*` | Implemented | Secure entry, session restore, and redirect handling. |
| Identity / Relationship | `lib/auth/identity-resolver.ts` + `lib/auth/session-policy.ts` + `lib/coach/coach-relationship-service.ts` + `app/coach/*` | Secure / certified | Keeps capability and relationship data backend-derived. |
| Design Tokens | `app/globals.css` + `app/layout.tsx` | Canonical | Holds the runtime token and font source. |
| Core Motion | `motion/transitions.ts` + `motion/workout.ts` + `motion/useReducedMotion.ts` | Implemented | Shared motion vocabulary and workout choreography. |

## Slice 23 Next Targets

| Next target | Code path(s) | Status | Notes |
| --- | --- | --- | --- |
| Exercise detail hero and media | `app/exercises/[exerciseId]/page.tsx` | Next | Add only what the canonical design and motion docs require. |
| Exercise media fullscreen | `app/exercises/[exerciseId]/page.tsx` | Next | Keep semantic fallback behavior when media is unavailable. |
| Alternatives preview and replace confirmation | `app/workout/[sessionId]/exercise/[exerciseId]/alternatives/page.tsx` | Next | Preserve actual history vs prescription history. |
| Coach request / change proposal flow | `components/program-change-proposal-panel.tsx` + `app/api/program-change-proposals/*` | Next | Coach intent must remain authorization-free on the client. |
| No-media fallback | `app/exercises/[exerciseId]/page.tsx` | Next | Use a neutral semantic placeholder, not a fake muscle map. |

## Architecture Invariants

### Prescription vs Actual

- Prescription is the planned training or program.
- Actual is what the athlete really performed.
- Replacing a prescription must never rewrite historical actuals.

### Self Managed vs Coach Managed

- Self-managed athletes can perform allowed direct changes.
- Coach-managed athletes log actual performance normally.
- Prescription-changing action becomes `REQUEST CHANGE`, not direct replacement.
- Selecting coach intent does not grant coach authorization.

### Design Constraints

- Keep one primary CTA per screen.
- Keep helper copy muted.
- Keep technical copy out of visible athlete flows.
- Reuse the same primitives across Slice 22 and Slice 23.

## Runtime Status Summary

- `Today`, `Calendar`, `Day Detail`, `Nutrition`, `Progress`, and `Profile` are implemented and live.
- `Workout` live flow is implemented and anchored by the Slice 22 runtime motion and persistence layer.
- `Exercise detail` and `replacement` work are documented as the next slice rather than merged into a second design system.
