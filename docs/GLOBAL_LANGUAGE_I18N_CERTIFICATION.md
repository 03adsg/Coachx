# AthlexForce Global Language & I18N Certification

## Status

MANDATORY CERTIFICATION GATE

## Purpose

This is a cross-cutting QA and certification gate, not a new product slice.

It must be executed before:

- Slice 28 final web certification on all affected surfaces; and
- Slice 29 Athlete Private Alpha readiness / release declaration.

## Languages

- ES
- CA
- EN
- DE

## Required checks

- No mixed-language page content.
- No raw i18n keys in athlete-facing UI.
- No hardcoded English leaking into non-English locales.
- No hardcoded Spanish leaking into other locales.
- No developer/debug text.
- No backend enums shown as raw technical values unless intentionally mapped.
- Program-generated content is localized or deliberately mapped through canonical semantics.
- AI-generated text respects the active locale.
- Dates, times, units, plurals, and number formatting follow locale rules.
- Empty, loading, error, offline, and fallback states are localized.
- Accessibility labels and visible copy stay localized where user-facing.
- German expansion is checked against layout and touch targets.

## Mandatory surfaces

Minimum athlete-facing surfaces to inspect:

- Welcome / entry
- Login / logout flows
- Onboarding
- Today
- Calendar
- Day detail
- Program summary
- Workout overview
- Active workout
- Exercise detail
- Exercise alternatives
- Nutrition
- Meal options
- Progress
- Weekly check-in
- Completion / insights
- Profile
- Edit profile
- Settings
- Notifications
- Security
- Language selector
- Empty states
- Error states
- Loading states
- Dialogs
- Sheets
- Toasts
- Validation messages

## Visual requirements

- 375x812
- 390x844
- 430x932
- German at 375x812 is mandatory.
- No overflow, clipping, overlap, or hidden primary actions.

## Exit rule

Do not mark Slice 28 web certification or Slice 29 Private Alpha ready while mixed-language, untranslated, malformed, or technically exposed localized content remains.
