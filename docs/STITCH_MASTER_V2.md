# COACHX — Stitch Master v2

Status: **athlete-side MVP design frozen for implementation** as of 2026-08-08.

Canonical package at repository root:

`/COACHX_STITCH_MASTER_v2.zip`

The previous `/COACHX_STITCH_MASTER.zip` is legacy reference only. New implementation work must use v2.

## Physical export inventory

The v2 package contains **51 physical Stitch screen directories**.

Each physical screen keeps its supplied `code.html`; screenshots are preserved as exported.

- Valid screenshots: **43**
- Stitch screenshot placeholders/fetch failures: **8**

When a screenshot is a placeholder, use the matching physical `code.html` as the supplied Stitch reference and document the limitation.

## Source-of-truth order

1. Matching `screen.png` when valid.
2. Matching `code.html` for that exact Stitch frame.
3. `DESIGN.md` inside the v2 package for shared product/design rules.
4. `SCREEN_INDEX.md` for frame → flow → suggested route/state mapping.
5. `EXPORT_GAPS.md` for known flows that still lack a standalone physical export.
6. Existing repository product/architecture rules.

Do not reinterpret a physical Stitch frame into a generic fitness UI.

## Important export gaps

The following known athlete-MVP experiences do not have a standalone physical `code.html + screen.png` directory in v2:

- Welcome / Login
- Meal Options / equivalent-meal chooser
- Progress main dashboard
- Weekly Check-in
- Check-in Completion & Insights
- Profile & Settings main screen

Existing/provisional implementations may remain, but they must not be labelled `MATCHED TO STITCH` until a physical export exists.

## Definitive visual rules

- Deep Black: `#050505`
- Charcoal: `#1A1A1A` for meaningful section-level rhythm
- Card Surface: `#121212`
- Primary Lime: `#B6FF00`
- Hanken Grotesk primary UI
- ~20px card radius
- 44px+ touch targets
- iPhone-first, reference ~390px portrait
- normal bottom nav: Today / Calendar / Progress / Profile
- focused workout/capture/check-in flows may hide normal bottom navigation

Charcoal is structural, not zebra striping.

## Motion

GSAP is the shared motion engine.

- centralized presets/hooks
- subtle screen fade + small y movement
- restrained card stagger
- transform/opacity preferred
- no bounce/showreel motion
- never block save/navigation on animation completion
- `prefers-reduced-motion` is mandatory

## Semantic anatomy rule

Anatomical imagery must match the actual muscle focus. If the correct approved visual is unavailable, use a neutral semantic placeholder rather than an incorrect decorative muscle map.

## Critical workout rules

- preserve completed sets
- preserve programmed exercise vs actual performed exercise
- persist weight/reps and optional RIR per set
- show last comparable performance on the next occurrence
- alternatives preserve movement intent
- key movements are not randomized merely for variety
- shortened/rescheduled/pain-adapted sessions must not discard valid history

## Critical nutrition rules

- structured equivalent meal choices, not a manual calorie-tracker UX
- allergy/restriction safety outranks preference/variety
- preference changes do not silently rewrite nutrition prescription

## Critical progress/privacy rules

- weight is one signal, not the hero metric
- no body/fitness/transformation score
- no attractiveness rating
- no body-fat estimation from progress photos
- no body reshaping/beautification
- progress-photo handling is private by default
- insights synthesize structured data and avoid unsupported causal claims

## Program update rule

Profile/preference update does not silently rewrite the active program.

`PROFILE CHANGE → IMPACT DETECTED → RECOMMENDATION → VALIDATION/REVIEW → PROGRAM CHANGE`

## Implementation order

Follow `IMPLEMENTATION_BATCHES.md` inside the v2 ZIP.

### Batch A — Core Workout + Exercise Safety

1. Workout Overview
2. Active Exercise Log
3. Exercise Alternatives
4. Post-Workout Summary
5. Adjust Workout
6. Shorter Session
7. Reorganize Week
8. Schedule Updated
9. Exercise Library
10. Exercise Detail
11. Pain & Discomfort flow
12. Rest Day Today

### Batch B — Nutrition

- Daily Nutrition physical export
- Meal Options remains provisional until a physical Stitch export exists

### Batch C — Progress + Reviews

- Measurements
- Progress Photos
- Detailed Trends
- Phase Review
- `/progress` remains provisional until its physical export exists

### Batch D — Onboarding + Program

- onboarding sequence
- baseline
- plan building/reveal
- Program Overview
- Welcome/Login remains provisional without a physical export

### Batch E — Profile Editing + Notifications + QA

- Profile Preferences
- Training Preferences editor
- Health & Limitations editor
- Program Impact Review
- Notifications & Reminders
- cross-flow/mobile/PWA/reduced-motion/state QA

## Current implementation rule

The existing Phase 1 foundation on `codex/phase-1-foundation` must be preserved and reconciled, not rebuilt blindly:

- Today
- Calendar
- Day Detail
- temporary Progress
- Profile
- shared shell/navigation
- centralized GSAP motion
- iPhone/PWA foundation

Before starting Batch A, sync the development branch with `main` so the branch contains `/COACHX_STITCH_MASTER_v2.zip` and this document.

## After athlete visual MVP

Only after the visual MVP is stable:

1. Supabase schema/Auth/RLS/Storage
2. typed fixture → persistent service migration
3. workout/session persistence
4. private progress-photo storage
5. notification infrastructure
6. OpenAI Coach Engine with validated structured outputs
7. coach-review workflow

Supabase is the persistent source of truth. OpenAI remains server-side and is never the database.
