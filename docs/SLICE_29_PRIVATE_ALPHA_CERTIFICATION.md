# Slice 29 — Athlete Private Alpha Final Certification

## Status

IN PROGRESS

## Goal

Certify the athlete-facing Private Alpha as a stable production surface before starting any post-alpha scope.

Slice 29 is not a new feature slice. It is the final athlete-alpha audit across:

- entry/auth/session recovery;
- onboarding to plan start;
- Today;
- Calendar and Day Detail;
- Workout overview, active logging, alternatives, safety, adjustment, and summary;
- Nutrition and meal alternatives;
- Progress, check-in, measurements, photos, trends, and phase review;
- Program and profile settings;
- Notifications from Slice 28;
- i18n ES/CA/EN/DE;
- responsive mobile widths 375 / 390 / 430;
- reduced motion;
- security invariants and RLS-sensitive flows.

## Non-goals

Do not start:

- Social Feed;
- Biometric Sync;
- Wearables;
- Coach chat;
- coach analytics expansion;
- any post-alpha product scope.

## Slice 28 handoff state

Slice 28 is operationally complete on production:

- production deployment: `dpl_CygTgLKii8sXFeTFm5NAFMFLLGaE`;
- production commit: `204f599cac2734e246eeb737c005b8708a97d4a7`;
- canonical URL: `https://coachxsync1.vercel.app`;
- notification backend: Edge Function and Cron are HTTP 200;
- Cron cadence: `*/2 * * * *`;
- push delivery: live push delivered;
- deep-link: verified with `/nutrition`;
- quiet hours: dispatcher skip verified;
- category preferences preserved when master is toggled;
- notification copy polish verified live;
- language selector description removed and verified live.

Physical iPhone Home Screen Web Push remains an out-of-band device check and does not authorize post-alpha scope by itself.

## Certification checklist

### Production and routing

- [ ] Canonical production resolves to the latest intended commit.
- [ ] No Vercel runtime errors in the certification window.
- [ ] Manifest and service worker remain valid.
- [ ] Core routes load without blank states or unauthorized leaks.

### Auth and onboarding

- [ ] Existing user session restores correctly.
- [ ] Email/password login works.
- [ ] Google login remains configured or degrades safely.
- [ ] Password reset route lands on reset flow, not generic login.
- [ ] Fresh athlete onboarding reaches plan-ready and Today.

### Athlete loop

- [ ] Today shows the current training/nutrition/progress state.
- [ ] Calendar opens day detail.
- [ ] Workout logging preserves prescribed vs actual identity.
- [ ] Exercise alternatives do not mutate silently.
- [ ] Nutrition alternatives preserve user intent.
- [ ] Check-in and progress flows save only authenticated user data.

### Notifications

- [ ] Permission, capability, subscription, and preference remain separate.
- [ ] Push subscription recovery works.
- [ ] In-app fallback remains available.
- [ ] Quiet hours do not send pushes.
- [ ] Deep-links route to their destination and invalid destinations fall back safely.

### UI and accessibility

- [ ] 375 px width.
- [ ] 390 px width.
- [ ] 430 px width.
- [ ] ES.
- [ ] CA.
- [ ] EN.
- [ ] DE.
- [ ] Reduced motion.
- [ ] Touch targets remain usable.
- [ ] No development-facing copy appears in athlete screens.

### Security and data

- [ ] No service role or secret key in client bundle.
- [ ] RLS-sensitive tables keep owner isolation.
- [ ] Client cannot create sent/delivered/clicked notification reminders.
- [ ] Coach-managed athlete invariants remain intact.
- [ ] AI recommendations remain review/proposal only.

## Exit criteria

Slice 29 can close only when:

- all critical athlete flows pass on production;
- zero P0/P1 issues remain;
- any P2 issues are documented as non-blocking;
- the roadmap is updated;
- production deployment is identified by commit and deployment id;
- no post-alpha scope has been started.
