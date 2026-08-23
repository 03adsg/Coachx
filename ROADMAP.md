# AthlexForce Roadmap

## Canonical Runway

- Baseline commit: `750947236c04479e23d2174a71c19e8946ab663d`
- Canonical production: `https://coachxsync1.vercel.app`
- Canonical Supabase project: `zlblnezbbiimapruazvc`

## Slice Status

| Slice | Status | Notes |
| --- | --- | --- |
| 1-20 | COMPLETE | Foundation, auth, identity, relationship, workout, nutrition, progress, profile, i18n, QA, and security certification are considered complete under the existing certification trail. |
| 21 | COMPLETE | Athlete Flow Architecture is complete. |
| 22 | COMPLETE | Live Workout Experience is complete and established as the production HEAD baseline. |
| 23 | COMPLETE | Exercise Detail + Alternatives are implemented and documented in `docs/SLICE_23_CLOSURE.md`. |
| 24 | IMPLEMENTATION COMPLETE / LIVE QA PENDING | Nutrition UX 2.0 implementation is present, but authenticated production QA remains pending per `docs/SLICE_24_LIVE_QA.md`. |
| 25 | COMPLETE | Media System. Production ready. |
| 26 | COMPLETE | Feedback + Motion polish. Production ready. |
| 27 | COMPLETE | Inputs and intensity refinement. Production-certified before Slice 28. |
| 28 | COMPLETE / IPHONE PWA PHYSICAL CHECK OUT-OF-BAND | Web/PWA notifications. Production deploy, VAPID, Edge auth, Cron, RLS insert policy, real push, deep-link, quiet hours, and live copy QA are complete. Physical iPhone Home Screen Web Push remains the only out-of-band device check. |
| 29 | IN PROGRESS | Athlete Private Alpha final certification. |

## Product Principle

- Finish Athlete Private Alpha first.
- Then test with real athletes.
- Then resume the full coach <-> athlete product.
- Coach foundation and security exist now so athlete modes stay architecturally correct.

## Roadmap Order

1. Keep the current athlete surface stable.
2. Add only the next slice when the current slice is visually and functionally converged.
3. Do not move coach analytics or post-alpha coach scope ahead of Athlete Private Alpha.

## Notes

- `ROADMAP.md` is the canonical roadmap for this repository.
- Supporting audit and slice docs remain valid only when they do not conflict with this file.
