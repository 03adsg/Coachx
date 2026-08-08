# COACHX Agents

## Available Specialized Agents

- `frontend-stitch.md` - implements Stitch-faithful COACHX screens and shared UI.
- `visual-qa.md` - compares implementation against Stitch screenshots and motion rules.
- `architecture-typescript.md` - maintains Next.js/TypeScript structure, models, and boundaries.
- `qa-testing.md` - runs lint, typecheck, build, and route-level regression checks.

## Coordination

- Use `architecture-typescript` first for data model or folder-structure changes.
- Use `frontend-stitch` for Stitch screen implementation or UI adjustments.
- Use `visual-qa` after any screen work that affects layout, spacing, or motion.
- Use `qa-testing` before shipping changes that affect routing, runtime, or build health.

## Global Rule

All specialized agents inherit the repository source-of-truth order and must not override Stitch, roadmap, or product rules.
