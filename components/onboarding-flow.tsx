"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type HTMLAttributes, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Screen } from "@/components/screen";
import { Card, PrimaryButton, SecondaryButton } from "@/components/ui";
import { OnboardingStickyActions, OnboardingStepHeader, ChoiceButton, PillToggle } from "@/components/onboarding-ui";
import { useOnboardingStore } from "@/components/onboarding-provider";
import { useAuthStore } from "@/components/auth-provider";
import { type OnboardingStepId, type BaselinePose } from "@/lib/onboarding-data";

function FlowShell({
  step,
  title,
  subtitle,
  backHref,
  children,
  rightLabel,
  rightHref
}: {
  step: OnboardingStepId;
  title: string;
  subtitle: string;
  backHref: string;
  children: ReactNode;
  rightLabel?: string;
  rightHref?: string;
}) {
  const { startStep } = useOnboardingStore();
  const index = step === "entry" ? 1 : [
    "intro",
    "profile",
    "goals",
    "training-experience",
    "training-preferences",
    "schedule",
    "health",
    "nutrition",
    "baseline",
    "review",
    "building-plan",
    "plan-ready",
    "program"
  ].indexOf(step) + 1;
  const total = 13;

  useEffect(() => {
    startStep(step);
  }, [startStep, step]);

  return (
    <Screen
      shellClassName="onboarding-shell"
      topbar={
        <OnboardingStepHeader
          title={title}
          subtitle={subtitle}
          stepLabel={step === "entry" ? "ENTRY" : `${step.replace(/-/g, " ").toUpperCase()} · SECTION ${index} OF ${total}`}
          backHref={backHref}
          rightLabel={rightLabel}
          rightHref={rightHref}
        />
      }
    >
      <main className="content tight">{children}</main>
    </Screen>
  );
}

function SectionTitle({ title, caption }: { title: string; caption?: string }) {
  return (
    <div className="stack" style={{ gap: 8 }}>
      <h1 className="headline-lg">{title}</h1>
      {caption ? <p className="caption">{caption}</p> : null}
    </div>
  );
}

function MetricField({
  label,
  value,
  suffix,
  onChange,
  type = "text",
  inputMode
}: {
  label: string;
  value: string | number;
  suffix?: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="onboarding-review-card" style={{ padding: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        {label}
      </div>
      <div className="row" style={{ gap: 8 }}>
        <input
          className="workout-input"
          type={type}
          inputMode={inputMode}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix ? <div className="caption" style={{ whiteSpace: "nowrap" }}>{suffix}</div> : null}
      </div>
    </label>
  );
}

function ToggleGroup({
  items,
  selected,
  onSelect,
  oneColumn = false
}: {
  items: Array<{ label: string; description?: string; id: string }>;
  selected: string;
  onSelect: (value: string) => void;
  oneColumn?: boolean;
}) {
  return (
    <div className={`onboarding-choice-grid ${oneColumn ? "one-column" : ""}`.trim()}>
      {items.map((item) => (
        <ChoiceButton
          key={item.id}
          label={item.label}
          description={item.description}
          selected={item.id === selected}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}

function MultiToggle({
  items,
  selected,
  onToggle
}: {
  items: Array<{ label: string; id: string }>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="stack" style={{ gap: 10 }}>
      <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
        {items.map((item) => (
          <PillToggle key={item.id} label={item.label} selected={selected.includes(item.id)} onClick={() => onToggle(item.id)} />
        ))}
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <Card className="program-section-card">
      <div className="stack" style={{ gap: 12 }}>
        <div>
          <div className="eyebrow">{title}</div>
          {subtitle ? <p className="caption" style={{ marginTop: 6 }}>{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </Card>
  );
}

function ReviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="row" style={{ alignItems: "flex-start", gap: 12 }}>
      <div style={{ minWidth: 104 }}>
        <div className="eyebrow" style={{ marginBottom: 4 }}>{label}</div>
      </div>
      <div className="body-md" style={{ fontWeight: 500, textAlign: "right", flex: 1 }}>
        {value}
      </div>
    </div>
  );
}

export function EntryScreen() {
  const router = useRouter();
  const { entryDestination } = useOnboardingStore();
  const auth = useAuthStore();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const error =
      mode === "sign-in" ? await auth.signInWithEmail(email, password) : await auth.signUpWithEmail(email, password);

    setSubmitting(false);

    if (error) {
      setStatus(error);
      return;
    }

    router.push("/");
  }

  return (
    <Screen shellClassName="onboarding-shell" topbar={<header className="topbar center"><BrandLogo variant="full" width={156} alt="AthlexForce" /></header>}>
      <main className="content">
        <section className="section">
          <div className="eyebrow" style={{ color: "#b6ff00" }}>{auth.isDemoMode ? "PROVISIONAL ENTRY" : "ATHLETE ENTRY"}</div>
          <h1 className="headline-xl" style={{ marginTop: 12 }}>Welcome back</h1>
          <p className="body-lg muted" style={{ marginTop: 12 }}>
            {auth.isConfigured
              ? "Sign in to restore your athlete profile and resume the correct route."
              : "Continue with the demo athlete flow or resume your saved onboarding state."}
          </p>
        </section>

        {auth.isConfigured ? (
          <>
            <section className="section stack">
              <Card className="p-16 onboarding-callout">
                <div className="stack" style={{ gap: 12 }}>
                  <div>
                    <div className="eyebrow">Athlete sign-in</div>
                    <p className="caption" style={{ marginTop: 6 }}>
                      {auth.statusLabel}
                    </p>
                  </div>

                  {auth.user ? (
                    <div className="stack" style={{ gap: 12 }}>
                      <div className="body-md" style={{ fontWeight: 700 }}>
                        Signed in as {auth.user.email ?? "Athlete"}
                      </div>
                      <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
                        <span className="program-template-chip">Session restored</span>
                        <span className="program-template-chip">Auth ready</span>
                      </div>
                      <PrimaryButton className="focus-ring" onClick={() => router.push("/")}>Open app</PrimaryButton>
                      <SecondaryButton
                        className="focus-ring"
                        onClick={async () => {
                          await auth.signOut();
                          router.refresh();
                        }}
                      >
                        Sign out
                      </SecondaryButton>
                    </div>
                  ) : (
                    <form className="stack" onSubmit={handleSubmit}>
                      <div className="row" style={{ gap: 8 }}>
                        <button type="button" className={`program-template-chip focus-ring ${mode === "sign-in" ? "selected" : ""}`.trim()} onClick={() => setMode("sign-in")}>
                          Sign In
                        </button>
                        <button type="button" className={`program-template-chip focus-ring ${mode === "sign-up" ? "selected" : ""}`.trim()} onClick={() => setMode("sign-up")}>
                          Sign Up
                        </button>
                      </div>
                      <label className="stack" style={{ gap: 8 }}>
                        <span className="eyebrow">Email</span>
                        <input className="input-field focus-ring" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                      </label>
                      <label className="stack" style={{ gap: 8 }}>
                        <span className="eyebrow">Password</span>
                        <input className="input-field focus-ring" type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
                      </label>
                      <PrimaryButton className="focus-ring" type="submit" disabled={submitting}>
                        {submitting ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
                      </PrimaryButton>
                      <p className="caption" style={{ marginTop: 4 }}>
                        {mode === "sign-in" ? "Use an existing Supabase athlete account." : "Create a new athlete account with email confirmation if enabled."}
                      </p>
                      {status ? (
                        <p className="caption" style={{ color: "#ff9b9b" }}>
                          {status}
                        </p>
                      ) : null}
                    </form>
                  )}
                </div>
              </Card>
            </section>

            {auth.isDemoMode ? (
              <OnboardingStickyActions
                secondary={<SecondaryButton className="focus-ring" onClick={() => router.push(entryDestination === "/" ? "/" : entryDestination)}>Resume saved flow</SecondaryButton>}
                primary={<PrimaryButton className="focus-ring" onClick={() => router.push(entryDestination)}>Open demo flow</PrimaryButton>}
              />
            ) : null}
          </>
        ) : (
          <>
            <section className="section stack">
              <Card className="p-16 onboarding-callout">
                <div className="stack" style={{ gap: 12 }}>
                  <div>
                    <div className="eyebrow">Entry routing</div>
                    <p className="caption" style={{ marginTop: 6 }}>
                      New users start onboarding. Incomplete onboarding resumes at the saved step. Completed onboarding returns to Today.
                    </p>
                  </div>
                  <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
                    <span className="program-template-chip">Apple</span>
                    <span className="program-template-chip">Email</span>
                    <span className="program-template-chip">Sign In</span>
                  </div>
                </div>
              </Card>
            </section>

            {auth.isDemoMode ? (
              <OnboardingStickyActions
                secondary={<SecondaryButton className="focus-ring" onClick={() => router.push(entryDestination === "/" ? "/" : entryDestination)}>Resume saved flow</SecondaryButton>}
                primary={<PrimaryButton className="focus-ring" onClick={() => router.push(entryDestination)}>Continue</PrimaryButton>}
              />
            ) : null}
          </>
        )}
      </main>
    </Screen>
  );
}

export function OnboardingIntroScreen() {
  const router = useRouter();
  const { completeStep } = useOnboardingStore();

  return (
    <FlowShell step="intro" title="Onboarding" subtitle="Build the athlete setup before the plan is revealed." backHref="/entry" rightLabel="Skip" rightHref="/entry">
      <section className="section">
        <SectionTitle title="Start with the basics" caption="AthlexForce uses one consistent athlete context across profile, goals, training, nutrition, baseline, and the program reveal." />
      </section>

      <section className="section stack">
        <Card className="program-hero-card p-16">
          <div className="stack" style={{ gap: 14 }}>
            <div className="eyebrow">What we’ll set up</div>
            <div className="stack" style={{ gap: 10 }}>
              {["Profile", "Goals", "Training", "Schedule", "Health", "Nutrition", "Baseline"].map((item) => (
                <div key={item} className="row">
                  <div className="body-md" style={{ fontWeight: 700 }}>{item}</div>
                  <span className="icon muted" aria-hidden="true">check</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.push("/entry")}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("intro"); router.push("/onboarding/profile"); }}>Start onboarding</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const { state, setProfile, completeStep } = useOnboardingStore();

  return (
    <FlowShell step="profile" title="Profile" subtitle="Name, age, height, weight, and units." backHref="/onboarding">
      <section className="section">
        <SectionTitle title="What should we call you?" caption="Use the same athlete context throughout the demo flow." />
      </section>

      <section className="section stack">
        <Card className="program-hero-card p-16">
          <div className="stack" style={{ gap: 12 }}>
            <MetricField label="Name" value={state.profile.name} onChange={(value) => setProfile({ name: value })} />
            <div className="grid-2">
              <MetricField label="Age" value={state.profile.age} type="number" inputMode="numeric" onChange={(value) => setProfile({ age: Number(value || 0) })} />
              <MetricField label="Unit system" value={state.profile.unitSystem} onChange={(value) => setProfile({ unitSystem: value as "metric" | "imperial" })} />
            </div>
            <div className="grid-2">
              <MetricField label="Height" value={state.profile.heightCm} suffix="cm" type="number" inputMode="decimal" onChange={(value) => setProfile({ heightCm: Number(value || 0) })} />
              <MetricField label="Weight" value={state.profile.weightKg} suffix="kg" type="number" inputMode="decimal" onChange={(value) => setProfile({ weightKg: Number(value || 0) })} />
            </div>
          </div>
        </Card>
      </section>

      <section className="section">
        <Card className="p-16 onboarding-callout">
          <div className="eyebrow">Profile snapshot</div>
          <p className="body-md" style={{ marginTop: 8 }}>
            {state.profile.name} · {state.profile.heightCm} cm · {state.profile.weightKg} kg · {state.profile.unitSystem}
          </p>
        </Card>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("profile"); router.push("/onboarding/goals"); }}>Continue</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function GoalsScreen() {
  const router = useRouter();
  const { state, setMainGoal, reorderPriorities, completeStep } = useOnboardingStore();

  return (
    <FlowShell step="goals" title="Goals" subtitle="Main goal and ordered priorities." backHref="/onboarding/profile">
      <section className="section">
        <SectionTitle title="Set the main goal" caption="Keep the visual language simple. Goal and priorities should read clearly on mobile." />
      </section>

      <section className="section stack">
        <ToggleGroup
          items={[
            { id: "Body Recomposition", label: "Body Recomposition" },
            { id: "Muscle Gain", label: "Muscle Gain" },
            { id: "Strength", label: "Strength" },
            { id: "Performance", label: "Performance" }
          ]}
          selected={state.goals.mainGoal}
          onSelect={setMainGoal}
          oneColumn
        />
      </section>

      <section className="section stack">
        <Card className="program-section-card">
          <div className="eyebrow">Priorities</div>
          <p className="caption" style={{ marginTop: 6 }}>Reorder the list. The current order updates immediately.</p>
          <div className="stack" style={{ marginTop: 14 }}>
            {state.goals.priorities.map((priority, index) => (
              <div key={priority} className="onboarding-reorder-row">
                <div className="onboarding-reorder-index">{index + 1}</div>
                <div className="body-md" style={{ fontWeight: 700, flex: 1 }}>{priority}</div>
                <button className="tap-target focus-ring" aria-label={`Move ${priority} up`} onClick={() => reorderPriorities(index, Math.max(0, index - 1))} type="button">
                  <span className="icon" aria-hidden="true">arrow_upward</span>
                </button>
                <button className="tap-target focus-ring" aria-label={`Move ${priority} down`} onClick={() => reorderPriorities(index, Math.min(state.goals.priorities.length - 1, index + 1))} type="button">
                  <span className="icon" aria-hidden="true">arrow_downward</span>
                </button>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("goals"); router.push("/onboarding/training-experience"); }}>Continue</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function TrainingExperienceScreen() {
  const router = useRouter();
  const { state, setTrainingExperience, completeStep } = useOnboardingStore();

  return (
    <FlowShell step="training-experience" title="Training Experience" subtitle="Current frequency, confidence, loads, and movement familiarity." backHref="/onboarding/goals">
      <section className="section stack">
        <Card className="program-section-card">
          <div className="eyebrow">Experience summary</div>
          <div className="stack" style={{ gap: 10, marginTop: 12 }}>
            {[
              ["Training age", state.trainingExperience.trainingAge, "2-3 years"],
              ["Current frequency", state.trainingExperience.currentFrequency, "4 days / week"],
              ["Confidence", state.trainingExperience.confidence, "Intermediate"],
              ["Equipment", state.trainingExperience.equipmentFamiliarity, "Full gym"]
            ].map(([label, value]) => (
              <div key={label as string} className="row">
                <div className="eyebrow" style={{ margin: 0 }}>{label as string}</div>
                <div className="body-md" style={{ fontWeight: 700, textAlign: "right" }}>{value as string}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="section stack">
        <Card className="program-section-card">
          <div className="eyebrow">Familiarity</div>
          <div className="stack" style={{ gap: 12, marginTop: 12 }}>
            <MetricField label="Movement familiarity" value={state.trainingExperience.movementFamiliarity} onChange={(value) => setTrainingExperience({ movementFamiliarity: value })} />
            <MetricField label="Load familiarity" value={state.trainingExperience.loadFamiliarity} onChange={(value) => setTrainingExperience({ loadFamiliarity: value })} />
            <MetricField label="RIR familiarity" value={state.trainingExperience.rirFamiliarity} onChange={(value) => setTrainingExperience({ rirFamiliarity: value })} />
            <MetricField label="Technical confidence" value={state.trainingExperience.technicalConfidence} onChange={(value) => setTrainingExperience({ technicalConfidence: value })} />
          </div>
        </Card>
      </section>

      <section className="section stack">
        <Card className="program-section-card">
          <div className="eyebrow">Current lifts</div>
          <div className="stack" style={{ marginTop: 12 }}>
            {state.trainingExperience.currentKeyLifts.map((lift) => (
              <div key={lift} className="row">
                <div className="body-md" style={{ fontWeight: 700 }}>{lift}</div>
                <span className="icon muted" aria-hidden="true">fitness_center</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("training-experience"); router.push("/onboarding/training-preferences"); }}>Continue</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function TrainingPreferencesScreen() {
  const router = useRouter();
  const { state, setTrainingPreferences, completeStep } = useOnboardingStore();
  const preferences = state.trainingPreferences;

  return (
    <FlowShell step="training-preferences" title="Training Preferences" subtitle="Days, duration, equipment, variety, and rest preferences." backHref="/onboarding/training-experience">
      <section className="section stack">
        <SectionCard title="Training days" subtitle="Use the same weekly pattern for progression.">
          <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <PillToggle
                key={day}
                label={day}
                selected={preferences.preferredDays.includes(day)}
                onClick={() =>
                  setTrainingPreferences({
                    preferredDays: preferences.preferredDays.includes(day)
                      ? preferences.preferredDays.filter((item) => item !== day)
                      : [...preferences.preferredDays, day]
                  })
                }
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Preference summary">
          <div className="stack" style={{ gap: 10 }}>
            <ReviewLine label="Days / week" value={`${preferences.daysPerWeek}`} />
            <ReviewLine label="Duration" value={preferences.duration} />
            <ReviewLine label="Location" value={preferences.location} />
            <ReviewLine label="Style" value={preferences.style} />
            <ReviewLine label="Cardio" value={preferences.cardioPreference} />
          </div>
        </SectionCard>

        <SectionCard title="Repeatable anchors" subtitle="Variety should not become randomness.">
          <div className="stack" style={{ gap: 12 }}>
            <MetricField label="Favorite exercises" value={preferences.favoriteExercises.join(", ")} onChange={(value) => setTrainingPreferences({ favoriteExercises: value.split(",").map((item) => item.trim()).filter(Boolean) })} />
            <MetricField label="Movements to avoid" value={preferences.movementsToAvoid.join(", ")} onChange={(value) => setTrainingPreferences({ movementsToAvoid: value.split(",").map((item) => item.trim()).filter(Boolean) })} />
            <MetricField label="Guidance preference" value={preferences.guidancePreference} onChange={(value) => setTrainingPreferences({ guidancePreference: value })} />
          </div>
        </SectionCard>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("training-preferences"); router.push("/onboarding/schedule"); }}>Continue</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function ScheduleLifestyleScreen() {
  const router = useRouter();
  const { state, setScheduleLifestyle, completeStep } = useOnboardingStore();
  const schedule = state.scheduleLifestyle;

  return (
    <FlowShell step="schedule" title="Schedule & Lifestyle" subtitle="Work pattern, sleep, stress, hydration, and training windows." backHref="/onboarding/training-preferences">
      <section className="section stack">
        <SectionCard title="Lifestyle summary">
          <div className="stack" style={{ gap: 10 }}>
            <ReviewLine label="Work schedule" value={schedule.workSchedule} />
            <ReviewLine label="Activity level" value={schedule.activityLevel} />
            <ReviewLine label="Steps" value={schedule.steps} />
            <ReviewLine label="Energy pattern" value={schedule.energyPattern} />
          </div>
        </SectionCard>

        <SectionCard title="Timing">
          <div className="grid-2">
            <MetricField label="Wake time" value={schedule.wakeTime} onChange={(value) => setScheduleLifestyle({ wakeTime: value })} />
            <MetricField label="Bed time" value={schedule.bedTime} onChange={(value) => setScheduleLifestyle({ bedTime: value })} />
          </div>
          <div className="grid-2" style={{ marginTop: 12 }}>
            <MetricField label="Water" value={schedule.water} onChange={(value) => setScheduleLifestyle({ water: value })} />
            <MetricField label="Caffeine" value={schedule.caffeine} onChange={(value) => setScheduleLifestyle({ caffeine: value })} />
          </div>
        </SectionCard>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("schedule"); router.push("/onboarding/health"); }}>Continue</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function HealthLimitationsScreen() {
  const router = useRouter();
  const { state, setHealthLimitations, completeStep, requiresCoachReview } = useOnboardingStore();
  const health = state.healthLimitations;

  return (
    <FlowShell step="health" title="Health & Limitations" subtitle="Keep this calm, private, and non-diagnostic." backHref="/onboarding/schedule">
      <section className="section stack">
        <Card className="program-section-card">
          <div className="eyebrow">Current context</div>
          <div className="stack" style={{ gap: 10, marginTop: 12 }}>
            <MetricField label="Injury history" value={health.injuryHistory} onChange={(value) => setHealthLimitations({ injuryHistory: value })} />
            <MetricField label="Current pain / discomfort" value={health.currentPain} onChange={(value) => setHealthLimitations({ currentPain: value })} />
            <MetricField label="Movement limitations" value={health.movementLimitations.join(", ")} onChange={(value) => setHealthLimitations({ movementLimitations: value.split(",").map((item) => item.trim()).filter(Boolean) })} />
            <MetricField label="ROM limitations" value={health.romLimitations.join(", ")} onChange={(value) => setHealthLimitations({ romLimitations: value.split(",").map((item) => item.trim()).filter(Boolean) })} />
          </div>
        </Card>

        {requiresCoachReview ? (
          <Card className="program-section-card">
            <div className="eyebrow">Coach review required</div>
            <p className="caption" style={{ marginTop: 8 }}>
              A significant limitation was entered. The demo keeps the state visible and routes the plan through review.
            </p>
          </Card>
        ) : null}
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("health"); router.push("/onboarding/nutrition"); }}>Continue</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function NutritionPreferencesScreen() {
  const router = useRouter();
  const { state, setNutritionPreferences, completeStep, canUseNutritionChoice } = useOnboardingStore();
  const nutrition = state.nutritionPreferences;

  return (
    <FlowShell step="nutrition" title="Nutrition Preferences" subtitle="Allergies, restrictions, routine, and flexibility." backHref="/onboarding/health">
      <section className="section stack">
        <SectionCard title="Safety priority" subtitle="Allergy and restriction safety overrides preference.">
          <div className="stack" style={{ gap: 10 }}>
            <ReviewLine label="Allergies" value={nutrition.allergies.join(", ") || "None"} />
            <ReviewLine label="Restrictions" value={nutrition.restrictions.join(", ") || "None"} />
            <ReviewLine label="Intolerances" value={nutrition.intolerances.join(", ") || "None"} />
            <ReviewLine label="Macro visibility" value={nutrition.macroVisibility} />
          </div>
        </SectionCard>

        <SectionCard title="Meal structure">
          <div className="stack" style={{ gap: 12 }}>
            <MetricField label="Meal frequency" value={nutrition.mealFrequency} onChange={(value) => setNutritionPreferences({ mealFrequency: value })} />
            <MetricField label="Meal times" value={nutrition.mealTimes} onChange={(value) => setNutritionPreferences({ mealTimes: value })} />
            <MetricField label="Breakfast preference" value={nutrition.breakfastPreference} onChange={(value) => setNutritionPreferences({ breakfastPreference: value })} />
            <MetricField label="Pre-workout eating" value={nutrition.preWorkoutEating} onChange={(value) => setNutritionPreferences({ preWorkoutEating: value })} />
          </div>
          <div className="caption" style={{ marginTop: 12 }}>
            Example allowed option: {canUseNutritionChoice({ tags: ["eggs", "toast"] }) ? "Eggs & toast" : "Blocked by safety"}
          </div>
        </SectionCard>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("nutrition"); router.push("/onboarding/baseline"); }}>Continue</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function BaselineScreen() {
  const router = useRouter();
  const { state, setBaselineMeasurement, setBaselinePhoto, completeStep } = useOnboardingStore();

  return (
    <FlowShell step="baseline" title="Baseline" subtitle="Measurements and optional private progress photos." backHref="/onboarding/nutrition">
      <section className="section stack">
        <SectionCard title="Measurements" subtitle="Use the same conditions each time.">
          <div className="stack" style={{ gap: 12 }}>
            {state.baseline.measurements.map((measurement) => (
              <MetricField
                key={measurement.type}
                label={measurement.type}
                value={measurement.value}
                suffix={measurement.unit}
                inputMode="decimal"
                onChange={(value) => setBaselineMeasurement(measurement.type as "weight" | "waist" | "hips" | "thigh", value)}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Progress photos" subtitle="Private by default. Front, side, and back remain optional.">
          <div className="onboarding-choice-grid one-column" style={{ marginTop: 8 }}>
            {state.baseline.photos.poses.map((pose) => (
              <ChoiceButton
                key={pose.pose}
                label={pose.label}
                description={`${pose.status} · baseline`}
                selected={pose.status !== "missing"}
                onClick={() => setBaselinePhoto(pose.pose as BaselinePose, pose.status === "captured" ? "retake" : "captured")}
              />
            ))}
          </div>
        </SectionCard>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("baseline"); router.push("/onboarding/review"); }}>Continue</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function FinalReviewScreen() {
  const router = useRouter();
  const { state, completeStep, createProgramProposal } = useOnboardingStore();

  return (
    <FlowShell step="review" title="Final Review" subtitle="Confirm the profile before the plan is built." backHref="/onboarding/baseline">
      <section className="section">
        <SectionTitle title="Final Review" caption="Confirm the profile before the plan is built." />
      </section>

      <section className="section stack">
        <Card className="program-hero-card p-16">
          <div className="stack" style={{ gap: 12 }}>
            <div className="eyebrow">Review summary</div>
            <ReviewLine label="Goal" value={state.goals.mainGoal} />
            <ReviewLine label="Priorities" value={state.goals.priorities.join(" · ")} />
            <ReviewLine label="Training" value={`${state.trainingPreferences.daysPerWeek} days / week · ${state.trainingPreferences.duration}`} />
            <ReviewLine label="Nutrition" value={state.nutritionPreferences.mealFrequency} />
            <ReviewLine label="Baseline" value={state.baseline.successDefinition} />
          </div>
        </Card>

        <SectionCard title="Edit sections">
          <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
            <Link href="/onboarding/profile" className="progress-mini-action">Profile</Link>
            <Link href="/onboarding/goals" className="progress-mini-action">Goals</Link>
            <Link href="/onboarding/schedule" className="progress-mini-action">Schedule</Link>
            <Link href="/onboarding/nutrition" className="progress-mini-action">Nutrition</Link>
          </div>
        </SectionCard>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { createProgramProposal(); completeStep("review"); router.push("/onboarding/building-plan"); }}>Build my plan</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function BuildingPlanScreen() {
  const router = useRouter();
  const { state, completeStep } = useOnboardingStore();

  return (
    <FlowShell step="building-plan" title="Building Your Plan" subtitle="A calm processing state with deterministic fixture generation." backHref="/onboarding/review" rightLabel="Next" rightHref="/onboarding/plan-ready">
      <section className="section stack">
        <Card className="program-hero-card p-16">
          <div className="stack" style={{ gap: 16 }}>
            <div className="eyebrow">Processing</div>
            <h1 className="headline-lg">Building your plan</h1>
            <p className="caption">No fake AI copy. The plan is generated from the structured demo state.</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: "72%" }} />
            </div>
          </div>
        </Card>
        <SectionCard title="Deterministic output">
          <div className="stack" style={{ gap: 10 }}>
            {state.program.weeklyStructure.map((item) => (
              <div key={item} className="row">
                <div className="body-md" style={{ fontWeight: 700 }}>{item}</div>
                <span className="icon muted" aria-hidden="true">sync</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("building-plan"); router.push("/onboarding/plan-ready"); }}>View plan reveal</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function PlanRevealScreen() {
  const router = useRouter();
  const { state, finalizeOnboarding, completeStep } = useOnboardingStore();

  return (
    <FlowShell step="plan-ready" title="Your Plan is Ready" subtitle="Phase 1 is proposed until you start the program." backHref="/onboarding/building-plan">
      <section className="section stack">
        <Card className="program-hero-card p-16">
          <div className="stack" style={{ gap: 12 }}>
            <span className="program-template-chip">{state.program.phaseLabel}</span>
            <h1 className="headline-lg">{state.program.goal}</h1>
            <p className="body-md muted">{state.program.whyItFits}</p>
          </div>
        </Card>

        <SectionCard title="Plan summary">
          <div className="stack" style={{ gap: 10 }}>
            <ReviewLine label="Duration" value={state.program.duration} />
            <ReviewLine label="Weekly structure" value={state.program.weeklyStructure.join(" · ")} />
            <ReviewLine label="First workout" value={state.program.firstWorkout} />
            <ReviewLine label="Nutrition" value={state.program.nutrition} />
            <ReviewLine label="Cardio" value={state.program.cardio} />
            <ReviewLine label="Recovery" value={state.program.recovery} />
            <ReviewLine label="Check-in" value={state.program.checkIn} />
          </div>
        </SectionCard>
      </section>

      <OnboardingStickyActions
        secondary={<SecondaryButton className="focus-ring" onClick={() => router.back()}>Back</SecondaryButton>}
        primary={<PrimaryButton className="focus-ring" onClick={() => { completeStep("plan-ready"); finalizeOnboarding(); router.push("/"); }}>Start my program</PrimaryButton>}
      />
    </FlowShell>
  );
}

export function ProgramOverviewScreen() {
  const { program } = useOnboardingStore();

  return (
    <Screen
      activeTab={undefined}
      shellClassName="screen-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            Program Overview
          </div>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <SectionTitle title="My Program" caption={`${program.phaseLabel} · ${program.status.toUpperCase()}`} />
        </section>

        <section className="section stack">
          <Card className="program-hero-card p-16">
            <div className="stack" style={{ gap: 12 }}>
              <span className="program-template-chip">{program.goal}</span>
              <h2 className="headline-md">{program.duration}</h2>
              <p className="body-md muted">{program.whyItFits}</p>
            </div>
          </Card>
        </section>

        <section className="section stack">
          <SectionCard title="Weekly structure">
            <div className="stack" style={{ gap: 10 }}>
              {program.weeklyStructure.map((item) => (
                <div key={item} className="row">
                  <div className="body-md" style={{ fontWeight: 700 }}>{item}</div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Workout templates">
            <div className="stack" style={{ gap: 10 }}>
              {program.workoutTemplates.map((item) => (
                <div key={item} className="row">
                  <div className="body-md" style={{ fontWeight: 700 }}>{item}</div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Key movements">
            <div className="stack" style={{ gap: 10 }}>
              {program.keyMovements.map((item) => (
                <div key={item} className="row">
                  <div className="body-md" style={{ fontWeight: 700 }}>{item}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </section>

        <section className="section stack">
          <SectionCard title="Progression">{program.progressionSystem}</SectionCard>
          <SectionCard title="Nutrition">{program.nutrition}</SectionCard>
          <SectionCard title="Cardio">{program.cardio}</SectionCard>
          <SectionCard title="Recovery">{program.recovery}</SectionCard>
          <SectionCard title="Habits">{program.habits}</SectionCard>
          <SectionCard title="Check-in">{program.checkIn}</SectionCard>
          <SectionCard title="Review timeline">{program.baselineTimeline.join(" · ")}</SectionCard>
        </section>

        <section className="section stack">
          <Card className="program-section-card">
            <div className="eyebrow">Recent adjustments</div>
            <div className="stack" style={{ marginTop: 12 }}>
              {program.recentAdjustments.map((item) => (
                <div key={item} className="row">
                  <div className="body-md" style={{ fontWeight: 700 }}>{item}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </Screen>
  );
}
