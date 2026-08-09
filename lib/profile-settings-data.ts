import {
  createOnboardingDemoState,
  type AthleteProfile,
  type GoalPriority,
  type GoalProfile,
  type HealthLimitations,
  type NutritionPreferences,
  type ProgramState,
  type ScheduleLifestyle,
  type TrainingPreferences
} from "@/lib/onboarding-data";

export type ProfileEditSection =
  | "personal"
  | "goals"
  | "training"
  | "schedule"
  | "nutrition"
  | "health"
  | "notifications";

export type ImpactClassification =
  | "NO_IMPACT"
  | "MINOR_REVIEW"
  | "PROGRAM_ADJUSTMENT_RECOMMENDED"
  | "COACH_REVIEW_REQUIRED";

export type NotificationPermissionState = "not-requested" | "allowed" | "denied";
export type ReminderIntensity = "minimal" | "recommended" | "more-support";

export type NotificationCategoryId =
  | "workout-reminders"
  | "program-updates"
  | "weekly-check-in"
  | "measurements"
  | "progress-photos"
  | "phase-reviews"
  | "nutrition-reminders"
  | "hydration"
  | "supplements"
  | "sleep-routine"
  | "adaptive-alerts";

export interface NotificationCategory {
  id: NotificationCategoryId;
  label: string;
  description: string;
  enabled: boolean;
}

export interface QuietHours {
  enabled: boolean;
  start: string;
  end: string;
  timezone: string;
}

export interface NotificationSettings {
  masterEnabled: boolean;
  permission: NotificationPermissionState;
  intensity: ReminderIntensity;
  quietHours: QuietHours;
  categories: NotificationCategory[];
}

export interface ProfileSnapshot {
  profile: AthleteProfile;
  goals: GoalProfile;
  trainingPreferences: TrainingPreferences;
  scheduleLifestyle: ScheduleLifestyle;
  healthLimitations: HealthLimitations;
  nutritionPreferences: NutritionPreferences;
}

export interface ProfileChange {
  field: string;
  before: string;
  after: string;
}

export interface ProfileImpactReview {
  classification: ImpactClassification;
  title: string;
  summary: string;
  whatChanged: ProfileChange[];
  currentProgram: string[];
  potentialImpact: string[];
  recommendedAction: string;
}

export interface ProfileSettingsState {
  saved: ProfileSnapshot;
  notifications: NotificationSettings;
  pendingReview: ProfileImpactReview | null;
  saveState: "idle" | "saved" | "error";
  saveError: string | null;
  lastSavedLabel: string;
}

export const profileSectionOrder: Array<{ id: ProfileEditSection; label: string; route: string; summary: string }> = [
  { id: "personal", label: "Personal Details", route: "/profile/preferences/personal", summary: "Name, height, weight, units, timezone" },
  { id: "goals", label: "Goals & Priorities", route: "/profile/preferences/goals", summary: "Goal and ordered priorities" },
  { id: "training", label: "Training Preferences", route: "/profile/preferences/training", summary: "Days, duration, equipment, style" },
  { id: "schedule", label: "Schedule & Lifestyle", route: "/profile/preferences/schedule", summary: "Work, sleep, energy, reminders" },
  { id: "nutrition", label: "Nutrition Preferences", route: "/profile/preferences/nutrition", summary: "Meal routine, restrictions, preferences" },
  { id: "health", label: "Health & Limitations", route: "/profile/preferences/health", summary: "Pain, injuries, movement limits" },
  { id: "notifications", label: "Notifications & Reminders", route: "/profile/notifications", summary: "Workout, progress and coaching reminders" }
];

export const profileStorageKey = "coachx-profile-settings-v1";

function cloneSnapshot(snapshot: ProfileSnapshot): ProfileSnapshot {
  return {
    profile: { ...snapshot.profile },
    goals: { ...snapshot.goals, priorities: [...snapshot.goals.priorities] },
    trainingPreferences: {
      ...snapshot.trainingPreferences,
      preferredDays: [...snapshot.trainingPreferences.preferredDays],
      equipment: [...snapshot.trainingPreferences.equipment],
      favoriteExercises: [...snapshot.trainingPreferences.favoriteExercises],
      movementsToAvoid: [...snapshot.trainingPreferences.movementsToAvoid]
    },
    scheduleLifestyle: { ...snapshot.scheduleLifestyle },
    healthLimitations: {
      ...snapshot.healthLimitations,
      movementLimitations: [...snapshot.healthLimitations.movementLimitations],
      romLimitations: [...snapshot.healthLimitations.romLimitations]
    },
    nutritionPreferences: {
      ...snapshot.nutritionPreferences,
      likedFoods: [...snapshot.nutritionPreferences.likedFoods],
      dislikedFoods: [...snapshot.nutritionPreferences.dislikedFoods],
      allergies: [...snapshot.nutritionPreferences.allergies],
      intolerances: [...snapshot.nutritionPreferences.intolerances],
      restrictions: [...snapshot.nutritionPreferences.restrictions],
      supplements: [...snapshot.nutritionPreferences.supplements]
    }
  };
}

function listToText(items: string[]) {
  return items.length > 0 ? items.join(", ") : "None";
}

function normalizeList(value: string[]) {
  return value.map((item) => item.trim()).filter(Boolean);
}

function stringChange(field: string, before: string | number, after: string | number): ProfileChange | null {
  const previous = String(before);
  const next = String(after);
  return previous === next ? null : { field, before: previous, after: next };
}

function listChange(field: string, before: string[], after: string[]): ProfileChange | null {
  const previous = listToText(before);
  const next = listToText(after);
  return previous === next ? null : { field, before: previous, after: next };
}

function hasMeaningfulHealthSignal(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  const neutralPhrases = ["none", "no major", "not applicable", "n/a", "no issues", "no concern", "none currently", "no pain"];
  if (neutralPhrases.some((phrase) => normalized.includes(phrase))) {
    return false;
  }

  return /pain|injur|surgery|symptom|pregnan|postpartum|limit|restriction|medication|digest/.test(normalized);
}

function hasNutritionSafetyChange(before: NutritionPreferences, after: NutritionPreferences) {
  const safetyFields: Array<keyof NutritionPreferences> = ["allergies", "intolerances", "restrictions"];
  return safetyFields.some((field) => listToText(before[field] as string[]) !== listToText(after[field] as string[]));
}

function buildChangeList(previous: ProfileSnapshot, next: ProfileSnapshot): ProfileChange[] {
  return [
    stringChange("Name", previous.profile.name, next.profile.name),
    stringChange("Age", previous.profile.age, next.profile.age),
    stringChange("Height", previous.profile.heightCm, next.profile.heightCm),
    stringChange("Weight", previous.profile.weightKg, next.profile.weightKg),
    stringChange("Units", previous.profile.unitSystem, next.profile.unitSystem),
    stringChange("Main goal", previous.goals.mainGoal, next.goals.mainGoal),
    listChange("Priorities", previous.goals.priorities, next.goals.priorities),
    stringChange("Training days", previous.trainingPreferences.daysPerWeek, next.trainingPreferences.daysPerWeek),
    listChange("Preferred days", previous.trainingPreferences.preferredDays, next.trainingPreferences.preferredDays),
    stringChange("Duration", previous.trainingPreferences.duration, next.trainingPreferences.duration),
    stringChange("Location", previous.trainingPreferences.location, next.trainingPreferences.location),
    listChange("Equipment", previous.trainingPreferences.equipment, next.trainingPreferences.equipment),
    stringChange("Style", previous.trainingPreferences.style, next.trainingPreferences.style),
    listChange("Favorite exercises", previous.trainingPreferences.favoriteExercises, next.trainingPreferences.favoriteExercises),
    listChange("Movements to avoid", previous.trainingPreferences.movementsToAvoid, next.trainingPreferences.movementsToAvoid),
    stringChange("Variety", previous.trainingPreferences.varietyPreference, next.trainingPreferences.varietyPreference),
    stringChange("Cardio", previous.trainingPreferences.cardioPreference, next.trainingPreferences.cardioPreference),
    stringChange("Work schedule", previous.scheduleLifestyle.workSchedule, next.scheduleLifestyle.workSchedule),
    stringChange("Available training time", previous.scheduleLifestyle.availableTrainingTime, next.scheduleLifestyle.availableTrainingTime),
    stringChange("Reminder preference", previous.scheduleLifestyle.reminderPreference, next.scheduleLifestyle.reminderPreference),
    stringChange("Meal frequency", previous.nutritionPreferences.mealFrequency, next.nutritionPreferences.mealFrequency),
    stringChange("Meal times", previous.nutritionPreferences.mealTimes, next.nutritionPreferences.mealTimes),
    stringChange("Breakfast preference", previous.nutritionPreferences.breakfastPreference, next.nutritionPreferences.breakfastPreference),
    stringChange("Pre-workout eating", previous.nutritionPreferences.preWorkoutEating, next.nutritionPreferences.preWorkoutEating),
    stringChange("Cooking access", previous.nutritionPreferences.cookingAccess, next.nutritionPreferences.cookingAccess),
    stringChange("Meal prep", previous.nutritionPreferences.mealPrep, next.nutritionPreferences.mealPrep),
    stringChange("Budget", previous.nutritionPreferences.budget, next.nutritionPreferences.budget),
    listChange("Liked foods", previous.nutritionPreferences.likedFoods, next.nutritionPreferences.likedFoods),
    listChange("Disliked foods", previous.nutritionPreferences.dislikedFoods, next.nutritionPreferences.dislikedFoods),
    listChange("Allergies", previous.nutritionPreferences.allergies, next.nutritionPreferences.allergies),
    listChange("Intolerances", previous.nutritionPreferences.intolerances, next.nutritionPreferences.intolerances),
    listChange("Restrictions", previous.nutritionPreferences.restrictions, next.nutritionPreferences.restrictions),
    stringChange("Injury history", previous.healthLimitations.injuryHistory, next.healthLimitations.injuryHistory),
    stringChange("Current pain", previous.healthLimitations.currentPain, next.healthLimitations.currentPain),
    listChange("Movement limitations", previous.healthLimitations.movementLimitations, next.healthLimitations.movementLimitations),
    listChange("ROM limitations", previous.healthLimitations.romLimitations, next.healthLimitations.romLimitations),
    stringChange("Surgery history", previous.healthLimitations.surgeryHistory, next.healthLimitations.surgeryHistory),
    stringChange("Medication context", previous.healthLimitations.medicationContext, next.healthLimitations.medicationContext),
    stringChange("Warning symptoms", previous.healthLimitations.warningSymptoms, next.healthLimitations.warningSymptoms),
    stringChange("Cycle context", previous.healthLimitations.cycleContext, next.healthLimitations.cycleContext),
    stringChange("Pregnancy/postpartum", previous.healthLimitations.pregnancyPostpartum, next.healthLimitations.pregnancyPostpartum),
    stringChange("Digestion", previous.healthLimitations.digestion, next.healthLimitations.digestion)
  ].filter((item): item is ProfileChange => Boolean(item));
}

function classifyImpact(previous: ProfileSnapshot, next: ProfileSnapshot): ImpactClassification {
  if (hasMeaningfulHealthSignal(next.healthLimitations.currentPain) || hasMeaningfulHealthSignal(next.healthLimitations.injuryHistory)) {
    return "COACH_REVIEW_REQUIRED";
  }

  if (hasMeaningfulHealthSignal(next.healthLimitations.surgeryHistory) || hasMeaningfulHealthSignal(next.healthLimitations.warningSymptoms)) {
    return "COACH_REVIEW_REQUIRED";
  }

  if (hasMeaningfulHealthSignal(next.healthLimitations.pregnancyPostpartum)) {
    return "COACH_REVIEW_REQUIRED";
  }

  if (hasNutritionSafetyChange(previous.nutritionPreferences, next.nutritionPreferences)) {
    return "COACH_REVIEW_REQUIRED";
  }

  const goalChanged = previous.goals.mainGoal !== next.goals.mainGoal || listToText(previous.goals.priorities) !== listToText(next.goals.priorities);
  const trainingChanged =
    previous.trainingPreferences.daysPerWeek !== next.trainingPreferences.daysPerWeek ||
    previous.trainingPreferences.duration !== next.trainingPreferences.duration ||
    previous.trainingPreferences.location !== next.trainingPreferences.location ||
    listToText(previous.trainingPreferences.equipment) !== listToText(next.trainingPreferences.equipment) ||
    previous.trainingPreferences.style !== next.trainingPreferences.style ||
    listToText(previous.trainingPreferences.favoriteExercises) !== listToText(next.trainingPreferences.favoriteExercises) ||
    listToText(previous.trainingPreferences.movementsToAvoid) !== listToText(next.trainingPreferences.movementsToAvoid) ||
    previous.trainingPreferences.varietyPreference !== next.trainingPreferences.varietyPreference ||
    previous.trainingPreferences.cardioPreference !== next.trainingPreferences.cardioPreference;

  const scheduleChanged =
    previous.scheduleLifestyle.workSchedule !== next.scheduleLifestyle.workSchedule ||
    previous.scheduleLifestyle.availableTrainingTime !== next.scheduleLifestyle.availableTrainingTime ||
    previous.scheduleLifestyle.reminderPreference !== next.scheduleLifestyle.reminderPreference ||
    previous.scheduleLifestyle.wakeTime !== next.scheduleLifestyle.wakeTime ||
    previous.scheduleLifestyle.bedTime !== next.scheduleLifestyle.bedTime;

  const nutritionPreferenceChanged =
    previous.nutritionPreferences.mealFrequency !== next.nutritionPreferences.mealFrequency ||
    previous.nutritionPreferences.mealTimes !== next.nutritionPreferences.mealTimes ||
    previous.nutritionPreferences.breakfastPreference !== next.nutritionPreferences.breakfastPreference ||
    previous.nutritionPreferences.preWorkoutEating !== next.nutritionPreferences.preWorkoutEating ||
    previous.nutritionPreferences.cookingAccess !== next.nutritionPreferences.cookingAccess ||
    previous.nutritionPreferences.mealPrep !== next.nutritionPreferences.mealPrep ||
    previous.nutritionPreferences.budget !== next.nutritionPreferences.budget ||
    listToText(previous.nutritionPreferences.likedFoods) !== listToText(next.nutritionPreferences.likedFoods) ||
    listToText(previous.nutritionPreferences.dislikedFoods) !== listToText(next.nutritionPreferences.dislikedFoods) ||
    previous.nutritionPreferences.flexibility !== next.nutritionPreferences.flexibility ||
    previous.nutritionPreferences.variety !== next.nutritionPreferences.variety ||
    previous.nutritionPreferences.barriers !== next.nutritionPreferences.barriers ||
    previous.nutritionPreferences.supportPreference !== next.nutritionPreferences.supportPreference;

  const personalChanged =
    previous.profile.name !== next.profile.name ||
    previous.profile.age !== next.profile.age ||
    previous.profile.heightCm !== next.profile.heightCm ||
    previous.profile.weightKg !== next.profile.weightKg ||
    previous.profile.unitSystem !== next.profile.unitSystem;

  if (goalChanged || trainingChanged || scheduleChanged) {
    return "PROGRAM_ADJUSTMENT_RECOMMENDED";
  }

  if (nutritionPreferenceChanged) {
    return "MINOR_REVIEW";
  }

  if (personalChanged) {
    return "NO_IMPACT";
  }

  return "NO_IMPACT";
}

function recommendAction(classification: ImpactClassification) {
  switch (classification) {
    case "NO_IMPACT":
      return "No program rebuild is required.";
    case "MINOR_REVIEW":
      return "Profile saved. The program can stay as-is unless you want a review.";
    case "PROGRAM_ADJUSTMENT_RECOMMENDED":
      return "Review the current program before applying these changes.";
    case "COACH_REVIEW_REQUIRED":
      return "Coach review is required before the program should change.";
  }
}

function impactTitle(classification: ImpactClassification) {
  switch (classification) {
    case "NO_IMPACT":
      return "No program change required.";
    case "MINOR_REVIEW":
      return "Profile saved with a light review.";
    case "PROGRAM_ADJUSTMENT_RECOMMENDED":
      return "Changes may affect your program.";
    case "COACH_REVIEW_REQUIRED":
      return "Coach review required.";
  }
}

function impactSummary(classification: ImpactClassification) {
  switch (classification) {
    case "NO_IMPACT":
      return "This edit updates the profile without changing the active plan.";
    case "MINOR_REVIEW":
      return "The saved preferences can stay with the current program, but AthlexForce flagged a gentle review.";
    case "PROGRAM_ADJUSTMENT_RECOMMENDED":
      return "The program may need adjustment after these changes are confirmed.";
    case "COACH_REVIEW_REQUIRED":
      return "The change introduces a safety-sensitive difference that should be reviewed first.";
  }
}

function potentialImpact(classification: ImpactClassification, changes: ProfileChange[]) {
  if (changes.length === 0) {
    return ["No meaningful difference from the saved profile."];
  }

  const highLevel =
    classification === "COACH_REVIEW_REQUIRED"
      ? "Active exercise or nutrition details should not be rewritten until review is complete."
      : classification === "PROGRAM_ADJUSTMENT_RECOMMENDED"
        ? "Training structure and weekly rhythm may need an update."
        : classification === "MINOR_REVIEW"
          ? "The active program can remain in place while the profile stays current."
          : "The active program can remain unchanged.";

  return [highLevel];
}

function currentProgramSummary(program: ProgramState) {
  return [
    `${program.phaseLabel} · ${program.status.toUpperCase()}`,
    `${program.goal} · ${program.duration}`,
    program.weeklyStructure.join(" · "),
    program.nutrition,
    program.cardio
  ];
}

export function createProfileSnapshot(): ProfileSnapshot {
  const state = createOnboardingDemoState();
  return {
    profile: { ...state.profile },
    goals: { ...state.goals, priorities: [...state.goals.priorities] },
    trainingPreferences: {
      ...state.trainingPreferences,
      preferredDays: [...state.trainingPreferences.preferredDays],
      equipment: [...state.trainingPreferences.equipment],
      favoriteExercises: [...state.trainingPreferences.favoriteExercises],
      movementsToAvoid: [...state.trainingPreferences.movementsToAvoid]
    },
    scheduleLifestyle: { ...state.scheduleLifestyle },
    healthLimitations: {
      ...state.healthLimitations,
      movementLimitations: [...state.healthLimitations.movementLimitations],
      romLimitations: [...state.healthLimitations.romLimitations]
    },
    nutritionPreferences: {
      ...state.nutritionPreferences,
      likedFoods: [...state.nutritionPreferences.likedFoods],
      dislikedFoods: [...state.nutritionPreferences.dislikedFoods],
      allergies: [...state.nutritionPreferences.allergies],
      intolerances: [...state.nutritionPreferences.intolerances],
      restrictions: [...state.nutritionPreferences.restrictions],
      supplements: [...state.nutritionPreferences.supplements]
    }
  };
}

export function createNotificationSettings(): NotificationSettings {
  return {
    masterEnabled: true,
    permission: "not-requested",
    intensity: "recommended",
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "07:00",
      timezone: "Device local"
    },
    categories: [
      { id: "workout-reminders", label: "Workout Reminders", description: "Session reminders before training starts.", enabled: true },
      { id: "program-updates", label: "Program Updates", description: "Changes to the current plan or schedule.", enabled: true },
      { id: "weekly-check-in", label: "Weekly Check-in", description: "Sunday review and quick progress prompt.", enabled: true },
      { id: "measurements", label: "Measurements", description: "Reminders for baseline and follow-up measurements.", enabled: true },
      { id: "progress-photos", label: "Progress Photos", description: "Front, side, and back check-in reminders.", enabled: true },
      { id: "phase-reviews", label: "Phase Reviews", description: "Weekly or phase-end review prompts.", enabled: true },
      { id: "nutrition-reminders", label: "Nutrition Reminders", description: "Optional meal and hydration nudges.", enabled: false },
      { id: "hydration", label: "Hydration", description: "Light hydration reminders during the day.", enabled: true },
      { id: "supplements", label: "Supplements", description: "Creatine or protein timing reminders.", enabled: false },
      { id: "sleep-routine", label: "Sleep Routine", description: "Wind-down reminders before bedtime.", enabled: false },
      { id: "adaptive-alerts", label: "Adaptive AthlexForce Alerts", description: "A concise heads-up when the plan needs attention.", enabled: true }
    ]
  };
}

function createReviewSnapshot(previous: ProfileSnapshot, next: ProfileSnapshot, program: ProgramState): ProfileImpactReview {
  const changes = buildChangeList(previous, next);
  const classification = classifyImpact(previous, next);
  return {
    classification,
    title: impactTitle(classification),
    summary: impactSummary(classification),
    whatChanged: changes,
    currentProgram: currentProgramSummary(program),
    potentialImpact: potentialImpact(classification, changes),
    recommendedAction: recommendAction(classification)
  };
}

function reviveSnapshot(raw: unknown, fallback: ProfileSnapshot) {
  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const value = raw as Partial<ProfileSnapshot>;
  return {
    profile: { ...fallback.profile, ...(value.profile ?? {}) },
    goals: {
      ...fallback.goals,
      ...(value.goals ?? {}),
      priorities: normalizeList((value.goals?.priorities ?? fallback.goals.priorities) as GoalPriority[]) as GoalPriority[]
    },
    trainingPreferences: {
      ...fallback.trainingPreferences,
      ...(value.trainingPreferences ?? {}),
      preferredDays: normalizeList(value.trainingPreferences?.preferredDays ?? fallback.trainingPreferences.preferredDays),
      equipment: normalizeList(value.trainingPreferences?.equipment ?? fallback.trainingPreferences.equipment),
      favoriteExercises: normalizeList(value.trainingPreferences?.favoriteExercises ?? fallback.trainingPreferences.favoriteExercises),
      movementsToAvoid: normalizeList(value.trainingPreferences?.movementsToAvoid ?? fallback.trainingPreferences.movementsToAvoid)
    },
    scheduleLifestyle: { ...fallback.scheduleLifestyle, ...(value.scheduleLifestyle ?? {}) },
    healthLimitations: {
      ...fallback.healthLimitations,
      ...(value.healthLimitations ?? {}),
      movementLimitations: normalizeList(value.healthLimitations?.movementLimitations ?? fallback.healthLimitations.movementLimitations),
      romLimitations: normalizeList(value.healthLimitations?.romLimitations ?? fallback.healthLimitations.romLimitations)
    },
    nutritionPreferences: {
      ...fallback.nutritionPreferences,
      ...(value.nutritionPreferences ?? {}),
      likedFoods: normalizeList(value.nutritionPreferences?.likedFoods ?? fallback.nutritionPreferences.likedFoods),
      dislikedFoods: normalizeList(value.nutritionPreferences?.dislikedFoods ?? fallback.nutritionPreferences.dislikedFoods),
      allergies: normalizeList(value.nutritionPreferences?.allergies ?? fallback.nutritionPreferences.allergies),
      intolerances: normalizeList(value.nutritionPreferences?.intolerances ?? fallback.nutritionPreferences.intolerances),
      restrictions: normalizeList(value.nutritionPreferences?.restrictions ?? fallback.nutritionPreferences.restrictions),
      supplements: normalizeList(value.nutritionPreferences?.supplements ?? fallback.nutritionPreferences.supplements)
    }
  };
}

export function reviveProfileSettingsState(rawValue: string | null): ProfileSettingsState {
  const snapshot = createProfileSnapshot();
  const notifications = createNotificationSettings();

  if (!rawValue) {
    return {
      saved: snapshot,
      notifications,
      pendingReview: null,
      saveState: "idle",
      saveError: null,
      lastSavedLabel: "Draft not saved yet"
    };
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<ProfileSettingsState>;
    return {
      saved: reviveSnapshot(parsed.saved, snapshot),
      notifications: {
        ...notifications,
        ...(parsed.notifications ?? {}),
        quietHours: {
          ...notifications.quietHours,
          ...(parsed.notifications?.quietHours ?? {})
        },
        categories: notifications.categories.map((category) => {
          const incoming = parsed.notifications?.categories?.find((item) => item.id === category.id);
          return incoming ? { ...category, ...incoming } : category;
        })
      },
      pendingReview: parsed.pendingReview ?? null,
      saveState: parsed.saveState ?? "idle",
      saveError: parsed.saveError ?? null,
      lastSavedLabel: parsed.lastSavedLabel ?? "Draft saved"
    };
  } catch {
    return {
      saved: snapshot,
      notifications,
      pendingReview: null,
      saveState: "idle",
      saveError: null,
      lastSavedLabel: "Draft not saved yet"
    };
  }
}

export function serializeProfileSettingsState(state: ProfileSettingsState) {
  return JSON.stringify(state);
}

export function buildProfileReview(previous: ProfileSnapshot, next: ProfileSnapshot, program: ProgramState) {
  return createReviewSnapshot(previous, next, program);
}

export function buildUpdatedSnapshot(previous: ProfileSnapshot, section: ProfileEditSection, patch: Partial<ProfileSnapshot>) {
  const next = cloneSnapshot(previous);

  switch (section) {
    case "personal":
      next.profile = { ...next.profile, ...(patch.profile ?? {}) };
      break;
    case "goals":
      next.goals = {
        ...next.goals,
        ...(patch.goals ?? {}),
        priorities: normalizeList((patch.goals?.priorities ?? next.goals.priorities) as GoalPriority[]) as GoalPriority[]
      };
      break;
    case "training":
      next.trainingPreferences = {
        ...next.trainingPreferences,
        ...(patch.trainingPreferences ?? {}),
        preferredDays: normalizeList(patch.trainingPreferences?.preferredDays ?? next.trainingPreferences.preferredDays),
        equipment: normalizeList(patch.trainingPreferences?.equipment ?? next.trainingPreferences.equipment),
        favoriteExercises: normalizeList(patch.trainingPreferences?.favoriteExercises ?? next.trainingPreferences.favoriteExercises),
        movementsToAvoid: normalizeList(patch.trainingPreferences?.movementsToAvoid ?? next.trainingPreferences.movementsToAvoid)
      };
      break;
    case "schedule":
      next.scheduleLifestyle = {
        ...next.scheduleLifestyle,
        ...(patch.scheduleLifestyle ?? {})
      };
      break;
    case "nutrition":
      next.nutritionPreferences = {
        ...next.nutritionPreferences,
        ...(patch.nutritionPreferences ?? {}),
        likedFoods: normalizeList(patch.nutritionPreferences?.likedFoods ?? next.nutritionPreferences.likedFoods),
        dislikedFoods: normalizeList(patch.nutritionPreferences?.dislikedFoods ?? next.nutritionPreferences.dislikedFoods),
        allergies: normalizeList(patch.nutritionPreferences?.allergies ?? next.nutritionPreferences.allergies),
        intolerances: normalizeList(patch.nutritionPreferences?.intolerances ?? next.nutritionPreferences.intolerances),
        restrictions: normalizeList(patch.nutritionPreferences?.restrictions ?? next.nutritionPreferences.restrictions),
        supplements: normalizeList(patch.nutritionPreferences?.supplements ?? next.nutritionPreferences.supplements)
      };
      break;
    case "health":
      next.healthLimitations = {
        ...next.healthLimitations,
        ...(patch.healthLimitations ?? {}),
        movementLimitations: normalizeList(patch.healthLimitations?.movementLimitations ?? next.healthLimitations.movementLimitations),
        romLimitations: normalizeList(patch.healthLimitations?.romLimitations ?? next.healthLimitations.romLimitations)
      };
      break;
    case "notifications":
      break;
  }

  return next;
}

export function applySnapshotToProgram(program: ProgramState, snapshot: ProfileSnapshot) {
  return {
    ...program,
    goal: snapshot.goals.mainGoal,
    whyItFits: `The updated profile still aligns with ${snapshot.goals.mainGoal.toLowerCase()} while keeping the current weekly structure controlled and repeatable.`,
    weeklyStructure: [
      `${snapshot.trainingPreferences.daysPerWeek} training days`,
      `${snapshot.trainingPreferences.duration} sessions`,
      snapshot.trainingPreferences.location,
      `Reminder preference: ${snapshot.scheduleLifestyle.reminderPreference}`
    ],
    recentAdjustments: [`Profile saved · ${snapshot.profile.name}`, "Program confirmed after profile review"]
  };
}

export function isProfileSectionSavingAllowed(section: ProfileEditSection, snapshot: ProfileSnapshot) {
  if (section === "health") {
    return Boolean(snapshot.healthLimitations.injuryHistory.trim() || snapshot.healthLimitations.currentPain.trim() || snapshot.healthLimitations.movementLimitations.length > 0 || snapshot.healthLimitations.romLimitations.length > 0 || snapshot.healthLimitations.warningSymptoms.trim());
  }

  return true;
}
