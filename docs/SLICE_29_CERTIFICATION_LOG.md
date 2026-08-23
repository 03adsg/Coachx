# Slice 29 Certification Log

## Status

STARTED

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
- [ ] Service worker behavior requires browser/device verification.
- [ ] Full protected core route pass requires an authenticated browser session.

### Security and data

- [x] Nutrition RLS-sensitive tables verified during Slice 24 closure.
- [x] Authenticated nutrition owner persistence was verified with rollback in Supabase during Slice 24 closure.
- [ ] Full cross-domain athlete RLS audit remains pending for workout, progress, check-in, photos, notifications, program, and profile tables.
- [ ] Client bundle secret scan remains pending.
- [ ] Notification reminder mutation restrictions remain pending in Slice 29 context.
- [ ] Coach-managed athlete invariants remain pending in Slice 29 context.
- [ ] AI recommendation review/proposal-only boundary remains pending in Slice 29 context.

### Auth and onboarding

- [ ] Existing session restore requires authenticated browser/session test.
- [ ] Email/password login requires browser/session test.
- [ ] Google login configured/degrades safely requires auth provider/browser test.
- [ ] Password reset route requires browser/session test.
- [ ] Fresh athlete onboarding to plan-ready and Today requires browser/session test.

### Athlete loop

- [ ] Today current state requires authenticated browser/session test.
- [ ] Calendar to Day Detail requires browser/session test.
- [ ] Workout logging identity preservation requires authenticated flow verification.
- [ ] Exercise alternatives do not mutate silently: partially supported by Slice 23 code closure; production flow still needs authenticated pass.
- [ ] Nutrition alternatives preserve intent: supported by Slice 24 closure; production browser pass still pending.
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

## Environment limitation

The integrated local headless browser available in this chat environment is blocked from opening external production URLs with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore, visual/browser-only checks must be completed through a permitted browser session, Codex environment with browser access, Vercel preview tooling that can render pages, or a physical device.

Connector-backed verification can still continue for Vercel deployment status, runtime errors, Supabase schema/RLS/persistence, GitHub source inspection, and documentation reconciliation.

## Current blockers

- Authenticated browser session is required for the full athlete loop.
- Physical iPhone Home Screen Web Push remains out-of-band from Slice 28.
- Full mobile visual QA at 375/390/430 requires render-capable browser access.

## Next actions

1. Continue connector-backed security/data certification.
2. Inspect client bundle/env references for secret exposure.
3. Verify notification data mutation boundaries.
4. Verify coach-managed invariants and AI recommendation/proposal-only boundaries.
5. Prepare a browser/device QA checklist for the remaining visual/authenticated items.
