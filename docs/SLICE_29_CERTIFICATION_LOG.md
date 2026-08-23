# Slice 29 Certification Log

## Status

IN PROGRESS

## Certification window

- Started from ChatGPT connector audit on 2026-08-23.
- Branch: `codex/phase-1-foundation`.
- Canonical production: `https://coachxsync1.vercel.app`.
- Vercel project: `_coachx_sync_1`.
- Supabase project: `zlblnezbbiimapruazvc`.

## Scope

This log starts the Slice 29 Athlete Private Alpha final certification. It does not introduce new product scope and does not authorize post-alpha features.

## Evidence already verified before this log

- Slice 23 is closed in `docs/SLICE_23_CLOSURE.md`.
- Slice 24 live QA is closed in `docs/SLICE_24_LIVE_QA.md`.
- Roadmap is reconciled through Slice 24.
- Slice 28 remains complete with physical iPhone Home Screen Web Push as an out-of-band check.

## Connector-backed checks started

### Production and routing

- [x] Canonical production responds with HTTP 200.
- [x] Unauthenticated production root resolves safely to the athlete entry/session recovery surface instead of leaking protected athlete data.
- [x] Manifest returns HTTP 200 and contains AthlexForce standalone PWA metadata.
- [x] Vercel runtime error cluster query shows no runtime errors in the selected recent window.
- [x] Connected cloud browser reached canonical production and resolved `/` to `/entry` with the AthlexForce athlete login shell.
- [x] Authenticated cloud browser reached the protected production shell and loaded Today, Calendar, Day Detail, Program, Nutrition, Progress, Progress Trends, Progress Measurements, Check-in, and Profile settings routes without runtime crashes.
- [x] Production service worker asset is present at `/notification-sw.js` and contains the Slice 29 deep-link allowlist/sanitization worker.
- [ ] Runtime service-worker registration still requires browser/device verification.

### Security and data

- [x] Nutrition RLS-sensitive tables verified during Slice 24 closure.
- [x] Authenticated nutrition owner persistence was verified with rollback in Supabase during Slice 24 closure.
- [ ] Full cross-domain athlete RLS audit remains pending for workout, progress, check-in, photos, notifications, program, and profile tables.
- [x] Source/client-boundary scan found no `NEXT_PUBLIC_` service-role, OpenAI, VAPID-private, or other server secret references.
- [x] Notification reminder mutation restrictions are hardened live: athlete inserts remain `scheduled` only; authenticated updates are column-limited to `status`, `dismissed_at`, and `snoozed_until`, with RLS allowing only `dismissed` or `snoozed` owner transitions.
- [x] Anonymous execution was removed live from the privileged coach, workout-completion, relationship, and proposal-application RPCs used by the private-alpha surface.
- [x] AI recommendation and proposal RPCs are no longer executable by `anon`; authenticated execution remains guarded by the existing function-level identity/assignment checks.

### Auth and onboarding

- [x] Existing session restore worked in the authenticated cloud browser session.
- [ ] Email/password login requires browser/session test.
- [ ] Google login configured/degrades safely requires auth provider/browser test.
- [ ] Password reset route requires browser/session test.
- [ ] Fresh athlete onboarding to plan-ready and Today requires browser/session test.

### Athlete loop

- [x] Today current state loads protected athlete data in production.
- [x] Calendar to Day Detail route pass loads the selected day preview and `/day/2026-08-23`.
- [ ] Workout logging identity preservation requires authenticated flow verification.
- [ ] Exercise alternatives do not mutate silently: partially supported by Slice 23 code closure; production flow still needs authenticated pass.
- [ ] Nutrition alternatives preserve intent: supported by Slice 24 closure; production browser pass still pending.
- [x] Check-in route recovers from the answer-restore state into the review form.
- [ ] Check-in and progress authenticated persistence remains pending.

### Notifications

- [ ] Permission/capability/subscription/preference separation remains pending.
- [ ] Push subscription recovery remains pending.
- [ ] In-app fallback remains pending.
- [ ] Quiet hours remains pending in Slice 29 context.
- [ ] Deep-link fallback remains pending.

### UI and accessibility

- [ ] 375 px visual pass pending.
- [ ] 390 px visual pass pending.
- [ ] 430 px visual pass pending.
- [ ] ES pass pending.
- [ ] CA pass pending.
- [ ] EN pass pending.
- [ ] DE pass pending.
- [ ] Reduced motion pass pending.
- [ ] Touch targets pass pending.
- [ ] Development-facing copy scan pending.

## Authenticated production route pass

Verified with the connected cloud browser against canonical production:

- `/` restored the authenticated athlete session and rendered the Today surface with the current recovery day and next workout.
- `/calendar?date=2026-08-23&month=2026-08-01` rendered the monthly calendar and selected day preview.
- `/day/2026-08-23` rendered Day Detail and linked through to nutrition/calendar fallbacks.
- `/program` rendered the current program summary.
- `/nutrition` rendered the planned meals, hydration, supplements, and related day state.
- `/progress`, `/progress/trends`, and `/progress/measurements` rendered the progress shell, chart/trend surfaces, and measurement update flow.
- `/progress/check-in` initially displayed the restore state and then recovered into the check-in review form.
- `/profile`, `/profile/notifications`, `/profile/preferences`, and `/profile/security` rendered the profile/settings flows.

No Vercel runtime errors were reported for the selected recent production window during this pass.

## Progress, chart, and GSAP visual repair

Local repairs applied after the authenticated route pass:

- `components/analytics-chart.tsx` now computes the chart domain from both series data and target value, preventing target lines from rendering outside the visible chart when the target is above or below the current data range.
- `components/analytics-chart.tsx` now builds the area fill from the real line path instead of a placeholder bottom-only polygon.
- `components/analytics-chart.tsx` and `components/progress-immersion-card.tsx` now use per-instance SVG gradient IDs, avoiding collisions when multiple progress charts/rings are mounted together.
- `components/analytics-chart.tsx` now marks chart cards with `data-feedback-kpi-card`, so the existing GSAP KPI timeline can animate the card, line, and points consistently.
- `app/globals.css` now styles the actual target-state chart classes and keeps progress ring sparks hidden until the GSAP timeline reveals them.
- Repository design references do not include a physical Stitch export specifically for `/progress`; `docs/STITCH_MASTER_V2.md` still marks `/progress` as provisional until that export exists.

These repairs are local and still require a preview build/browser pass before they can be certified as deployed.

## Local validation

- `git diff --check` passes.
- `node --test tests/responsive-ui-contract.test.mjs` passes.
- `node --test tests/notification-system.test.mjs tests/responsive-ui-contract.test.mjs` is blocked by missing local dependencies: `tests/notification-system.test.mjs` imports the `typescript` package, but `node_modules` is not installed in this workspace.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` remain blocked locally for the same dependency-installation reason.

## Environment limitation

The connected cloud browser can reach the public production entry shell and an authenticated athlete session was available for the protected production route pass.

Runtime service-worker registration and physical iPhone Home Screen Web Push remain out-of-band device checks.

Local dependency installation is unavailable in the current workspace, so local `typecheck`, `lint`, and `next build` are blocked until dependencies are present or the changes are published to a preview deployment.

## Current blockers

- Physical iPhone Home Screen Web Push remains out-of-band from Slice 28.
- Full mobile visual QA at 375/390/430 requires a render-capable preview of the repaired local code.
- Preview deployment/build validation requires publishing the local Slice 29 repairs to the authorized branch.
- Exact `/progress` Stitch matching requires the missing physical Stitch export for progress/analytics screens.

## Slice 29 security hardening applied

- Live migration: `slice_29_private_alpha_security_hardening`.
- Live migration: `slice_29_notification_anon_grants_hardening`.
- Verified `anon` cannot execute:
  - `apply_program_change_proposal(uuid)`;
  - `coach_decide_recommendation(uuid, text)`;
  - `coach_decide_program_change_proposal(uuid, text)`;
  - `complete_workout_session(uuid, integer, text)`;
  - `handle_new_auth_user()`.
- Verified `authenticated` retains the intended `apply_program_change_proposal(uuid)` execution path.
- Supabase security advisor no longer reports anonymous `SECURITY DEFINER` execution warnings for the hardened private-alpha RPCs.
- Remaining advisor items are tracked separately: mutable search paths on two shared helper functions, leaked-password protection disabled, and the intentionally backend-only `notification_delivery_attempts` table having RLS with no client policies.

## Next actions

1. Publish the local Slice 29 progress/i18n repairs to the authorized branch and validate the resulting preview build.
2. Complete 375/390/430, ES/CA/EN/DE, reduced-motion, and touch-target passes against the repaired preview.
3. Verify service-worker registration and physical iPhone Home Screen Web Push out of band.
4. Re-run the full local validation gate when dependency installation is available.
