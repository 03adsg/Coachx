import { createNutritionDayForDate, type MacroSummary, type NutritionDay, type NutritionDayType, type NutritionSafetyProfile, type NutritionTarget } from "@/lib/nutrition-data";
import type { ProgramDaySummary } from "@/lib/program-service";

export type NutritionPlanStatus = "proposed" | "active" | "completed" | "archived";
export type NutritionDayStatus = "planned" | "in_progress" | "completed";
export type NutritionSelectionStatus = "selected" | "eaten" | "skipped";
export type NutritionMeasurementBasis = "raw" | "cooked" | "prepared" | "serving" | "unit";
export type NutritionSupplementStatus = "pending" | "completed";

export interface NutritionPlanSnapshot {
  id: string;
  userId: string;
  programId: string | null;
  status: NutritionPlanStatus;
  name: string;
  dailyTargets: MacroSummary;
  fiberTargetG: number | null;
  waterTargetMl: number | null;
  startedAt: string;
  endedAt: string | null;
  metadata: Record<string, unknown> | null;
}

export interface NutritionSelectionRecord {
  mealSlotId: string;
  mealOptionId: string;
  status: NutritionSelectionStatus;
  selectedAt: string;
  eatenAt: string | null;
  completedAt: string | null;
}

export interface NutritionHydrationLog {
  id: string;
  amountMl: number;
  loggedAt: string;
}

export interface NutritionSupplementLog {
  supplementId: string;
  label: string;
  dosage: string;
  status: NutritionSupplementStatus;
  completedAt: string | null;
}

export interface NutritionDaySnapshot {
  id: string;
  userId: string;
  nutritionPlanId: string;
  programPhaseId: string | null;
  scheduledWorkoutId: string | null;
  calendarDate: string;
  dayType: NutritionDayType;
  status: NutritionDayStatus;
  target: NutritionTarget;
  waterTargetMl: number | null;
  title: string;
  subtitle: string;
  coachNote: string;
  nutritionPrescription: string;
  nutritionPreferences: string[];
  safetyProfile: NutritionSafetyProfile;
  mealSlots: NutritionDay["mealSlots"];
  hydrationTargetMl: number;
  hydrationQuickAddMl: number[];
  supplements: NutritionDay["supplements"];
}

export interface NutritionStoreSnapshot {
  version: 1;
  plan: NutritionPlanSnapshot;
  day: NutritionDaySnapshot;
  selections: NutritionSelectionRecord[];
  hydrationLogs: NutritionHydrationLog[];
  supplementLogs: NutritionSupplementLog[];
  updatedAt: string;
}

export interface NutritionAdherenceSummary {
  plannedMeals: number;
  selectedMeals: number;
  eatenMeals: number;
  completedMeals: number;
  caloriesConsumed: number;
  caloriesTarget: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  hydrationMl: number;
  hydrationTargetMl: number;
  supplementsCompleted: number;
  supplementsTotal: number;
}

export interface NutritionDayContext {
  dateKey: string;
  dayType: NutritionDayType;
  daySummary: ProgramDaySummary | null;
}

export function normalizeNutritionDateKey(dateKey: string) {
  return dateKey.slice(0, 10);
}

export function deriveNutritionDayType(daySummary: ProgramDaySummary | null | undefined): NutritionDayType {
  return daySummary?.isRestDay ? "rest" : "training";
}

export function resolveNutritionDayContext(dateKey: string, daySummary: ProgramDaySummary | null | undefined): NutritionDayContext {
  return {
    dateKey: normalizeNutritionDateKey(dateKey),
    dayType: deriveNutritionDayType(daySummary),
    daySummary: daySummary ?? null
  };
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneNutritionDay(day: NutritionDay): NutritionDay {
  return JSON.parse(JSON.stringify(day)) as NutritionDay;
}

function hydrationTotalFromLogs(logs: NutritionHydrationLog[]) {
  return logs.reduce((total, entry) => total + entry.amountMl, 0);
}

function selectionStatusLabel(selection: NutritionSelectionRecord | undefined): NutritionDay["mealSlots"][number]["state"] {
  if (!selection) {
    return "planned";
  }

  if (selection.completedAt) {
    return "completed";
  }

  if (selection.eatenAt) {
    return "eaten";
  }

  return "selected";
}

function calculateCompletedMealMacros(snapshot: NutritionStoreSnapshot) {
  return snapshot.selections.reduce<MacroSummary>(
    (accumulator, selection) => {
      if (!selection.eatenAt && !selection.completedAt) {
        return accumulator;
      }

      const slot = snapshot.day.mealSlots.find((candidate) => candidate.id === selection.mealSlotId);
      const option = slot?.options.find((candidate) => candidate.id === selection.mealOptionId);

      if (!option) {
        return accumulator;
      }

      return {
        calories: accumulator.calories + option.macro.calories,
        protein: accumulator.protein + option.macro.protein,
        carbs: accumulator.carbs + option.macro.carbs,
        fat: accumulator.fat + option.macro.fat
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function createNutritionPlanSnapshot(userId: string, day: NutritionDay, programId: string | null): NutritionPlanSnapshot {
  return {
    id: createId(),
    userId,
    programId,
    status: "active",
    name: day.dayType === "rest" ? "Recovery Nutrition Plan" : "Training Nutrition Plan",
    dailyTargets: { ...day.target },
    fiberTargetG: null,
    waterTargetMl: day.hydration.targetMl,
    startedAt: new Date().toISOString(),
    endedAt: null,
    metadata: {
      dayType: day.dayType,
      subtitle: day.subtitle,
      title: day.title
    }
  };
}

function selectionRecordFromMealSlot(slot: NutritionDay["mealSlots"][number]): NutritionSelectionRecord | null {
  if (!slot.selectedOptionId) {
    return null;
  }

  return {
    mealSlotId: slot.id,
    mealOptionId: slot.selectedOptionId,
    status: slot.state === "completed" ? "eaten" : slot.state === "eaten" ? "eaten" : "selected",
    selectedAt: new Date().toISOString(),
    eatenAt: slot.state === "selected" ? null : new Date().toISOString(),
    completedAt: slot.state === "completed" ? new Date().toISOString() : null
  };
}

function supplementRecordFromReminder(reminder: NutritionDay["supplements"][number]): NutritionSupplementLog {
  return {
    supplementId: reminder.id,
    label: reminder.label,
    dosage: reminder.dosage,
    status: reminder.checked ? "completed" : "pending",
    completedAt: reminder.checked ? new Date().toISOString() : null
  };
}

export function createNutritionStoreSnapshot(dateKey: string, daySummary?: ProgramDaySummary | null, userId = "demo-user", programId: string | null = null): NutritionStoreSnapshot {
  const context = resolveNutritionDayContext(dateKey, daySummary);
  const sourceDay = createNutritionDayForDate(dateKey, context.dayType);
  const plan = createNutritionPlanSnapshot(userId, sourceDay, programId);
  const selections = sourceDay.mealSlots.map(selectionRecordFromMealSlot).filter(Boolean) as NutritionSelectionRecord[];
  const hydrationLogs: NutritionHydrationLog[] = sourceDay.hydration.currentMl > 0 ? [{ id: createId(), amountMl: sourceDay.hydration.currentMl, loggedAt: new Date().toISOString() }] : [];
  const supplementLogs = sourceDay.supplements.map(supplementRecordFromReminder);

  return {
    version: 1,
    plan,
    day: {
      id: createId(),
      userId,
      nutritionPlanId: plan.id,
      programPhaseId: null,
      scheduledWorkoutId: daySummary?.scheduledWorkoutId ?? null,
      calendarDate: normalizeNutritionDateKey(dateKey),
      dayType: context.dayType,
      status: sourceDay.mealSlots.every((slot) => slot.state === "completed")
        ? "completed"
        : sourceDay.mealSlots.some((slot) => slot.state !== "planned")
          ? "in_progress"
          : "planned",
      target: { ...sourceDay.target },
      waterTargetMl: sourceDay.hydration.targetMl,
      title: sourceDay.title,
      subtitle: sourceDay.subtitle,
      coachNote: sourceDay.coachNote,
      nutritionPrescription: sourceDay.nutritionPrescription,
      nutritionPreferences: [...sourceDay.nutritionPreferences],
      safetyProfile: {
        allergies: [...sourceDay.safetyProfile.allergies],
        restrictions: [...sourceDay.safetyProfile.restrictions],
        intolerances: [...sourceDay.safetyProfile.intolerances],
        preferences: [...sourceDay.safetyProfile.preferences],
        budget: [...sourceDay.safetyProfile.budget],
        variety: [...sourceDay.safetyProfile.variety]
      },
      mealSlots: sourceDay.mealSlots.map((slot) => ({
        ...slot
      })),
      hydrationTargetMl: sourceDay.hydration.targetMl,
      hydrationQuickAddMl: [...sourceDay.hydration.quickAddMl],
      supplements: sourceDay.supplements.map((reminder) => ({ ...reminder }))
    },
    selections,
    hydrationLogs,
    supplementLogs,
    updatedAt: new Date().toISOString()
  };
}

export function buildNutritionDayView(snapshot: NutritionStoreSnapshot): NutritionDay {
  const day = cloneNutritionDay(createNutritionDayForDate(snapshot.day.calendarDate, snapshot.day.dayType));
  const baseMealSlots = snapshot.day.mealSlots;
  const selectionMap = new Map(snapshot.selections.map((selection) => [selection.mealSlotId, selection]));
  const selectedSlots = baseMealSlots.map((slot) => {
    const selection = selectionMap.get(slot.id) ?? null;

    return {
      ...slot,
      selectedOptionId: selection?.mealOptionId ?? slot.selectedOptionId,
      state: selection ? selectionStatusLabel(selection) : slot.state,
      isNext: !selection && slot.isNext
    };
  });
  const hydrationTotal = hydrationTotalFromLogs(snapshot.hydrationLogs);
  const supplements = day.supplements.map((reminder) => {
    const log = snapshot.supplementLogs.find((entry) => entry.supplementId === reminder.id);
    return {
      ...reminder,
      checked: log?.status === "completed"
    };
  });

  return {
    ...day,
      target: { ...snapshot.day.target },
    title: snapshot.day.title,
    subtitle: snapshot.day.subtitle,
    coachNote: snapshot.day.coachNote,
    nutritionPrescription: snapshot.day.nutritionPrescription,
    nutritionPreferences: [...snapshot.day.nutritionPreferences],
    safetyProfile: {
      allergies: [...snapshot.day.safetyProfile.allergies],
      restrictions: [...snapshot.day.safetyProfile.restrictions],
      intolerances: [...snapshot.day.safetyProfile.intolerances],
      preferences: [...snapshot.day.safetyProfile.preferences],
      budget: [...snapshot.day.safetyProfile.budget],
      variety: [...snapshot.day.safetyProfile.variety]
    },
    mealSlots: selectedSlots,
    progress: { ...day.progress },
    hydration: {
      currentMl: hydrationTotal,
      targetMl: snapshot.day.hydrationTargetMl,
      quickAddMl: [...snapshot.day.hydrationQuickAddMl]
    },
    supplements
  };
}

export function applyMealSelection(snapshot: NutritionStoreSnapshot, slotId: string, optionId: string) {
  const now = new Date().toISOString();
  const nextSelections = snapshot.selections.filter((selection) => selection.mealSlotId !== slotId);
  const updatedSelection: NutritionSelectionRecord = {
    mealSlotId: slotId,
    mealOptionId: optionId,
    status: "selected",
    selectedAt: now,
    eatenAt: null,
    completedAt: null
  };
  nextSelections.push(updatedSelection);

  return {
    ...snapshot,
    selections: nextSelections.sort((left, right) => left.mealSlotId.localeCompare(right.mealSlotId)),
    updatedAt: now
  };
}

export function markMealEaten(snapshot: NutritionStoreSnapshot, slotId: string) {
  const now = new Date().toISOString();

  return {
    ...snapshot,
    selections: snapshot.selections.map((selection) =>
      selection.mealSlotId === slotId
        ? ({
            ...selection,
            status: "eaten",
            eatenAt: selection.eatenAt ?? now
          } satisfies NutritionSelectionRecord)
        : selection
    ),
    updatedAt: now
  };
}

export function markMealCompleted(snapshot: NutritionStoreSnapshot, slotId: string) {
  const now = new Date().toISOString();

  return {
    ...snapshot,
    selections: snapshot.selections.map((selection) =>
      selection.mealSlotId === slotId
        ? ({
            ...selection,
            status: "eaten",
            eatenAt: selection.eatenAt ?? now,
            completedAt: now
          } satisfies NutritionSelectionRecord)
        : selection
    ),
    updatedAt: now
  };
}

export function addHydration(snapshot: NutritionStoreSnapshot, amountMl: number) {
  const now = new Date().toISOString();

  return {
    ...snapshot,
    hydrationLogs: [
      ...snapshot.hydrationLogs,
      {
        id: createId(),
        amountMl,
        loggedAt: now
      }
    ],
    updatedAt: now
  };
}

export function toggleSupplement(snapshot: NutritionStoreSnapshot, supplementId: string) {
  const now = new Date().toISOString();
  const existing = snapshot.supplementLogs.find((entry) => entry.supplementId === supplementId);

  if (existing) {
    const nextStatus: NutritionSupplementStatus = existing.status === "completed" ? "pending" : "completed";
    return {
      ...snapshot,
      supplementLogs: snapshot.supplementLogs.map((entry) =>
        entry.supplementId === supplementId
          ? ({
              ...entry,
              status: nextStatus,
              completedAt: nextStatus === "completed" ? now : null
            } satisfies NutritionSupplementLog)
          : entry
      ),
      updatedAt: now
    };
  }

  const reminder = snapshot.day.supplements.find((entry) => entry.id === supplementId);

  return {
    ...snapshot,
    supplementLogs: [
      ...snapshot.supplementLogs,
      {
        supplementId,
        label: reminder?.label ?? supplementId,
        dosage: reminder?.dosage ?? "",
        status: "completed",
        completedAt: now
      } satisfies NutritionSupplementLog
    ],
    updatedAt: now
  };
}

export function summarizeNutritionDay(snapshot: NutritionStoreSnapshot): NutritionAdherenceSummary {
  const view = buildNutritionDayView(snapshot);
  const completedSelections = snapshot.selections.filter((selection) => selection.completedAt || selection.eatenAt);
  const completedMacros = calculateCompletedMealMacros(snapshot);
  return {
    plannedMeals: view.mealSlots.length,
    selectedMeals: snapshot.selections.filter((selection) => selection.status === "selected").length,
    eatenMeals: snapshot.selections.filter((selection) => selection.eatenAt != null).length,
    completedMeals: completedSelections.length,
    caloriesConsumed: completedMacros.calories,
    caloriesTarget: view.target.calories,
    proteinConsumed: completedMacros.protein,
    carbsConsumed: completedMacros.carbs,
    fatConsumed: completedMacros.fat,
    hydrationMl: view.hydration.currentMl,
    hydrationTargetMl: view.hydration.targetMl,
    supplementsCompleted: view.supplements.filter((supplement) => supplement.checked).length,
    supplementsTotal: view.supplements.length
  };
}

export function nutritionStorageKey(userId: string | null, dateKey: string) {
  return `coachx-nutrition-state:${userId ?? "demo"}:${normalizeNutritionDateKey(dateKey)}`;
}

export function reviveNutritionStoreSnapshot(raw: string | null, fallbackDateKey: string, daySummary?: ProgramDaySummary | null) {
  if (!raw) {
    return createNutritionStoreSnapshot(fallbackDateKey, daySummary);
  }

  try {
    const parsed = JSON.parse(raw) as NutritionStoreSnapshot;
    if (parsed?.version !== 1 || !parsed.day || !Array.isArray(parsed.selections) || !Array.isArray(parsed.hydrationLogs) || !Array.isArray(parsed.supplementLogs)) {
      return createNutritionStoreSnapshot(fallbackDateKey, daySummary);
    }

    return parsed;
  } catch {
    return createNutritionStoreSnapshot(fallbackDateKey, daySummary);
  }
}

export function serializeNutritionStoreSnapshot(snapshot: NutritionStoreSnapshot) {
  return JSON.stringify(snapshot);
}
