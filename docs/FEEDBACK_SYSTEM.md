# AthlexForce Feedback System

> Slice 26 extends this document with the canonical interaction hierarchy in `docs/INTERACTION_FEEDBACK_SYSTEM.md`.

## Purpose

AthlexForce must always answer the user with a predictable result for every meaningful action. The feedback system standardizes:

- immediate control feedback
- inline state changes
- light confirmation
- hero success
- warning
- destructive confirmation
- error and recovery

It also records interaction memory so repeated actions feel consistent across routes and sessions.

## Research basis

- Apple HIG: Feedback, Alerts, Undo and redo, Playing haptics
- Material Design: messages, progress, dialogs, validation
- Atlassian Design System: flags, inline messages, section messages, warning modals

## Canonical taxonomy

### 1. Immediate control feedback

Use for taps, selections, toggles, chip presses, and other low-risk actions.

- Show pressed state immediately.
- Do not show a toast just because a button was tapped.
- Keep the response local to the control.

### 2. Inline state change

Use for high-frequency, low-risk changes.

Examples:

- complete one set
- select a meal
- log water
- toggle a notification category

The row, card, or control should resolve in place.

### 3. Light confirmation

Use for asynchronous saves that benefit from acknowledgment.

Examples:

- save profile changes
- save measurements
- upload a progress photo
- save a locale preference

Keep it small and nonblocking.

### 4. Hero success

Use only for milestones.

Examples:

- onboarding complete
- workout complete
- weekly check-in submitted
- program update applied

### 5. Warning

Use when the action may have a consequence but the user can still decide.

Examples:

- discard unsaved work
- apply a program change
- remove a photo

### 6. Destructive confirmation

Use only for irreversible or hard-to-undo actions.

Use explicit verbs, not generic yes/no labels.

### 7. Error and recovery

Every failure must answer:

1. What happened?
2. What did not happen?
3. What can the user do next?

## Intensity scale

- **Level 0** — control state only
- **Level 1** — micro-feedback
- **Level 2** — inline confirmation or toast
- **Level 3** — focused sheet or message
- **Level 4** — blocking confirmation

Use the lowest viable level.

## Toast strategy

- One canonical toast layer.
- One predictable location.
- Never cover bottom navigation, the keyboard, or modal actions.
- Queue size stays small.
- Dedupe repeated events by action and state.

## Inline strategy

- Prefer state changes near the affected control.
- Keep success visible where the action happened.
- Use inline status chips and row resolution for routine operations.

## Modal strategy

- Only for destructive or consequential decisions.
- Never use a modal for routine saves.
- Keep modal copy short and explicit.

## Hero strategy

- Reserve for milestone outcomes.
- Pair with brief summary copy.
- Use controlled motion, not celebration spam.

## Error hierarchy

1. Field error
2. Section error
3. Page failure
4. Background failure
5. Critical blocker

## Interaction memory

AthlexForce stores a short-lived memory of recent feedback by action id so the interface can stay consistent across refreshes and repeated actions.

Memory keeps:

- recent notices
- last notice per action
- dedupe keys
- reversible state

## Accessibility

- Feedback must work with text alone.
- Use `aria-live` for nonblocking asynchronous updates.
- Do not rely on color alone.
- Respect reduced motion.

## Languages

Feedback copy must remain consistent in:

- `es`
- `ca`
- `en`
- `de`

## What not to do

- Do not interrupt common actions with alerts.
- Do not show redundant success messages when the UI already resolved clearly.
- Do not show raw technical errors to users.
- Do not change business logic to force feedback.
