"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Screen } from "@/components/screen";
import { Card, PrimaryButton, SecondaryButton } from "@/components/ui";
import { ChoiceButton, PillToggle } from "@/components/onboarding-ui";
import { useOnboardingStore } from "@/components/onboarding-provider";
import { useProfileSettingsStore } from "@/components/profile-settings-provider";
import { useProgramStore } from "@/components/program-provider";
import { type GoalPriority } from "@/lib/onboarding-data";
import { type NotificationCategory, type NotificationSettings, type ProfileSnapshot } from "@/lib/profile-settings-data";

function ProfileHeader({
  backHref,
  title,
  subtitle,
  brand = false,
  rightAction
}: {
  backHref: string;
  title: string;
  subtitle?: string;
  brand?: boolean;
  rightAction?: ReactNode;
}) {
  return (
    <header className="topbar" style={{ alignItems: "flex-start", paddingTop: "calc(10px + env(safe-area-inset-top, 0px))" }}>
      <Link href={backHref} aria-label="Go back" className="tap-target focus-ring" style={{ flex: "0 0 auto" }}>
        <span className="icon" aria-hidden="true">
          arrow_back
        </span>
      </Link>
      <div style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
        {brand ? (
          <BrandLogo variant="horizontal" width={154} alt="AthlexForce" style={{ margin: "2px auto 0" }} />
        ) : null}
        <h1
          className="headline-md"
          style={{
            margin: brand ? "2px 0 0" : "0",
            fontSize: brand ? 22 : 30,
            lineHeight: brand ? "28px" : "34px",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            textWrap: "balance"
          }}
        >
          {title}
        </h1>
        {subtitle ? <p className="caption" style={{ marginTop: 6, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>{subtitle}</p> : null}
      </div>
      <div style={{ width: 44, display: "flex", justifyContent: "flex-end" }}>
        {rightAction ?? null}
      </div>
    </header>
  );
}

function EditorShell({
  backHref,
  title,
  subtitle,
  brand = false,
  children,
  rightAction
}: {
  backHref: string;
  title: string;
  subtitle?: string;
  brand?: boolean;
  children: ReactNode;
  rightAction?: ReactNode;
}) {
  return (
    <Screen shellClassName="screen-shell" topbar={<ProfileHeader backHref={backHref} title={title} subtitle={subtitle} brand={brand} rightAction={rightAction} />}>
      <main className="content tight">{children}</main>
    </Screen>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  className = ""
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`p-16 ${className}`.trim()}>
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

function TextField({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  suffix
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  suffix?: string;
}) {
  return (
    <label className="stack" style={{ gap: 8 }}>
      <div className="eyebrow">{label}</div>
      <div className="row" style={{ gap: 8, alignItems: "center" }}>
        <input
          className="input-field"
          type={type}
          inputMode={inputMode}
          value={String(value)}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix ? <div className="caption" style={{ whiteSpace: "nowrap" }}>{suffix}</div> : null}
      </div>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="stack" style={{ gap: 8 }}>
      <div className="eyebrow">{label}</div>
      <textarea
        className="input-field"
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        style={{ minHeight: rows * 28, paddingTop: 12, paddingBottom: 12, resize: "vertical" }}
      />
    </label>
  );
}

function ChoiceGrid({
  items,
  selected,
  onSelect,
  oneColumn = false
}: {
  items: Array<{ id: string; label: string; description?: string }>;
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
          selected={selected === item.id}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}

function TogglePills({
  items,
  selected,
  onToggle
}: {
  items: Array<{ id: string; label: string }>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
      {items.map((item) => (
        <PillToggle key={item.id} label={item.label} selected={selected.includes(item.id)} onClick={() => onToggle(item.id)} />
      ))}
    </div>
  );
}

function SwitchRow({
  title,
  subtitle,
  checked,
  onToggle,
  disabled = false
}: {
  title: string;
  subtitle?: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      className="card focus-ring"
      onClick={disabled ? undefined : onToggle}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 16,
        opacity: disabled ? 0.55 : 1
      }}
    >
      <div className="row" style={{ gap: 16, alignItems: "center" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="body-md" style={{ fontSize: 18, fontWeight: 500 }}>
            {title}
          </div>
          {subtitle ? <p className="caption" style={{ marginTop: 8 }}>{subtitle}</p> : null}
        </div>
        <div
          aria-hidden="true"
          style={{
            width: 60,
            height: 34,
            borderRadius: 9999,
            background: checked ? "var(--accent-primary)" : "#2d2d2d",
            position: "relative",
            flex: "0 0 auto",
            transition: "background 180ms ease"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 4,
              left: checked ? 30 : 4,
              width: 26,
              height: 26,
              borderRadius: 9999,
              background: checked ? "#050505" : "#f7f7f7",
              transition: "left 180ms ease, background 180ms ease"
            }}
          />
        </div>
      </div>
    </button>
  );
}

function UnsavedChangesDialog({
  open,
  onKeepEditing,
  onDiscard
}: {
  open: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="progress-modal" role="presentation">
      <div className="progress-modal__backdrop" onClick={onKeepEditing} aria-hidden="true" />
      <div className="progress-modal__sheet" role="dialog" aria-modal="true" aria-labelledby="unsaved-title">
        <div className="stack" style={{ gap: 12 }}>
          <div className="eyebrow">Unsaved changes</div>
          <h2 className="headline-md" id="unsaved-title">
            Leave without saving?
          </h2>
          <p className="caption">Changes on this screen will be lost if you leave now.</p>
          <div className="stack" style={{ gap: 8, marginTop: 8 }}>
            <button className="button-primary focus-ring" type="button" onClick={onDiscard}>
              Discard
            </button>
            <button className="button-secondary focus-ring" type="button" onClick={onKeepEditing}>
              Keep editing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function useUnsavedGuard(isDirty: boolean, backHref: string) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingHrefRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isDirty) {
      return undefined;
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const onPopState = () => {
      pendingHrefRef.current = backHref;
      setConfirmOpen(true);
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("popstate", onPopState);
    };
  }, [backHref, isDirty]);

  const handleBack = () => {
    if (isDirty) {
      pendingHrefRef.current = backHref;
      setConfirmOpen(true);
      return;
    }

    router.push(backHref);
  };

  const discard = () => {
    setConfirmOpen(false);
    const href = pendingHrefRef.current ?? backHref;
    pendingHrefRef.current = null;
    router.push(href);
  };

  return { confirmOpen, handleBack, discard, keepEditing: () => setConfirmOpen(false) };
}

function dirtyFromState(previous: ProfileSnapshot, next: ProfileSnapshot) {
  return JSON.stringify(previous) !== JSON.stringify(next);
}

function useSyncedProfileDraft(saved: ProfileSnapshot) {
  const [draft, setDraft] = useState(saved);
  const lastSavedRef = useRef(saved);

  useEffect(() => {
    if (JSON.stringify(draft) === JSON.stringify(lastSavedRef.current)) {
      setDraft(saved);
    }

    lastSavedRef.current = saved;
  }, [draft, saved]);

  return [draft, setDraft] as const;
}

function saveButtonLabel(saveState: "idle" | "saved" | "error") {
  if (saveState === "error") {
    return "Try again";
  }

  if (saveState === "saved") {
    return "Saved";
  }

  return "Save changes";
}

function EditorFooter({
  dirty,
  saveState,
  onSave,
  onSecondary,
  secondaryLabel = "Back"
}: {
  dirty: boolean;
  saveState: "idle" | "saved" | "error";
  onSave: () => void;
  onSecondary: () => void;
  secondaryLabel?: string;
}) {
  return (
    <div className="stack" style={{ gap: 12, paddingTop: 8 }}>
      <SecondaryButton className="focus-ring" onClick={onSecondary}>
        {secondaryLabel}
      </SecondaryButton>
      <PrimaryButton className="focus-ring" onClick={onSave} disabled={!dirty && saveState === "idle"}>
        {saveButtonLabel(saveState)}
      </PrimaryButton>
    </div>
  );
}

function GoalPriorityRow({
  label,
  index,
  total,
  onMoveUp,
  onMoveDown
}: {
  label: GoalPriority;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="onboarding-reorder-row">
      <div className="onboarding-reorder-index">{index + 1}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="body-md" style={{ fontWeight: 700 }}>
          {label}
        </div>
      </div>
      <button className="tap-target focus-ring" aria-label={`Move ${label} up`} type="button" onClick={onMoveUp} disabled={index === 0}>
        <span className="icon" aria-hidden="true">arrow_upward</span>
      </button>
      <button className="tap-target focus-ring" aria-label={`Move ${label} down`} type="button" onClick={onMoveDown} disabled={index === total - 1}>
        <span className="icon" aria-hidden="true">arrow_downward</span>
      </button>
    </div>
  );
}

export function ProfilePreferencesIndexScreen() {
  const { saved, pendingReview, sectionOrder } = useProfileSettingsStore();

  return (
    <Screen
      shellClassName="screen-shell"
      topbar={
        <header className="topbar" style={{ justifyContent: "center" }}>
          <Link href="/profile" aria-label="Go back" className="tap-target focus-ring" style={{ position: "absolute", left: 16 }}>
            <span className="icon" aria-hidden="true">
              arrow_back
            </span>
          </Link>
          <h1 className="headline-md" style={{ margin: 0, fontSize: 32, lineHeight: "34px", letterSpacing: "-0.04em", textTransform: "uppercase", textAlign: "center", maxWidth: 240 }}>
            Profile & Preferences
          </h1>
        </header>
      }
    >
      <main className="content tight">
        <section className="section stack">
          {sectionOrder.map((section) => (
            <Link key={section.id} href={section.route} className="focus-ring">
              <Card className="p-16" style={{ borderRadius: 20 }}>
                <div className="row" style={{ alignItems: "center", gap: 16 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="body-md" style={{ fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase" }}>
                      {section.label}
                    </div>
                    <p className="body-md" style={{ marginTop: 10, color: "var(--text-muted)" }}>
                      {section.summary}
                    </p>
                  </div>
                  <span className="icon" aria-hidden="true" style={{ color: "var(--text-muted)" }}>
                    chevron_right
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </section>

        <section className="section">
          <Card className="p-16" style={{ borderRadius: 20, background: "var(--surface-elevated)" }}>
            <div className="row" style={{ alignItems: "center", gap: 12 }}>
              <span className="icon" aria-hidden="true" style={{ color: "var(--accent-primary)" }}>
                check_circle
              </span>
              <div style={{ minWidth: 0 }}>
                <div className="caption" style={{ marginBottom: 4 }}>
                  {pendingReview ? "Program update pending" : "No pending program updates"}
                </div>
                <div className="body-md" style={{ fontWeight: 700 }}>
                  {pendingReview ? pendingReview.title : `${saved.profile.name} · profile saved`}
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </Screen>
  );
}

export function ProfilePersonalInfoScreen() {
  const router = useRouter();
  const { saved, commitProfileSnapshot, saveState } = useProfileSettingsStore();
  const [draft, setDraft] = useSyncedProfileDraft(saved);
  const [lastReview, setLastReview] = useState<string | null>(null);
  const guard = useUnsavedGuard(dirtyFromState(saved, draft), "/profile/preferences");

  const save = () => {
    const review = commitProfileSnapshot(draft);
    setLastReview(review.summary);
    router.push("/profile/program-impact-review");
  };

  return (
    <EditorShell backHref="/profile/preferences" title="Profile" subtitle="Question 1 of 4" brand>
      <section className="section">
        <Card className="p-16" style={{ borderRadius: 20 }}>
          <div className="stack" style={{ gap: 16 }}>
            <TextField label="Name" value={draft.profile.name} onChange={(value) => setDraft((current) => ({ ...current, profile: { ...current.profile, name: value } }))} />
            <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 140px" }}>
                <TextField label="Age" type="number" inputMode="numeric" value={draft.profile.age} onChange={(value) => setDraft((current) => ({ ...current, profile: { ...current.profile, age: Number(value || 0) } }))} />
              </div>
              <div style={{ flex: "1 1 140px" }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Timezone</div>
                <Card className="p-16" style={{ borderRadius: 14 }}>
                  <div className="body-md" style={{ fontWeight: 700 }}>Europe/Madrid</div>
                </Card>
              </div>
            </div>
            <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 140px" }}>
                <TextField label="Height" type="number" inputMode="decimal" suffix="cm" value={draft.profile.heightCm} onChange={(value) => setDraft((current) => ({ ...current, profile: { ...current.profile, heightCm: Number(value || 0) } }))} />
              </div>
              <div style={{ flex: "1 1 140px" }}>
                <TextField label="Weight" type="number" inputMode="decimal" suffix="kg" value={draft.profile.weightKg} onChange={(value) => setDraft((current) => ({ ...current, profile: { ...current.profile, weightKg: Number(value || 0) } }))} />
              </div>
            </div>
            <ChoiceGrid
              oneColumn
              selected={draft.profile.unitSystem}
              onSelect={(value) => setDraft((current) => ({ ...current, profile: { ...current.profile, unitSystem: value as "metric" | "imperial" } }))}
              items={[
                { id: "metric", label: "Metric", description: "Centimeters and kilograms" },
                { id: "imperial", label: "Imperial", description: "Feet, inches, and pounds" }
              ]}
            />
          </div>
        </Card>
      </section>

      {lastReview ? (
        <section className="section">
          <Card className="p-16">
            <div className="eyebrow">Saved review</div>
            <p className="body-md" style={{ marginTop: 8 }}>{lastReview}</p>
          </Card>
        </section>
      ) : null}

      <section className="section">
        <EditorFooter dirty={dirtyFromState(saved, draft)} saveState={saveState} onSave={save} onSecondary={guard.handleBack} />
      </section>

      <UnsavedChangesDialog open={guard.confirmOpen} onDiscard={guard.discard} onKeepEditing={guard.keepEditing} />
    </EditorShell>
  );
}

export function ProfileGoalsScreen() {
  const router = useRouter();
  const { saved, commitProfileSnapshot, saveState } = useProfileSettingsStore();
  const [draft, setDraft] = useSyncedProfileDraft(saved);
  const guard = useUnsavedGuard(dirtyFromState(saved, draft), "/profile/preferences");

  const save = () => {
    commitProfileSnapshot(draft);
    router.push("/profile/program-impact-review");
  };

  const togglePriority = (fromIndex: number, toIndex: number) => {
    setDraft((current) => {
      const next = [...current.goals.priorities];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return { ...current, goals: { ...current.goals, priorities: next as GoalPriority[] } };
    });
  };

  return (
    <EditorShell backHref="/profile/preferences" title="Goals" subtitle="Main goal and ordered priorities" brand>
      <section className="section stack">
        <ChoiceGrid
          oneColumn
          selected={draft.goals.mainGoal}
          onSelect={(value) => setDraft((current) => ({ ...current, goals: { ...current.goals, mainGoal: value } }))}
          items={[
            { id: "Body Recomposition", label: "Body Recomposition", description: "Build muscle while tightening up shape" },
            { id: "Build Muscle", label: "Build Muscle", description: "Increase size and strength" },
            { id: "Strength", label: "Strength", description: "Prioritize load progression" },
            { id: "Performance", label: "Performance", description: "Keep conditioning and energy high" }
          ]}
        />

        <Card className="p-16">
          <div className="eyebrow">Priorities</div>
          <p className="caption" style={{ marginTop: 6 }}>Reorder the muscle emphasis. Changes stay immediate in the draft.</p>
          <div className="stack" style={{ marginTop: 12 }}>
            {draft.goals.priorities.map((priority, index) => (
              <GoalPriorityRow
                key={priority}
                label={priority}
                index={index}
                total={draft.goals.priorities.length}
                onMoveUp={() => togglePriority(index, Math.max(0, index - 1))}
                onMoveDown={() => togglePriority(index, Math.min(draft.goals.priorities.length - 1, index + 1))}
              />
            ))}
          </div>
        </Card>
      </section>

      <section className="section">
        <EditorFooter dirty={dirtyFromState(saved, draft)} saveState={saveState} onSave={save} onSecondary={guard.handleBack} />
      </section>

      <UnsavedChangesDialog open={guard.confirmOpen} onDiscard={guard.discard} onKeepEditing={guard.keepEditing} />
    </EditorShell>
  );
}

export function ProfileTrainingPreferencesScreen() {
  const router = useRouter();
  const { saved, commitProfileSnapshot, saveState } = useProfileSettingsStore();
  const [draft, setDraft] = useSyncedProfileDraft(saved);
  const guard = useUnsavedGuard(dirtyFromState(saved, draft), "/profile/preferences");

  const toggleDay = (day: string) => {
    setDraft((current) => ({
      ...current,
      trainingPreferences: {
        ...current.trainingPreferences,
        preferredDays: current.trainingPreferences.preferredDays.includes(day)
          ? current.trainingPreferences.preferredDays.filter((item) => item !== day)
          : [...current.trainingPreferences.preferredDays, day]
      }
    }));
  };

  const toggleEquipment = (item: string) => {
    setDraft((current) => ({
      ...current,
      trainingPreferences: {
        ...current.trainingPreferences,
        equipment: current.trainingPreferences.equipment.includes(item)
          ? current.trainingPreferences.equipment.filter((entry) => entry !== item)
          : [...current.trainingPreferences.equipment, item]
      }
    }));
  };

  const save = () => {
    commitProfileSnapshot(draft);
    router.push("/profile/program-impact-review");
  };

  return (
    <EditorShell backHref="/profile/preferences" title="Edit Training Preferences" subtitle="Update anything that has changed." brand>
      <section className="section stack">
        <SectionCard title="Training days">
          <TextField
            label="Days / week"
            type="number"
            inputMode="numeric"
            value={draft.trainingPreferences.daysPerWeek}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                trainingPreferences: { ...current.trainingPreferences, daysPerWeek: Math.max(1, Math.min(7, Number(value || 0))) }
              }))
            }
          />
          <div className="caption" style={{ marginTop: 8 }}>
            {draft.trainingPreferences.preferredDays.join(", ")}
          </div>
        </SectionCard>

        <SectionCard title="Session duration">
          <TextField label="Duration" value={draft.trainingPreferences.duration} onChange={(value) => setDraft((current) => ({ ...current, trainingPreferences: { ...current.trainingPreferences, duration: value } }))} />
        </SectionCard>

        <SectionCard title="Training location">
          <ChoiceGrid
            oneColumn
            selected={draft.trainingPreferences.location}
            onSelect={(value) => setDraft((current) => ({ ...current, trainingPreferences: { ...current.trainingPreferences, location: value } }))}
            items={[
              { id: "Full gym", label: "Full gym", description: "Commercial gym access" },
              { id: "Home", label: "Home", description: "Minimal equipment" },
              { id: "Hybrid", label: "Hybrid", description: "Mix of gym and home" }
            ]}
          />
        </SectionCard>

        <SectionCard title="Equipment">
          <TogglePills
            items={[
              { id: "Barbell", label: "Barbell" },
              { id: "Dumbbells", label: "Dumbbells" },
              { id: "Cable", label: "Cable" },
              { id: "Machine", label: "Machine" }
            ]}
            selected={draft.trainingPreferences.equipment}
            onToggle={toggleEquipment}
          />
        </SectionCard>

        <SectionCard title="Style and guidance">
          <TextField label="Style" value={draft.trainingPreferences.style} onChange={(value) => setDraft((current) => ({ ...current, trainingPreferences: { ...current.trainingPreferences, style: value } }))} />
          <TextField label="Cardio preference" value={draft.trainingPreferences.cardioPreference} onChange={(value) => setDraft((current) => ({ ...current, trainingPreferences: { ...current.trainingPreferences, cardioPreference: value } }))} />
          <TextField label="Guidance preference" value={draft.trainingPreferences.guidancePreference} onChange={(value) => setDraft((current) => ({ ...current, trainingPreferences: { ...current.trainingPreferences, guidancePreference: value } }))} />
        </SectionCard>

        <SectionCard title="Preferred days">
          <TogglePills
            items={[
              { id: "Mon", label: "Mon" },
              { id: "Tue", label: "Tue" },
              { id: "Wed", label: "Wed" },
              { id: "Thu", label: "Thu" },
              { id: "Fri", label: "Fri" },
              { id: "Sat", label: "Sat" },
              { id: "Sun", label: "Sun" }
            ]}
            selected={draft.trainingPreferences.preferredDays}
            onToggle={toggleDay}
          />
        </SectionCard>
      </section>

      <section className="section">
        <EditorFooter dirty={dirtyFromState(saved, draft)} saveState={saveState} onSave={save} onSecondary={guard.handleBack} />
      </section>

      <UnsavedChangesDialog open={guard.confirmOpen} onDiscard={guard.discard} onKeepEditing={guard.keepEditing} />
    </EditorShell>
  );
}

export function ProfileScheduleLifestyleScreen() {
  const router = useRouter();
  const { saved, commitProfileSnapshot, saveState } = useProfileSettingsStore();
  const [draft, setDraft] = useSyncedProfileDraft(saved);
  const guard = useUnsavedGuard(dirtyFromState(saved, draft), "/profile/preferences");

  const save = () => {
    commitProfileSnapshot(draft);
    router.push("/profile/program-impact-review");
  };

  return (
    <EditorShell backHref="/profile/preferences" title="Schedule & Lifestyle" subtitle="Work, sleep, stress, and reminders" brand>
      <section className="section stack">
        <SectionCard title="Work and energy">
          <TextAreaField label="Work schedule" value={draft.scheduleLifestyle.workSchedule} onChange={(value) => setDraft((current) => ({ ...current, scheduleLifestyle: { ...current.scheduleLifestyle, workSchedule: value } }))} />
          <TextField label="Activity level" value={draft.scheduleLifestyle.activityLevel} onChange={(value) => setDraft((current) => ({ ...current, scheduleLifestyle: { ...current.scheduleLifestyle, activityLevel: value } }))} />
          <TextField label="Available training time" value={draft.scheduleLifestyle.availableTrainingTime} onChange={(value) => setDraft((current) => ({ ...current, scheduleLifestyle: { ...current.scheduleLifestyle, availableTrainingTime: value } }))} />
        </SectionCard>

        <SectionCard title="Recovery rhythm">
          <TextField label="Wake time" value={draft.scheduleLifestyle.wakeTime} onChange={(value) => setDraft((current) => ({ ...current, scheduleLifestyle: { ...current.scheduleLifestyle, wakeTime: value } }))} />
          <TextField label="Bed time" value={draft.scheduleLifestyle.bedTime} onChange={(value) => setDraft((current) => ({ ...current, scheduleLifestyle: { ...current.scheduleLifestyle, bedTime: value } }))} />
          <TextField label="Sleep quality" value={draft.scheduleLifestyle.sleepQuality} onChange={(value) => setDraft((current) => ({ ...current, scheduleLifestyle: { ...current.scheduleLifestyle, sleepQuality: value } }))} />
          <TextField label="Stress" value={draft.scheduleLifestyle.stress} onChange={(value) => setDraft((current) => ({ ...current, scheduleLifestyle: { ...current.scheduleLifestyle, stress: value } }))} />
        </SectionCard>

        <SectionCard title="Notifications">
          <ChoiceGrid
            oneColumn
            selected={draft.scheduleLifestyle.reminderPreference}
            onSelect={(value) => setDraft((current) => ({ ...current, scheduleLifestyle: { ...current.scheduleLifestyle, reminderPreference: value as "push" | "email" | "both" | "none" } }))}
            items={[
              { id: "push", label: "Push", description: "AthlexForce mobile reminders" },
              { id: "email", label: "Email", description: "Simple inbox reminders" },
              { id: "both", label: "Both", description: "Push and email" },
              { id: "none", label: "None", description: "Pause reminders" }
            ]}
          />
        </SectionCard>
      </section>

      <section className="section">
        <EditorFooter dirty={dirtyFromState(saved, draft)} saveState={saveState} onSave={save} onSecondary={guard.handleBack} />
      </section>

      <UnsavedChangesDialog open={guard.confirmOpen} onDiscard={guard.discard} onKeepEditing={guard.keepEditing} />
    </EditorShell>
  );
}

export function ProfileNutritionPreferencesScreen() {
  const router = useRouter();
  const { saved, commitProfileSnapshot, saveState } = useProfileSettingsStore();
  const [draft, setDraft] = useSyncedProfileDraft(saved);
  const guard = useUnsavedGuard(dirtyFromState(saved, draft), "/profile/preferences");

  const toggleList = (field: keyof ProfileSnapshot["nutritionPreferences"], value: string) => {
    setDraft((current) => {
      const nextList = current.nutritionPreferences[field] as string[];
      const updated = nextList.includes(value) ? nextList.filter((item) => item !== value) : [...nextList, value];
      return {
        ...current,
        nutritionPreferences: {
          ...current.nutritionPreferences,
          [field]: updated
        } as ProfileSnapshot["nutritionPreferences"]
      };
    });
  };

  const save = () => {
    commitProfileSnapshot(draft);
    router.push("/profile/program-impact-review");
  };

  return (
    <EditorShell backHref="/profile/preferences" title="Nutrition Preferences" subtitle="Preferences only. Prescription remains separate." brand>
      <section className="section stack">
        <SectionCard title="Routine">
          <TextField label="Meal frequency" value={draft.nutritionPreferences.mealFrequency} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, mealFrequency: value } }))} />
          <TextField label="Meal times" value={draft.nutritionPreferences.mealTimes} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, mealTimes: value } }))} />
          <TextField label="Breakfast preference" value={draft.nutritionPreferences.breakfastPreference} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, breakfastPreference: value } }))} />
          <TextField label="Pre-workout eating" value={draft.nutritionPreferences.preWorkoutEating} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, preWorkoutEating: value } }))} />
        </SectionCard>

        <SectionCard title="Safety first">
          <TextField label="Allergies" value={draft.nutritionPreferences.allergies.join(", ")} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, allergies: value.split(",").map((item) => item.trim()).filter(Boolean) } }))} />
          <TextField label="Intolerances" value={draft.nutritionPreferences.intolerances.join(", ")} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, intolerances: value.split(",").map((item) => item.trim()).filter(Boolean) } }))} />
          <TextField label="Restrictions" value={draft.nutritionPreferences.restrictions.join(", ")} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, restrictions: value.split(",").map((item) => item.trim()).filter(Boolean) } }))} />
        </SectionCard>

        <SectionCard title="Preference profile">
          <TextField label="Budget" value={draft.nutritionPreferences.budget} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, budget: value } }))} />
          <TextField label="Meal prep" value={draft.nutritionPreferences.mealPrep} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, mealPrep: value } }))} />
          <TextField label="Flexibility" value={draft.nutritionPreferences.flexibility} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, flexibility: value } }))} />
          <TextField label="Variety" value={draft.nutritionPreferences.variety} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, variety: value } }))} />
          <TextField label="Support preference" value={draft.nutritionPreferences.supportPreference} onChange={(value) => setDraft((current) => ({ ...current, nutritionPreferences: { ...current.nutritionPreferences, supportPreference: value } }))} />
        </SectionCard>
      </section>

      <section className="section">
        <EditorFooter dirty={dirtyFromState(saved, draft)} saveState={saveState} onSave={save} onSecondary={guard.handleBack} />
      </section>

      <UnsavedChangesDialog open={guard.confirmOpen} onDiscard={guard.discard} onKeepEditing={guard.keepEditing} />
    </EditorShell>
  );
}

export function ProfileHealthLimitationsScreen() {
  const router = useRouter();
  const { saved, commitProfileSnapshot, saveState } = useProfileSettingsStore();
  const [draft, setDraft] = useSyncedProfileDraft(saved);
  const guard = useUnsavedGuard(dirtyFromState(saved, draft), "/profile/preferences");

  const save = () => {
    commitProfileSnapshot(draft);
    router.push("/profile/program-impact-review");
  };

  const toggleLimit = (field: "movementLimitations" | "romLimitations", value: string) => {
    setDraft((current) => {
      const currentList = current.healthLimitations[field];
      const updated = currentList.includes(value) ? currentList.filter((item) => item !== value) : [...currentList, value];
      return {
        ...current,
        healthLimitations: {
          ...current.healthLimitations,
          [field]: updated
        }
      };
    });
  };

  return (
    <EditorShell backHref="/profile/preferences" title="Health & Limitations" subtitle="Update any pain or movement limitations." brand>
      <section className="section stack">
        <SwitchRow
          title="Active pain"
          subtitle={draft.healthLimitations.currentPain || "None"}
          checked={draft.healthLimitations.currentPain.trim().length > 0 && draft.healthLimitations.currentPain.toLowerCase() !== "none"}
          onToggle={() =>
            setDraft((current) => ({
              ...current,
              healthLimitations: {
                ...current.healthLimitations,
                currentPain: current.healthLimitations.currentPain.trim().length > 0 ? "None" : "Knee pain during deep flexion"
              }
            }))
          }
        />

        <Card className="p-16">
          <div className="row" style={{ alignItems: "center", gap: 16 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="eyebrow">Movement limitations</div>
              <div className="body-md" style={{ marginTop: 8, fontWeight: 700 }}>
                {draft.healthLimitations.movementLimitations.length} active
              </div>
              <div className="row" style={{ flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {draft.healthLimitations.movementLimitations.map((item) => (
                  <span key={item} className="pill" style={{ minHeight: 28 }}>{item}</span>
                ))}
              </div>
            </div>
            <span className="icon" aria-hidden="true">
              chevron_right
            </span>
          </div>
          <div className="row" style={{ flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            {["Lumbar", "Knee", "Hip", "Shoulder"].map((item) => (
              <PillToggle key={item} label={item} selected={draft.healthLimitations.movementLimitations.includes(item)} onClick={() => toggleLimit("movementLimitations", item)} />
            ))}
          </div>
        </Card>

        <SectionCard title="Injury history">
          <TextAreaField label="Injury history" value={draft.healthLimitations.injuryHistory} onChange={(value) => setDraft((current) => ({ ...current, healthLimitations: { ...current.healthLimitations, injuryHistory: value } }))} />
          <TextAreaField label="ROM limitations" value={draft.healthLimitations.romLimitations.join(", ")} onChange={(value) => setDraft((current) => ({ ...current, healthLimitations: { ...current.healthLimitations, romLimitations: value.split(",").map((item) => item.trim()).filter(Boolean) } }))} />
          <TextAreaField label="Warning symptoms" value={draft.healthLimitations.warningSymptoms} onChange={(value) => setDraft((current) => ({ ...current, healthLimitations: { ...current.healthLimitations, warningSymptoms: value } }))} />
        </SectionCard>

        <SectionCard title="Context">
          <TextAreaField label="Surgery history" value={draft.healthLimitations.surgeryHistory} onChange={(value) => setDraft((current) => ({ ...current, healthLimitations: { ...current.healthLimitations, surgeryHistory: value } }))} />
          <TextAreaField label="Medication context" value={draft.healthLimitations.medicationContext} onChange={(value) => setDraft((current) => ({ ...current, healthLimitations: { ...current.healthLimitations, medicationContext: value } }))} />
          <TextAreaField label="Digestion" value={draft.healthLimitations.digestion} onChange={(value) => setDraft((current) => ({ ...current, healthLimitations: { ...current.healthLimitations, digestion: value } }))} />
        </SectionCard>
      </section>

      <section className="section">
        <EditorFooter dirty={dirtyFromState(saved, draft)} saveState={saveState} onSave={save} onSecondary={guard.handleBack} />
      </section>

      <UnsavedChangesDialog open={guard.confirmOpen} onDiscard={guard.discard} onKeepEditing={guard.keepEditing} />
    </EditorShell>
  );
}

function NotificationRow({
  category,
  onToggle,
  disabled
}: {
  category: NotificationCategory;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={category.enabled}
      className="card focus-ring"
      onClick={disabled ? undefined : onToggle}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 16,
        opacity: disabled ? 0.55 : 1
      }}
    >
      <div className="row" style={{ alignItems: "center", gap: 16 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="body-md" style={{ fontWeight: 700 }}>
            {category.label}
          </div>
          <p className="caption" style={{ marginTop: 8 }}>{category.description}</p>
        </div>
        <div
          aria-hidden="true"
          style={{
            width: 60,
            height: 34,
            borderRadius: 9999,
            background: category.enabled ? "var(--accent-primary)" : "#2d2d2d",
            position: "relative",
            flex: "0 0 auto"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 4,
              left: category.enabled ? 30 : 4,
              width: 26,
              height: 26,
              borderRadius: 9999,
              background: category.enabled ? "#050505" : "#f7f7f7"
            }}
          />
        </div>
      </div>
    </button>
  );
}

export function ProfileNotificationsScreen() {
  const router = useRouter();
  const { notifications, commitNotifications } = useProfileSettingsStore();
  const [draft, setDraft] = useState<NotificationSettings>(notifications);
  const dirty = JSON.stringify(notifications) !== JSON.stringify(draft);
  const guard = useUnsavedGuard(dirty, "/profile");

  const save = () => {
    commitNotifications(draft);
    router.push("/profile");
  };

  return (
            <EditorShell backHref="/profile" title="NOTIFICATIONS" subtitle="Choose what AthlexForce should remind you about." brand={false}>
      <section className="section stack">
        <Card className="p-16" style={{ background: "var(--surface-elevated)" }}>
          <div className="row" style={{ alignItems: "center", gap: 16 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="headline-md" style={{ fontSize: 28 }}>ATHLEXFORCE NOTIFICATIONS</div>
              <p className="caption" style={{ marginTop: 10 }}>
                Training, progress and coaching reminders.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={draft.masterEnabled}
              className="focus-ring"
              onClick={() => setDraft((current) => ({ ...current, masterEnabled: !current.masterEnabled }))}
              style={{
                width: 70,
                height: 42,
                borderRadius: 9999,
                background: draft.masterEnabled ? "var(--accent-primary)" : "#2d2d2d",
                position: "relative"
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 5,
                  left: draft.masterEnabled ? 36 : 5,
                  width: 32,
                  height: 32,
                  borderRadius: 9999,
                  background: draft.masterEnabled ? "#050505" : "#f7f7f7"
                }}
              />
            </button>
          </div>
          {!draft.masterEnabled ? (
            <p className="caption" style={{ marginTop: 12 }}>
              Delivery is paused. Your reminder preferences stay stored.
            </p>
          ) : null}
        </Card>

        <SectionCard title="Permission">
          <ChoiceGrid
            oneColumn
            selected={draft.permission}
            onSelect={(value) => setDraft((current) => ({ ...current, permission: value as NotificationSettings["permission"] }))}
            items={[
              { id: "not-requested", label: "Not requested", description: "No browser/iOS permission yet" },
              { id: "allowed", label: "Allowed", description: "Notifications can be delivered" },
              { id: "denied", label: "Denied", description: "Delivery is blocked by the device" }
            ]}
          />
        </SectionCard>

        <SectionCard title="Reminder intensity">
          <ChoiceGrid
            oneColumn
            selected={draft.intensity}
            onSelect={(value) => setDraft((current) => ({ ...current, intensity: value as NotificationSettings["intensity"] }))}
            items={[
              { id: "minimal", label: "Minimal", description: "Only the essential prompts" },
              { id: "recommended", label: "Recommended", description: "Balanced support" },
              { id: "more-support", label: "More support", description: "Extra guidance without spam" }
            ]}
          />
        </SectionCard>

        <SectionCard title="Quiet hours">
          <div className="stack" style={{ gap: 12 }}>
            <SwitchRow
              title="Quiet hours enabled"
              subtitle={`${draft.quietHours.start} → ${draft.quietHours.end}`}
              checked={draft.quietHours.enabled}
              onToggle={() => setDraft((current) => ({ ...current, quietHours: { ...current.quietHours, enabled: !current.quietHours.enabled } }))}
            />
            <div className="row" style={{ gap: 12 }}>
              <div style={{ flex: 1 }}>
                <TextField label="Start" value={draft.quietHours.start} onChange={(value) => setDraft((current) => ({ ...current, quietHours: { ...current.quietHours, start: value } }))} />
              </div>
              <div style={{ flex: 1 }}>
                <TextField label="End" value={draft.quietHours.end} onChange={(value) => setDraft((current) => ({ ...current, quietHours: { ...current.quietHours, end: value } }))} />
              </div>
            </div>
            <div className="caption">Timezone: {draft.quietHours.timezone}</div>
          </div>
        </SectionCard>

        <div className="stack" style={{ gap: 12 }}>
          <div className="eyebrow">Categories</div>
          {draft.categories.map((category) => (
            <NotificationRow
              key={category.id}
              category={category}
              onToggle={() =>
                setDraft((current) => ({
                  ...current,
                  categories: current.categories.map((item) => (item.id === category.id ? { ...item, enabled: !item.enabled } : item))
                }))
              }
              disabled={!draft.masterEnabled}
            />
          ))}
        </div>

        <SectionCard title="Adaptive alerts">
          <div className="body-md" style={{ fontWeight: 700 }}>
            Calendar, workout, and check-in reminders stay coordinated with the demo athlete state.
          </div>
          <p className="caption" style={{ marginTop: 8 }}>
            Reminder preferences are stored locally and can be restored after toggling the master switch.
          </p>
        </SectionCard>
      </section>

      <section className="section">
        <EditorFooter dirty={dirty} saveState="idle" onSave={save} onSecondary={guard.handleBack} />
      </section>

      <UnsavedChangesDialog open={guard.confirmOpen} onDiscard={guard.discard} onKeepEditing={guard.keepEditing} />
    </EditorShell>
  );
}

export function ProfileImpactReviewScreen() {
  const router = useRouter();
  const { pendingReview, saved, applyPendingReview, clearPendingReview } = useProfileSettingsStore();
  const program = useProgramStore().program ?? useOnboardingStore().program;
  const review = pendingReview ?? {
    classification: "NO_IMPACT" as const,
    title: "No program change required.",
    summary: "The profile is saved and the active program can stay as-is.",
    whatChanged: [],
    currentProgram: [program.phaseLabel, program.goal, program.duration],
    potentialImpact: ["No meaningful difference from the saved profile."],
    recommendedAction: "No program rebuild is required."
  };

  const canApply = review.classification === "PROGRAM_ADJUSTMENT_RECOMMENDED" || review.classification === "MINOR_REVIEW";

  return (
    <Screen
      shellClassName="screen-shell"
      topbar={
        <header className="topbar" style={{ justifyContent: "space-between" }}>
          <BrandLogo variant="horizontal" width={132} alt="AthlexForce" />
          <button aria-label="Close" className="tap-target focus-ring" type="button" onClick={() => router.push("/profile/preferences")}>
            <span className="icon" aria-hidden="true">
              close
            </span>
          </button>
        </header>
      }
    >
      <main className="content tight">
        <section className="section" style={{ textAlign: "center" }}>
          <div className="card p-16" style={{ borderRadius: 20, minHeight: 160, display: "grid", placeItems: "center" }}>
            <div className="stack" style={{ gap: 12, width: "100%" }}>
              <div style={{ width: 96, height: 96, margin: "0 auto", borderRadius: 9999, background: "rgba(182,255,0,0.1)", display: "grid", placeItems: "center" }}>
                <span className="icon" style={{ color: "var(--accent-primary)", fontSize: 40 }} aria-hidden="true">
                  analytics
                </span>
              </div>
              <h1 className="headline-md" style={{ textTransform: "uppercase", margin: 0 }}>
                {review.title}
              </h1>
              <p className="body-md" style={{ color: "var(--text-muted)", margin: 0 }}>
                {review.summary}
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="eyebrow">What changed</div>
            <div className="stack" style={{ gap: 10, marginTop: 12 }}>
              {review.whatChanged.length > 0 ? (
                review.whatChanged.map((change) => (
                  <div key={`${change.field}-${change.before}`} className="row" style={{ alignItems: "flex-start", gap: 12 }}>
                    <div style={{ minWidth: 104 }}>
                      <div className="eyebrow" style={{ marginBottom: 4 }}>{change.field}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div className="body-md" style={{ fontWeight: 700 }}>{change.before}</div>
                      <div className="caption" style={{ marginTop: 4 }}>→ {change.after}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="caption">No field changes detected.</p>
              )}
            </div>
          </Card>
        </section>

        <section className="section stack">
          <SectionCard title="Current program">
            {review.currentProgram.map((line) => (
              <div key={line} className="body-md" style={{ fontWeight: 700 }}>
                {line}
              </div>
            ))}
          </SectionCard>
          <SectionCard title="Potential impact">{review.potentialImpact[0]}</SectionCard>
          <SectionCard title="Recommended action">{review.recommendedAction}</SectionCard>
        </section>

        <section className="section">
          <div className="stack" style={{ gap: 12 }}>
            {canApply ? (
              <PrimaryButton
                className="focus-ring"
                onClick={() => {
                  applyPendingReview();
                  router.push("/profile");
                }}
              >
                Apply program update
              </PrimaryButton>
            ) : (
              <PrimaryButton className="focus-ring" onClick={() => router.push("/profile")}>Done</PrimaryButton>
            )}
            <SecondaryButton
              className="focus-ring"
              onClick={() => {
                clearPendingReview();
                router.push("/profile");
              }}
            >
              {review.classification === "NO_IMPACT" ? "Back" : "Save profile only"}
            </SecondaryButton>
          </div>
        </section>
      </main>
    </Screen>
  );
}
