import { createDemoWorkoutSession, getExerciseDefinition } from "@/lib/workout-data";
import { createNutritionSession, type NutritionDay } from "@/lib/nutrition-data";

export type BottomTab = "today" | "calendar" | "progress" | "profile";

export type MuscleGroup =
  | "glutes"
  | "hamstrings"
  | "quadriceps"
  | "calves"
  | "core"
  | "chest"
  | "shoulders"
  | "triceps"
  | "biceps"
  | "back"
  | "lats";

export interface WorkoutMovement {
  name: string;
  prescription: string;
  icon: string;
  thumbnail?: string;
}

export interface CalendarDay {
  label: string;
  weekday: string;
  day: number;
  monthOffset: -1 | 0 | 1;
  hasActivity?: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  isDimmed?: boolean;
  completed?: boolean;
}

export interface DemoDay {
  dateKey: string;
  dateLabel: string;
  calendarLabel: string;
  phase: string;
  workoutTitle: string;
  workoutType: string;
  duration: string;
  volume: string;
  sets: string;
  primaryTarget: string;
  secondaryTarget: string;
  workoutCount: string;
  nutritionCalories: string;
  macros: string;
  cardio: string;
  habits: string;
  coachInsight: string;
  muscleFocus: MuscleGroup[];
  anatomyKey: string;
  movements: WorkoutMovement[];
}

export interface ProgressMetric {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "steady";
}

export interface ProfileSection {
  label: string;
  value: string;
}

interface DemoAthlete {
  name: string;
  goal: string;
  priorities: string;
  training: string;
  experience: string;
  schedule: string;
  recovery: string;
  nutrition: string;
  health: string;
  baseline: string;
}

const demoAthlete: DemoAthlete = {
  name: "Alex",
  goal: "Body Recomposition",
  priorities: "Glutes · Hamstrings · Legs",
  training: "4 days / week · 60-75 min · Full gym",
  experience: "Intermediate",
  schedule: "Evening training · Active workday",
  recovery: "6-7h sleep · Moderate stress",
  nutrition: "3 meals + snack · Structured",
  health: "Information reviewed",
  baseline: "Measurements added · Photos added"
};

const demoWorkoutSession = createDemoWorkoutSession();
const demoNutritionDay: NutritionDay = createNutritionSession("2026-08-08");

const demoDay: DemoDay = {
  dateKey: demoNutritionDay.dateKey,
  dateLabel: demoNutritionDay.dateLabel,
  calendarLabel: demoNutritionDay.calendarLabel,
  phase: demoWorkoutSession.phaseLabel,
  workoutTitle: demoWorkoutSession.workoutLabel,
  workoutType: "Posterior chain emphasis",
  duration: demoWorkoutSession.summary.duration,
  volume: "7.8k",
  sets: demoWorkoutSession.summary.setsCompleted,
  primaryTarget: "Glutes",
  secondaryTarget: "Hamstrings",
  workoutCount: `${demoWorkoutSession.totalExercises} exercises`,
  nutritionCalories: `${demoNutritionDay.target.calories} kcal`,
  macros: `${demoNutritionDay.target.protein}P · ${demoNutritionDay.target.carbs}C · ${demoNutritionDay.target.fat}F`,
  cardio: "Zone 2 · 20 min",
  habits: "Daily habits 0/5",
  coachInsight:
    "Keep the pelvis neutral on thrusts and hinge with control on every rep. The posterior chain should do the work.",
  muscleFocus: ["glutes", "hamstrings"],
  anatomyKey: "posterior-lower-body",
  movements: demoWorkoutSession.exercises.map((exercise) => {
    const definition = getExerciseDefinition(exercise.performedExerciseId);
    return {
      name: definition.name,
      prescription: `${definition.programSets} sets x ${definition.programReps} reps`,
      icon: "fitness_center",
      thumbnail: definition.thumbnail
    };
  })
};

function buildAugustCalendar(): CalendarDay[] {
  const year = 2026;
  const monthIndex = 7;
  const startDate = new Date(Date.UTC(year, monthIndex, 1));
  const startWeekday = (startDate.getUTCDay() + 6) % 7;
  const firstVisibleDate = new Date(Date.UTC(year, monthIndex, 1 - startWeekday));
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const selectedKey = demoDay.dateKey;
  const selectedDate = new Date(selectedKey);

  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(firstVisibleDate);
    current.setUTCDate(firstVisibleDate.getUTCDate() + index);

    const monthOffset = current.getUTCMonth() < monthIndex ? -1 : current.getUTCMonth() > monthIndex ? 1 : 0;
    const weekdayIndex = (current.getUTCDay() + 6) % 7;
    const isSelected = current.toISOString().startsWith(selectedKey);
    const isToday =
      current.getUTCFullYear() === selectedDate.getUTCFullYear() &&
      current.getUTCMonth() === selectedDate.getUTCMonth() &&
      current.getUTCDate() === selectedDate.getUTCDate();

    return {
      label: weekdays[weekdayIndex].toUpperCase(),
      weekday: weekdays[weekdayIndex],
      day: current.getUTCDate(),
      monthOffset,
      isDimmed: monthOffset !== 0,
      isSelected,
      isToday,
      hasActivity: [1, 2, 3, 5, 6, 8, 10, 11, 14, 15, 18, 20, 22, 24, 26, 28, 30].includes(current.getUTCDate()) && monthOffset === 0,
      completed: current.getUTCDate() === 7 && monthOffset === 0
    };
  });
}

const demoCalendarDays = buildAugustCalendar();

export const coachxDemoState = {
  athlete: demoAthlete,
  day: demoDay,
  nutrition: demoNutritionDay,
  workoutSession: demoWorkoutSession,
  calendar: {
    monthLabel: "August 2026",
    topLabel: "Calendar",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    days: demoCalendarDays
  },
  progress: {
    metrics: [
      { label: "Training Volume", value: "+8%", delta: "vs last week", trend: "up" },
      { label: "Bodyweight", value: "-0.4 kg", delta: "since baseline", trend: "down" },
      { label: "Consistency", value: "5 / 7", delta: "days completed", trend: "steady" }
    ] satisfies ProgressMetric[]
  },
  profile: [
    { label: "Goal", value: demoAthlete.goal },
    { label: "Priorities", value: demoAthlete.priorities },
    { label: "Training", value: demoAthlete.training },
    { label: "Experience", value: demoAthlete.experience },
    { label: "Schedule", value: demoAthlete.schedule },
    { label: "Recovery", value: demoAthlete.recovery },
    { label: "Nutrition", value: demoAthlete.nutrition },
    { label: "Health & Limitations", value: demoAthlete.health },
    { label: "Baseline", value: demoAthlete.baseline }
  ] satisfies ProfileSection[]
};

export const coachxToday = coachxDemoState.day;
export const coachxNutrition = coachxDemoState.nutrition;
export const coachxCalendarDays = coachxDemoState.calendar.days;
export const coachxCalendarWeekdays = coachxDemoState.calendar.weekdays;
export const coachxProgressMetrics = coachxDemoState.progress.metrics;
export const coachxProfile = coachxDemoState.profile;
