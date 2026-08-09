export type WeeklyCheckinStatus = "not_started" | "in_progress" | "completed" | "submitted" | "reviewed";
export type WeeklyCheckinResponseType = "scale" | "boolean" | "text" | "single_choice" | "multiple_choice" | "numeric";
export type WeeklyCheckinReviewStatus = "pending" | "needs_attention" | "reviewed" | "acknowledged";
export type WeeklyCheckinRecommendationType = "none" | "light_review" | "coach_review" | "program_adjustment";

export interface WeeklyCheckinQuestionOption {
  id: string;
  label: string;
  description?: string;
}

export interface WeeklyCheckinQuestionDefinition {
  key: string;
  title: string;
  prompt: string;
  responseType: WeeklyCheckinResponseType;
  helperText?: string;
  scale?: {
    minimumLabel: string;
    maximumLabel: string;
    minimum: number;
    maximum: number;
  };
  options?: WeeklyCheckinQuestionOption[];
}

import type { Json } from "@/lib/supabase/database.types";

export interface WeeklyCheckinResponseDraft {
  questionKey: string;
  responseType: WeeklyCheckinResponseType;
  numericValue: number | null;
  textValue: string | null;
  booleanValue: boolean | null;
  choiceValue: string | null;
  jsonValue: Json | null;
  answeredAt: string | null;
}

export interface WeeklyCheckinSummarySignal {
  completedScheduledWorkouts: number;
  plannedScheduledWorkouts: number;
  completedNutritionDays: number;
  plannedNutritionDays: number;
  progressEntries: number;
  trainingAdherenceScore: number | null;
  nutritionAdherenceScore: number | null;
  energyScore: number | null;
  sleepScore: number | null;
  stressScore: number | null;
  recoveryScore: number | null;
  painDescriptor: string | null;
  painFlag: boolean;
  lowRecoveryFlag: boolean;
  lowEnergyFlag: boolean;
  lowSleepFlag: boolean;
  lowStressControlFlag: boolean;
}

export interface WeeklyCheckinReviewSummary {
  status: WeeklyCheckinReviewStatus;
  recommendationType: WeeklyCheckinRecommendationType;
  reviewReason: {
    triggerKeys: string[];
    summary: string;
    signals: WeeklyCheckinSummarySignal;
    source: "deterministic";
  };
  reviewNotes: string | null;
  recommendationLabel: string;
}

const scaleQuestion = (key: string, title: string, prompt: string, helperText: string, minimumLabel: string, maximumLabel: string): WeeklyCheckinQuestionDefinition => ({
  key,
  title,
  prompt,
  responseType: "scale",
  helperText,
  scale: {
    minimum: 1,
    maximum: 5,
    minimumLabel,
    maximumLabel
  }
});

export const weeklyCheckinQuestions: WeeklyCheckinQuestionDefinition[] = [
  scaleQuestion(
    "training_adherence",
    "Training adherence",
    "How consistently did you follow the planned training this week?",
    "Use the full scale. Low does not mean failure; it just helps the review stay honest.",
    "Not at all",
    "Fully"
  ),
  scaleQuestion(
    "nutrition_adherence",
    "Nutrition adherence",
    "How closely did you follow the nutrition plan this week?",
    "Choose the level that best reflects the whole week, not one day.",
    "Off track",
    "Very consistent"
  ),
  scaleQuestion(
    "energy",
    "Energy",
    "How was your energy across the week?",
    "Higher is better here.",
    "Very low",
    "Very high"
  ),
  scaleQuestion(
    "sleep",
    "Sleep",
    "How was your sleep quality this week?",
    "Think about consistency and recovery, not one isolated night.",
    "Poor",
    "Excellent"
  ),
  scaleQuestion(
    "stress",
    "Stress",
    "How manageable was your stress this week?",
    "Higher means stress felt easier to manage.",
    "Hard to manage",
    "Very manageable"
  ),
  scaleQuestion(
    "recovery",
    "Recovery",
    "How well did you recover between sessions?",
    "Consider soreness, readiness, and how you felt on training days.",
    "Poor",
    "Great"
  ),
  {
    key: "pain_discomfort",
    title: "Pain or discomfort",
    prompt: "Did anything feel painful or concerning while training or recovering?",
    responseType: "single_choice",
    helperText: "If something felt off, flag it. The review stays calm and private.",
    options: [
      { id: "none", label: "None" },
      { id: "mild", label: "Mild" },
      { id: "moderate", label: "Moderate" },
      { id: "high", label: "High" }
    ]
  },
  {
    key: "weekly_notes",
    title: "Weekly notes",
    prompt: "Anything else you want AthlexForce to know?",
    responseType: "text",
    helperText: "Short notes are fine. This is the place for context."
  }
];

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function resolveWeeklyCheckinWindow(dateKey: string) {
  const anchor = new Date(`${dateKey.slice(0, 10)}T00:00:00.000Z`);
  const start = addDays(anchor, -anchor.getUTCDay());
  const end = addDays(start, 6);

  return {
    weekStartDate: formatDateKey(start),
    weekEndDate: formatDateKey(end)
  };
}

export function getWeeklyCheckinQuestion(questionKey: string) {
  return weeklyCheckinQuestions.find((question) => question.key === questionKey) ?? null;
}

export function createEmptyWeeklyCheckinResponses() {
  return weeklyCheckinQuestions.map<WeeklyCheckinResponseDraft>((question) => ({
    questionKey: question.key,
    responseType: question.responseType,
    numericValue: null,
    textValue: null,
    booleanValue: null,
    choiceValue: null,
    jsonValue: null,
    answeredAt: null
  }));
}

function scoreToSignal(score: number | null | undefined) {
  if (typeof score !== "number") {
    return false;
  }

  return score <= 2;
}

export function deriveWeeklyCheckinReviewSummary(signals: WeeklyCheckinSummarySignal): WeeklyCheckinReviewSummary {
  const triggerKeys: string[] = [];

  if (signals.painFlag) {
    triggerKeys.push("pain_discomfort");
  }

  if (signals.lowRecoveryFlag || scoreToSignal(signals.recoveryScore)) {
    triggerKeys.push("recovery");
  }

  if (signals.lowEnergyFlag || scoreToSignal(signals.energyScore)) {
    triggerKeys.push("energy");
  }

  if (signals.lowSleepFlag || scoreToSignal(signals.sleepScore)) {
    triggerKeys.push("sleep");
  }

  if (signals.lowStressControlFlag || scoreToSignal(signals.stressScore)) {
    triggerKeys.push("stress");
  }

  if (scoreToSignal(signals.trainingAdherenceScore)) {
    triggerKeys.push("training_adherence");
  }

  if (scoreToSignal(signals.nutritionAdherenceScore)) {
    triggerKeys.push("nutrition_adherence");
  }

  const trainingRatio = signals.plannedScheduledWorkouts > 0 ? signals.completedScheduledWorkouts / signals.plannedScheduledWorkouts : 0;
  const nutritionRatio = signals.plannedNutritionDays > 0 ? signals.completedNutritionDays / signals.plannedNutritionDays : 0;

  if (trainingRatio < 0.5) {
    triggerKeys.push("training_adherence");
  }

  if (nutritionRatio < 0.5) {
    triggerKeys.push("nutrition_adherence");
  }

  const status: WeeklyCheckinReviewStatus = triggerKeys.length === 0 ? "pending" : "needs_attention";
  const recommendationType: WeeklyCheckinRecommendationType =
    triggerKeys.includes("pain_discomfort") || triggerKeys.includes("recovery")
      ? "coach_review"
      : triggerKeys.length > 0
        ? "light_review"
        : "none";

  const recommendationLabel =
    recommendationType === "coach_review"
      ? "Coach review required"
      : recommendationType === "light_review"
        ? "Light review recommended"
        : "No review required";

  const summary =
    triggerKeys.length === 0
      ? "The week looks stable and the active program can remain in place."
      : recommendationType === "coach_review"
        ? "A safety-sensitive signal was captured. Keep the current program stable until someone reviews it."
        : "A few adherence signals are softer this week, so the review should stay visible without mutating the program.";

  return {
    status,
    recommendationType,
    reviewReason: {
      triggerKeys,
      summary,
      signals,
      source: "deterministic"
    },
    reviewNotes: null,
    recommendationLabel
  };
}

export function getWeeklyCheckinQuestionIndex(questionKey: string) {
  return weeklyCheckinQuestions.findIndex((question) => question.key === questionKey);
}

export function computeSignalFromScoredQuestions(scores: {
  training_adherence?: number | null;
  nutrition_adherence?: number | null;
  energy?: number | null;
  sleep?: number | null;
  stress?: number | null;
  recovery?: number | null;
  pain_discomfort?: string | null;
}) {
  return {
    completedScheduledWorkouts: 0,
    plannedScheduledWorkouts: 0,
    completedNutritionDays: 0,
    plannedNutritionDays: 0,
    progressEntries: 0,
    trainingAdherenceScore: scores.training_adherence ?? null,
    nutritionAdherenceScore: scores.nutrition_adherence ?? null,
    energyScore: scores.energy ?? null,
    sleepScore: scores.sleep ?? null,
    stressScore: scores.stress ?? null,
    recoveryScore: scores.recovery ?? null,
    painDescriptor: scores.pain_discomfort ?? null,
    painFlag: Boolean(scores.pain_discomfort && scores.pain_discomfort !== "none"),
    lowRecoveryFlag: scoreToSignal(scores.recovery),
    lowEnergyFlag: scoreToSignal(scores.energy),
    lowSleepFlag: scoreToSignal(scores.sleep),
    lowStressControlFlag: scoreToSignal(scores.stress)
  } satisfies WeeklyCheckinSummarySignal;
}
