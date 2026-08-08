# COACHX

COACHX is an iPhone-first athlete app built from Stitch references and the repository design rules.

## Current routes

- `/` Today
- `/calendar`
- `/day/[date]`
- `/progress`
- `/profile`

## Stack

- Next.js App Router
- TypeScript
- GSAP motion layer
- Local fixture data

## Run

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Notes

- Stitch is the visual source of truth for implemented screens.
- Mock data is centralized in `lib/coachx-data.ts`.
- Shared motion presets live in `motion/`.
