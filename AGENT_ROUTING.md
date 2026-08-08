# COACHX Agent Routing

## Common Tasks

- `Implement Calendar from Stitch` -> `frontend-stitch` + `visual-qa` + `qa-testing`
- `Audit mobile visual drift` -> `visual-qa`
- `Refactor shared models` -> `architecture-typescript`
- `Fix build errors` -> `qa-testing` + `architecture-typescript` if the failure is structural
- `Add or adjust screen transitions` -> `frontend-stitch` + `visual-qa`

## Collaboration Order

1. `architecture-typescript` verifies boundaries and data contracts.
2. `frontend-stitch` implements or updates the UI.
3. `visual-qa` checks Stitch fidelity and motion.
4. `qa-testing` validates lint, typecheck, and build.

## Not Yet Created

- No Supabase, OpenAI, Apple Health, Apple Watch, analytics, or admin agents for the current phase.
