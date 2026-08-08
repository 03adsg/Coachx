export type BottomTab = "today" | "calendar" | "progress" | "profile";

export interface WorkoutMovement {
  name: string;
  prescription: string;
  icon: string;
  thumbnail?: string;
}

export interface DaySummary {
  dateLabel: string;
  dayTitle: string;
  phase: string;
  workoutTitle: string;
  workoutType: string;
  duration: string;
  volume: string;
  sets: string;
  primaryTarget: string;
  secondaryTarget: string;
  workoutCount: string;
  nutrition: string;
  macros: string;
  cardio: string;
  habits: string;
  coachInsight: string;
  image: string;
  movements: WorkoutMovement[];
}

export interface CalendarDay {
  label: string;
  weekday: string;
  day: number;
  hasActivity?: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  isDimmed?: boolean;
  completed?: boolean;
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

export const coachxToday: DaySummary = {
  dateLabel: "Thursday, Oct 26",
  dayTitle: "Ready, Alex?",
  phase: "Hypertrophy Phase",
  workoutTitle: "Upper Body Power",
  workoutType: "Workout A",
  duration: "65m",
  volume: "8.2k",
  sets: "24",
  primaryTarget: "Chest",
  secondaryTarget: "Triceps",
  workoutCount: "6 exercises",
  nutrition: "2,050 kcal",
  macros: "140P · 220C · 60F",
  cardio: "Zone 2 | 20 min",
  habits: "Daily habits 0/5",
  coachInsight: "Focus today on controlled eccentrics and full chest lockout. Keep 1-2 reps in reserve.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuABq4AlgDw6jXhR_8KQP3becVdnv-QsyrNYbLfvfUJSM8E1OO8unXQ3MA90VR3e6VkRY-xd-hfgIxDY6Mp-9NMpG0dyBMFu14OEheB1jA8s3bDDOdxiO1UwqdxoTMaP7odqD57f2T7l9jfz4SSjNM4de3I8ZNZ-c6G33t2FPh1E8S3tZtkODVsbRzYm2CYTRf3VHA6ccteeb-XvbN-rUK8sT47vhPn8VMbv6JuUXQnsMWoin3Rx59XWAA",
  movements: [
    {
      name: "Barbell Bench Press",
      prescription: "4 sets x 8-10 reps",
      icon: "fitness_center",
      thumbnail: "/stitch-assets/hip_thrust.png"
    },
    {
      name: "Incline Dumbbell Press",
      prescription: "3 sets x 10-12 reps",
      icon: "sports_gymnastics",
      thumbnail: "/stitch-assets/romanian_deadlift.png"
    },
    {
      name: "Cable Crossovers",
      prescription: "3 sets x 12-15 reps",
      icon: "accessibility_new"
    }
  ]
};

export const coachxCalendarDays: CalendarDay[] = [
  { label: "MON", weekday: "Mon", day: 28, isDimmed: true },
  { label: "TUE", weekday: "Tue", day: 29, isDimmed: true },
  { label: "WED", weekday: "Wed", day: 30, isDimmed: true },
  { label: "THU", weekday: "Thu", day: 31, isDimmed: true },
  { label: "FRI", weekday: "Fri", day: 1, hasActivity: true },
  { label: "SAT", weekday: "Sat", day: 2, hasActivity: true },
  { label: "SUN", weekday: "Sun", day: 3, hasActivity: true },
  { label: "MON", weekday: "Mon", day: 4 },
  { label: "TUE", weekday: "Tue", day: 5, hasActivity: true },
  { label: "WED", weekday: "Wed", day: 6, hasActivity: true },
  { label: "THU", weekday: "Thu", day: 7, completed: true },
  { label: "FRI", weekday: "Fri", day: 8, isSelected: true },
  { label: "SAT", weekday: "Sat", day: 9, isToday: true },
  { label: "SUN", weekday: "Sun", day: 10, hasActivity: true },
  { label: "MON", weekday: "Mon", day: 11 },
  { label: "TUE", weekday: "Tue", day: 12, hasActivity: true },
  { label: "WED", weekday: "Wed", day: 13 },
  { label: "THU", weekday: "Thu", day: 14, hasActivity: true },
  { label: "FRI", weekday: "Fri", day: 15, hasActivity: true },
  { label: "SAT", weekday: "Sat", day: 16 }
];

export const coachxProgressMetrics: ProgressMetric[] = [
  { label: "Training Volume", value: "+8%", delta: "vs last week", trend: "up" },
  { label: "Bodyweight", value: "-0.4 kg", delta: "since baseline", trend: "down" },
  { label: "Consistency", value: "5 / 7", delta: "days completed", trend: "steady" }
];

export const coachxProfile: ProfileSection[] = [
  { label: "Goal", value: "Body Recomposition" },
  { label: "Priorities", value: "Glutes · Abdomen · Legs" },
  { label: "Training", value: "4 days / week · 60-75 min · Full gym" },
  { label: "Experience", value: "Intermediate" },
  { label: "Schedule", value: "Evening training · Active workday" },
  { label: "Recovery", value: "6-7h sleep · Moderate stress" },
  { label: "Nutrition", value: "3 meals + snack · Structured" },
  { label: "Health & Limitations", value: "Information reviewed" },
  { label: "Baseline", value: "Measurements added · Photos added" }
];
