# COACHX Supabase Migration Plan

Public product identity: AthlexForce. Internal repo and technical names remain CoachX where they are already established.

Date: 2026-08-09

Branch: `codex/phase-1-foundation`

Commit: `2081197`

This plan assumes the current athlete-side UI remains intact while persistence is introduced behind typed service boundaries.

## Current Verification

- Slice 1: complete + live verified
- Slice 2: complete + live verified
- Slice 3: complete + live verified
- Slice 4: complete + live verified
- Slice 5: local implementation complete; live verification is partial because the `progress_photos` metadata insert path still needs the live RLS fix migration even though the private `progress-photos` Storage bucket is present

## Phase S0 - Supabase project + env + typed client

### Scope

- Create the Supabase project and environment wiring
- Add typed client initialization
- Keep all current routes and fixtures working

### Tables / entities

- None yet, beyond migration scaffolding and auth metadata

### Routes affected

- All routes indirectly through provider/service initialization

### Migration risk

- Low

### Definition of done

- Supabase env variables are configured
- Typed client initializes without breaking local dev
- No UI redesign or feature change

## Phase S1 - Auth + profile

### Scope

- Add real sign-in / sign-up / session management
- Persist athlete identity and core profile data
- Persist profile preferences and onboarding completion snapshot

### Tables / entities

- `users`
- `athlete_profiles`
- `athlete_preferences`
- `health_limitations`
- `notification_preferences`
- `onboarding_progress`

### Routes affected

- `/entry`
- `/onboarding/*`
- `/profile`
- `/profile/preferences/*`
- `/profile/notifications`

### Migration risk

- Medium

### Definition of done

- A user can authenticate
- Profile and preference edits save to Supabase
- Onboarding state resumes from persisted data
- Existing UI continues to function on fixture fallback if backend is unavailable

## Phase S2 - Program + calendar

### Scope

- Persist active program, phase state, and scheduled workouts
- Connect calendar/day detail to real program data

### Tables / entities

- `programs`
- `program_phases`
- `scheduled_workouts`
- `workout_templates`
- `workout_template_exercises`
- `exercise_alternatives`

### Routes affected

- `/`
- `/calendar`
- `/day/[date]`
- `/program`

### Migration risk

- Medium

### Definition of done

- Today, calendar, and program all read the same persisted program record
- Scheduled workout identity is stable and date-driven
- Demo-only aggregate state is no longer the authority

## Phase S3 - Workout persistence

### Scope

- Persist workout session start, exercise identity, set logs, completion, and adjustment metadata
- Preserve prescribed vs performed exercise identity

### Tables / entities

- `workout_sessions`
- `workout_session_exercises`
- `workout_sets`
- `scheduled_workouts`
- `exercise_alternatives`

### Routes affected

- `/workout/[sessionId]/*`
- `/exercises/[exerciseId]`
- `/day/[date]`

### Migration risk

- High
- Live verification is complete; the remaining risk is future schema drift, not a missing live slice.

### Definition of done

- Session state persists incrementally and restores after refresh
- Completed sets are saved as they happen
- Session start/resume is idempotent for the same scheduled workout
- Prescribed vs performed exercise identity stays separate across swaps
- Rest timer remains client-side only while the durable set/session state lives in Supabase
- Slice 3 is live verified and complete

## Phase S4 - Nutrition persistence

### Scope

- Persist nutrition plans, daily nutrition snapshots, meal slots, equivalent meal options, athlete selections, hydration logs, and supplement completion state
- Preserve allergy and restriction safety as a server-validated boundary
- Keep historical day snapshots stable even if the active plan changes later

### Tables / entities

- `nutrition_plans`
- `nutrition_days`
- `nutrition_meal_slots`
- `nutrition_meal_options`
- `nutrition_day_selections`
- `nutrition_hydration_logs`
- `nutrition_supplement_logs`

### Routes affected

- `/day/[date]/nutrition`

### Migration risk

- Medium

### Definition of done

- Meal selection and eaten/completed states persist
- Hydration logs persist
- Safety filters remain server-validated
- Training-day versus rest-day nutrition snapshots restore from the persisted program/calendar boundary
- Local nutrition fixture fallback remains explicit until the live migration is applied and verified
- Slice 4 is live verified and complete

## Phase S5 - Progress + private photos

### Scope

- Persist measurements, progress checkpoints, photos, and review records
- Move photo assets to private storage with signed URLs
- Keep the public Vercel deployment continuous while the live migration is applied later

### Tables / entities

- `progress_entries`
- `progress_measurements`
- `progress_photos`
- private `progress-photos` storage bucket

### Routes affected

- `/progress`
- `/progress/measurements`
- `/progress/photos`
- `/progress/photos/capture/[pose]`
- `/progress/photos/compare`
- `/progress/trends`
- `/progress/phase-review`

### Migration risk

- High

### Definition of done

- Raw measurements persist separately from derived charts
- Photo checkpoints and assets are private by default
- Trends are derived from stored facts, not manually maintained as primary truth
- Local implementation is complete, but live migration and authenticated browser verification still need to be applied

## Phase S6 - Notifications preferences

### Scope

- Persist reminder preferences and quiet hours
- Keep device/browser permission state separate from preference state

### Tables / entities

- `notification_preferences`

### Routes affected

- `/profile/notifications`

### Migration risk

- Low to medium

### Definition of done

- Master toggle, category toggles, and quiet hours persist
- Device permission is still requested client-side
- Turning off reminders does not delete underlying tasks/events

## Phase S7 - OpenAI recommendation infrastructure

### Scope

- Add server-side recommendation generation
- Validate structured outputs
- Store recommendation records without auto-applying them

### Tables / entities

- `ai_recommendation_records`
- `program_change_proposals`

### Routes affected

- `/profile/program-impact-review`
- `/progress/phase-review`
- future recommendation surfaces

### Migration risk

- High

### Definition of done

- AI generates structured output only on the server
- Recommendations are reviewable records
- No AI output mutates the active program automatically

## Phase S8 - Coach review workflow

### Scope

- Add approval/denial state for coach-reviewed changes
- Separate proposal from application

### Tables / entities

- `coach_reviews`
- `program_change_proposals`

### Routes affected

- `/profile/program-impact-review`
- `/progress/phase-review`

### Migration risk

- High

### Definition of done

- Safety-sensitive edits can be routed into review
- Applied changes are explicit and auditable
- Program history remains intact

## Phase S9 - Production hardening / RLS / QA

### Scope

- Add RLS policies
- Harden signed URL access
- Add logging, metrics, and smoke QA
- Remove reliance on demo seed data as source of truth

### Tables / entities

- All production tables

### Routes affected

- All authenticated routes

### Migration risk

- Medium to high

### Definition of done

- Ownership and access are enforced in Supabase
- Storage is private where required
- Demo fallback remains available only as a fallback, not the authority

## Recommended first slice

The safest first vertical slice is:

**S1 - Auth + profile**

If a slightly larger but still safe slice is acceptable, expand it to:

**S1 - Auth + profile + onboarding completion snapshot**

### Why this slice first

- It removes the most important duplicate source-of-truth problem early.
- It gives the app a real user/profile record before workout, nutrition, and progress history are migrated.
- It keeps the highest-risk persistence domains out of the first backend pass.
