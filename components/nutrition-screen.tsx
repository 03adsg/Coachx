"use client";

import Link from "next/link";
import { useState } from "react";
import { Screen } from "@/components/screen";
import { Card, PrimaryButton } from "@/components/ui";
import { NutritionMealSheet } from "@/components/nutrition-meal-sheet";
import { NutritionProvider, useNutritionSession } from "@/components/nutrition-provider";
import {
  getMealSlotStatusLabel,
  getNutritionDay,
  getSafeMealOptions,
  type MacroSummary,
  type MealSlot,
  type NutritionSafetyProfile
} from "@/lib/nutrition-data";

type NutritionScreenMode = "ready" | "loading" | "empty" | "error";

interface NutritionScreenProps {
  dateKey: string;
  mode: NutritionScreenMode;
}

function formatMacro(summary: MacroSummary) {
  return `${summary.calories} kcal · ${summary.protein}P / ${summary.carbs}C / ${summary.fat}F`;
}

function MetricBar({ label, current, target }: { label: string; current: number; target: number }) {
  const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <div className="nutrition-progress-row">
      <div className="row" style={{ marginBottom: 6 }}>
        <span className="body-md" style={{ fontWeight: 700 }}>
          {label}
        </span>
        <span className="caption">
          <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{current}</span> / {target}
        </span>
      </div>
      <div className="nutrition-progress-track">
        <div className="nutrition-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function MealCard({
  slot,
  safetyProfile,
  onOpenChooser,
  onMarkEaten,
  onMarkCompleted
}: {
  slot: MealSlot;
  safetyProfile: NutritionSafetyProfile;
  onOpenChooser: (slot: MealSlot) => void;
  onMarkEaten: (slotId: string) => void;
  onMarkCompleted: (slotId: string) => void;
}) {
  const selectedOption = slot.selectedOptionId ? slot.options.find((option) => option.id === slot.selectedOptionId) ?? null : null;
  const safeOptions = getSafeMealOptions(slot, safetyProfile);
  const canChoose = safeOptions.length > 0;
  const actionLabel =
    slot.state === "completed"
      ? "VIEW OPTIONS"
      : slot.state === "selected"
        ? "MARK EATEN"
        : slot.state === "eaten"
          ? "MARK COMPLETE"
          : slot.isNext
            ? "CHOOSE OPTION"
            : "VIEW OPTIONS";

  const handleAction = () => {
    if (slot.state === "selected") {
      onMarkEaten(slot.id);
      return;
    }

    if (slot.state === "eaten") {
      onMarkCompleted(slot.id);
      return;
    }

    if (canChoose) {
      onOpenChooser(slot);
    }
  };

  return (
    <Card className={`nutrition-meal-card p-16 ${slot.isNext ? "nutrition-meal-card--next" : ""} ${slot.state === "completed" ? "nutrition-meal-card--completed" : ""}`.trim()}>
      <div className="nutrition-meal-card__header">
        <div className="nutrition-meal-card__copy">
          <div className="nutrition-meal-card__label-row">
            <span className={`pill nutrition-meal-card__pill ${slot.state === "completed" ? "nutrition-meal-card__pill--complete" : ""}`}>
              {slot.state === "completed" ? "COMPLETED" : slot.isNext ? `NEXT: ${slot.label.toUpperCase()}` : slot.label.toUpperCase()}
            </span>
            <span className="caption nutrition-meal-card__status">{getMealSlotStatusLabel(slot)}</span>
          </div>
          <h3 className={`headline-md nutrition-meal-card__title ${slot.state === "completed" ? "nutrition-meal-card__title--complete" : ""}`.trim()}>
            {slot.state === "completed" && selectedOption
              ? selectedOption.name
              : slot.isNext
                ? "Choose your meal"
                : slot.label === "Breakfast" && selectedOption
                  ? selectedOption.name
                  : slot.label}
          </h3>
          <p className="caption nutrition-meal-card__subtitle">{selectedOption ? selectedOption.summary : slot.description}</p>
        </div>
        <span className="nutrition-meal-card__macro">{slot.target.calories} kcal</span>
      </div>

      <div className="nutrition-meal-card__media">
        {slot.label === "Breakfast" && selectedOption?.image ? (
          <img alt={selectedOption.name} className="nutrition-meal-thumb" src={selectedOption.image} width={64} height={64} />
        ) : slot.isNext ? (
          <div className="nutrition-meal-card__thumb-row" aria-hidden="true">
            <div className="nutrition-meal-thumb nutrition-meal-thumb--skeleton" />
            <div className="nutrition-meal-thumb nutrition-meal-thumb--skeleton" />
            <div className="nutrition-meal-thumb nutrition-meal-thumb--skeleton" />
          </div>
        ) : null}

        <div className="nutrition-meal-card__action">
          <button
            className={`button-secondary focus-ring nutrition-meal-card__button ${slot.state === "completed" ? "nutrition-meal-card__button--secondary" : ""}`.trim()}
            disabled={!canChoose && slot.state !== "selected" && slot.state !== "eaten"}
            onClick={handleAction}
            type="button"
          >
            {actionLabel}
          </button>
          {slot.state === "completed" ? null : (
            <span className="caption nutrition-meal-card__macro-summary">{formatMacro(slot.target)}</span>
          )}
          {!canChoose && slot.state !== "selected" && slot.state !== "eaten" ? (
            <span className="caption nutrition-meal-card__macro-summary">No safe options available</span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function NutritionDayContent({ dateKey }: { dateKey: string }) {
  const { day, selectMealOption, markMealEaten, markMealCompleted, addHydration, toggleSupplement } = useNutritionSession();
  const [openSlotId, setOpenSlotId] = useState<string | null>(null);
  const [draftOptionId, setDraftOptionId] = useState<string | null>(null);

  const activeSlot = day.mealSlots.find((slot) => slot.id === openSlotId) ?? null;
  const safeOptions = activeSlot ? getSafeMealOptions(activeSlot, day.safetyProfile) : [];

  const openChooser = (slot: MealSlot) => {
    const options = getSafeMealOptions(slot, day.safetyProfile);
    if (options.length === 0) {
      return;
    }

    setOpenSlotId(slot.id);
    setDraftOptionId(slot.selectedOptionId ?? options[0]?.id ?? null);
  };

  const closeChooser = () => {
    setOpenSlotId(null);
    setDraftOptionId(null);
  };

  const confirmChoice = () => {
    if (!activeSlot || !draftOptionId) {
      return;
    }

    selectMealOption(activeSlot.id, draftOptionId);
    closeChooser();
  };

  return (
    <Screen
      activeTab="calendar"
      shellClassName="nutrition-shell"
      topbar={
        <header className="topbar nutrition-topbar">
          <Link aria-label="Back to day detail" className="tap-target focus-ring" href={`/day/${dateKey}`}>
            <span className="icon" aria-hidden="true">
              arrow_back
            </span>
          </Link>
          <div className="nutrition-topbar__copy">
            <h1 className="headline-md nutrition-topbar__title">NUTRITION</h1>
            <p className="caption">{day.calendarLabel}</p>
          </div>
          <span className="nutrition-topbar__spacer" aria-hidden="true" />
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <Card className="nutrition-hero-card p-16 elevated">
            <div className="nutrition-hero-card__badge-row">
              <span className="pill">{day.target.label}</span>
              <span className="nutrition-hero-card__subtitle">{day.subtitle}</span>
            </div>
            <div className="nutrition-hero-card__target">
              <span className="metric nutrition-hero-card__calories">{day.target.calories.toLocaleString()}</span>
              <span className="eyebrow" style={{ margin: 0 }}>
                KCAL TARGET
              </span>
            </div>
            <div className="nutrition-hero-card__macros">
              <div className="nutrition-hero-card__macro">
                <span className="headline-md">{day.target.protein}</span>
                <span className="eyebrow">PROTEIN</span>
              </div>
              <div className="nutrition-hero-card__macro nutrition-hero-card__macro--divider">
                <span className="headline-md">{day.target.carbs}</span>
                <span className="eyebrow">CARBS</span>
              </div>
              <div className="nutrition-hero-card__macro">
                <span className="headline-md">{day.target.fat}</span>
                <span className="eyebrow">FAT</span>
              </div>
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="nutrition-section-label">DAILY PROGRESS</div>
          <Card className="nutrition-progress-card p-16">
            <MetricBar label="Calories" current={day.progress.calories} target={day.target.calories} />
            <div className="nutrition-progress-grid">
              <MetricBar label="Protein" current={day.progress.protein} target={day.target.protein} />
              <MetricBar label="Carbs" current={day.progress.carbs} target={day.target.carbs} />
              <MetricBar label="Fat" current={day.progress.fat} target={day.target.fat} />
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="nutrition-section-label">TODAY&apos;S MEALS</div>
          <div className="stack">
            {day.mealSlots.map((slot) => (
              <MealCard
                key={slot.id}
                onMarkCompleted={markMealCompleted}
                onMarkEaten={markMealEaten}
                onOpenChooser={openChooser}
                safetyProfile={day.safetyProfile}
                slot={slot}
              />
            ))}
          </div>
        </section>

        <div className="grid-2">
          <Card className="nutrition-support-card p-16">
            <div className="nutrition-support-card__label">
              <span className="nutrition-support-card__icon" aria-hidden="true">
                water_drop
              </span>
              HYDRATION
            </div>
            <div className="nutrition-support-card__value">
              <span className="headline-md">{(day.hydration.currentMl / 1000).toFixed(1)}</span>
              <span className="caption">/ {(day.hydration.targetMl / 1000).toFixed(1)} L</span>
            </div>
            <div className="nutrition-progress-track nutrition-support-card__track">
              <div
                className="nutrition-progress-fill nutrition-progress-fill--blue"
                style={{ width: `${Math.min(100, Math.round((day.hydration.currentMl / day.hydration.targetMl) * 100))}%` }}
              />
            </div>
            <div className="nutrition-support-card__actions">
              {day.hydration.quickAddMl.map((amountMl) => (
                <button
                  key={amountMl}
                  className="button-secondary focus-ring nutrition-support-card__button"
                  onClick={() => addHydration(amountMl)}
                  type="button"
                >
                  +{amountMl} ML
                </button>
              ))}
            </div>
          </Card>

          <Card className="nutrition-support-card p-16">
            <div className="nutrition-support-card__label">
              <span className="nutrition-support-card__icon nutrition-support-card__icon--purple" aria-hidden="true">
                medication
              </span>
              SUPPLEMENTS
            </div>
            <div className="nutrition-supplement-list">
              {day.supplements.map((supplement) => (
                <button
                  key={supplement.id}
                  className="nutrition-supplement-row focus-ring"
                  onClick={() => toggleSupplement(supplement.id)}
                  type="button"
                >
                  <span className={`nutrition-supplement-row__box ${supplement.checked ? "checked" : ""}`}>
                    {supplement.checked ? (
                      <span className="icon filled" aria-hidden="true">
                        check
                      </span>
                    ) : null}
                  </span>
                  <span className={`caption ${supplement.checked ? "nutrition-supplement-row__label--complete" : ""}`.trim()}>
                    {supplement.label}
                  </span>
                  <span className="caption nutrition-supplement-row__dose">{supplement.dosage}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <section className="section">
          <Card className="nutrition-note-card p-16">
            <div className="nutrition-note-card__icon">
              <span className="icon filled" aria-hidden="true">
                record_voice_over
              </span>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6, color: "var(--accent-primary)" }}>
                COACH NOTE
              </div>
              <p className="caption nutrition-note-card__copy">{day.coachNote}</p>
            </div>
          </Card>
        </section>
      </main>

      {activeSlot ? (
        <NutritionMealSheet
          onClose={closeChooser}
          onConfirm={confirmChoice}
          onSelectOption={(optionId) => setDraftOptionId(optionId)}
          options={safeOptions}
          selectedOptionId={draftOptionId}
          slot={activeSlot}
        />
      ) : null}
    </Screen>
  );
}

function NutritionStateScreen({
  dateKey,
  mode
}: {
  dateKey: string;
  mode: Exclude<NutritionScreenMode, "ready">;
}) {
  const day = getNutritionDay(dateKey);

  return (
    <Screen
      activeTab="calendar"
      shellClassName="nutrition-shell"
      topbar={
        <header className="topbar nutrition-topbar">
          <Link aria-label="Back to day detail" className="tap-target focus-ring" href={`/day/${dateKey}`}>
            <span className="icon" aria-hidden="true">
              arrow_back
            </span>
          </Link>
          <div className="nutrition-topbar__copy">
            <h1 className="headline-md nutrition-topbar__title">NUTRITION</h1>
            <p className="caption">{day.calendarLabel}</p>
          </div>
          <span className="nutrition-topbar__spacer" aria-hidden="true" />
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <Card className="nutrition-state-card p-16 elevated">
            <div className="nutrition-state-card__eyebrow">{mode.toUpperCase()}</div>
            <h1 className="headline-md" style={{ marginTop: 10 }}>
              {mode === "loading" ? "Nutrition plan loading" : mode === "empty" ? "No nutrition plan" : "Nutrition data unavailable"}
            </h1>
            <p className="caption" style={{ marginTop: 8 }}>
              {mode === "loading"
                ? "The nutrition shell is preparing the day and syncing the local demo state."
                : mode === "empty"
                  ? "There is no nutrition plan for this day yet."
                  : "The nutrition demo state could not be rendered. Try again from the current day."}
            </p>
            {mode === "error" ? (
              <div style={{ marginTop: 16 }}>
                <PrimaryButton href={`/day/${dateKey}/nutrition`} className="focus-ring">
                  Retry
                </PrimaryButton>
              </div>
            ) : null}
          </Card>
        </section>
      </main>
    </Screen>
  );
}

export function NutritionScreen({ dateKey, mode }: NutritionScreenProps) {
  if (mode !== "ready") {
    return <NutritionStateScreen dateKey={dateKey} mode={mode} />;
  }

  return (
    <NutritionProvider dateKey={dateKey}>
      <NutritionDayContent dateKey={dateKey} />
    </NutritionProvider>
  );
}
