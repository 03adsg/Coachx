# COACHX Agent Routing

## Common Tasks

- `Implement Calendar from Stitch` -> `frontend-stitch` + `visual-qa` + `qa-testing`
- `Audit mobile visual drift` -> `visual-qa`
- `Refactor shared models` -> `architecture-typescript`
- `Fix build errors` -> `qa-testing` + `architecture-typescript` if the failure is structural
- `Add or adjust screen transitions` -> `frontend-stitch` + `visual-qa`
- `Design feedback / confirmations / undo` -> `feedback-interaction-ux` + `frontend-stitch`
- `Auth / session / recovery UX` -> `auth-security-ux` + `architecture-typescript` + `frontend-stitch` + `qa-testing`
- `Performance analytics / motion visualization` -> `data-visualization-motion` + `frontend-stitch` + `visual-qa` + `qa-testing`
- `Immersive progress / achievements` -> `motivational-immersion-ux` + `frontend-stitch` + `visual-qa` + `qa-testing`

## Collaboration Order

1. `architecture-typescript` verifies boundaries and data contracts.
2. `frontend-stitch` implements or updates the UI.
3. `visual-qa` checks Stitch fidelity and motion.
4. `qa-testing` validates lint, typecheck, and build.

## Not Yet Created

- No Supabase, OpenAI, Apple Health, Apple Watch, or admin agents for the current phase.
- Feedback/interaction memory work routes to `feedback-interaction-ux`.
- Immersive progress and achievement work routes to `motivational-immersion-ux`.
- Auth security and session UX work routes to `auth-security-ux`.
