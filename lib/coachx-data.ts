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

const demoDay: DemoDay = {
  dateKey: "2026-08-08",
  dateLabel: "Saturday, August 8, 2026",
  calendarLabel: "Saturday August 8",
  phase: "Workout A",
  workoutTitle: "Glutes + Hamstrings",
  workoutType: "Posterior chain emphasis",
  duration: "68 min",
  volume: "7.8k",
  sets: "24",
  primaryTarget: "Glutes",
  secondaryTarget: "Hamstrings",
  workoutCount: "6 exercises",
  nutritionCalories: "2050 kcal",
  macros: "140P · 220C · 60F",
  cardio: "Zone 2 · 20 min",
  habits: "Daily habits 0/5",
  coachInsight:
    "Keep the pelvis neutral on thrusts and hinge with control on every rep. The posterior chain should do the work.",
  muscleFocus: ["glutes", "hamstrings"],
  anatomyKey: "posterior-lower-body",
  movements: [
    {
      name: "Barbell Hip Thrust",
      prescription: "4 sets x 8-10 reps",
      icon: "fitness_center",
      thumbnail: "/stitch-assets/hip_thrust.png"
    },
    {
      name: "Romanian Deadlift",
      prescription: "3 sets x 8-10 reps",
      icon: "sports_gymnastics",
      thumbnail: "/stitch-assets/romanian_deadlift.png"
    },
    {
      name: "Bulgarian Split Squat",
      prescription: "3 sets x 10-12 reps",
      icon: "directions_run"
    },
    {
      name: "Seated Leg Curl",
      prescription: "3 sets x 12-15 reps",
      icon: "airline_seat_recline_normal"
    },
    {
      name: "Cable Kickback",
      prescription: "3 sets x 12-15 reps",
      icon: "self_improvement"
    },
    {
      name: "Walking Lunge",
      prescription: "2 sets x 20 steps",
      icon: "directions_walk"
    }
  ]
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
export const coachxCalendarDays = coachxDemoState.calendar.days;
export const coachxCalendarWeekdays = coachxDemoState.calendar.weekdays;
export const coachxProgressMetrics = coachxDemoState.progress.metrics;
export const coachxProfile = coachxDemoState.profile;
