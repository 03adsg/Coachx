import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  ProgramsRow,
  ProgramsInsert,
  ProgramPhasesRow,
  ProgramPhasesInsert,
  Json,
  ScheduledWorkoutsRow,
  ScheduledWorkoutsInsert,
  ScheduledWorkoutsUpdate,
  ScheduledWorkoutStatus,
  WorkoutTemplateExercisesRow,
  WorkoutTemplateExercisesInsert,
  WorkoutTemplatesRow,
  WorkoutTemplatesInsert
} from "@/lib/supabase/database.types";
import { createOnboardingDemoState, type ProgramState } from "@/lib/onboarding-data";
import { formatDate, getCurrentLocale } from "@/lib/i18n";
import { getExerciseDefinition, type SessionAdjustmentState, type WorkoutSessionState } from "@/lib/workout-data";
import { resolveAnatomyVisual } from "@/lib/anatomy";
import type { MuscleGroup } from "@/lib/coachx-data";

export interface ProgramTemplateExercise {
  exerciseKey: string;
  sortOrder: number;
  sets: number;
  repMin: number;
  repMax: number;
  rirMin: number;
  rirMax: number;
  restSeconds: number;
  notes: string;
}

export interface ProgramTemplateView {
  id: string;
  code: string;
  name: string;
  focus: string;
  estimatedDurationMinutes: number;
  sortOrder: number;
  exercises: ProgramTemplateExercise[];
}

export interface ProgramPhaseView {
  id: string;
  name: string;
  phaseNumber: number;
  goal: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed" | "archived";
  weekCount: number;
  templates: ProgramTemplateView[];
}

export interface ScheduledWorkoutView {
  id: string;
  userId: string;
  programPhaseId: string;
  workoutTemplateId: string;
  scheduledDate: string;
  status: ScheduledWorkoutStatus;
  plannedDurationMinutes: number;
  adjustmentMetadata: Record<string, unknown> | null;
}

export interface ProgramBundle {
  program: ProgramsRow;
  phase: ProgramPhasesRow;
  templates: WorkoutTemplatesRow[];
  templateExercises: WorkoutTemplateExercisesRow[];
  scheduledWorkouts: ScheduledWorkoutsRow[];
}

export interface ProgramDaySummary {
  dateKey: string;
  dateLabel: string;
  calendarLabel: string;
  phase: string;
  workoutTitle: string;
  workoutBadge: string;
  workoutType: string;
  duration: string;
  volume: string;
  sets: string;
  workoutCount: string;
  primaryTarget: string;
  secondaryTarget: string;
  coachInsight: string;
  nutritionCalories: string;
  macros: string;
  cardio: string;
  habits: string;
  muscleFocus: MuscleGroup[];
  anatomyKey: string;
  movements: Array<{ name: string; prescription: string; icon: string; thumbnail?: string }>;
  scheduledWorkoutId: string;
  templateCode: string;
  isRestDay: boolean;
}

export interface ProgramCalendarDay {
  key: string;
  day: number;
  weekday: string;
  monthOffset: -1 | 0 | 1;
  isDimmed: boolean;
  isSelected: boolean;
  isToday: boolean;
  hasActivity: boolean;
  completed: boolean;
  label: string;
}

export interface ProgramBundleView {
  source: "remote" | "demo" | "empty";
  program: ProgramState | null;
  activeProgram: ProgramsRow | null;
  activePhase: ProgramPhasesRow | null;
  templates: WorkoutTemplatesRow[];
  templateExercises: WorkoutTemplateExercisesRow[];
  scheduledWorkouts: ScheduledWorkoutsRow[];
  selectedDateKey: string | null;
  monthLabel: string | null;
  weekdays: string[];
}

const programStatusValues = ["proposed", "active", "completed", "archived"] as const;
const phaseStatusValues = ["upcoming", "active", "completed", "archived"] as const;
const scheduledWorkoutStatusValues = ["scheduled", "completed", "skipped", "rescheduled", "cancelled"] as const;
const jsonSchema: z.ZodType<Json> = z.custom<Json>(() => true);
const nullableJsonSchema = jsonSchema.nullable();

const programsRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.enum(programStatusValues),
  name: z.string(),
  goal: z.string(),
  started_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string()
});

const phasesRowSchema = z.object({
  id: z.string().uuid(),
  program_id: z.string().uuid(),
  name: z.string(),
  phase_number: z.number().int(),
  goal: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  status: z.enum(phaseStatusValues),
  week_count: z.number().int(),
  created_at: z.string(),
  updated_at: z.string()
});

const templatesRowSchema = z.object({
  id: z.string().uuid(),
  phase_id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  focus: z.string(),
  estimated_duration_minutes: z.number().int(),
  sort_order: z.number().int(),
  created_at: z.string(),
  updated_at: z.string()
});

const templateExerciseRowSchema = z.object({
  id: z.string().uuid(),
  workout_template_id: z.string().uuid(),
  exercise_key: z.string(),
  sort_order: z.number().int(),
  sets: z.number().int(),
  rep_min: z.number().int(),
  rep_max: z.number().int(),
  rir_min: z.number().int(),
  rir_max: z.number().int(),
  rest_seconds: z.number().int(),
  notes: z.string().nullable(),
  prescription_metadata: jsonSchema,
  created_at: z.string(),
  updated_at: z.string()
});

const scheduledWorkoutRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  program_phase_id: z.string().uuid(),
  workout_template_id: z.string().uuid(),
  scheduled_date: z.string(),
  status: z.enum(scheduledWorkoutStatusValues),
  planned_duration_minutes: z.number().int(),
  adjustment_metadata: nullableJsonSchema,
  created_at: z.string(),
  updated_at: z.string()
});

const demoStartDate = "2026-08-08";
function weekdayLabelsFor(locale: string) {
  const dates = ["2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07", "2026-08-08", "2026-08-09"];
  return dates.map((dateKey) => new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(new Date(`${dateKey}T00:00:00Z`)));
}

const templateSeed = [
  {
    code: "WORKOUT_A",
    name: "Glutes + Hamstrings",
    focus: "Posterior chain emphasis",
    estimatedDurationMinutes: 68,
    sortOrder: 1,
    exercises: [
      { exerciseKey: "barbell-hip-thrust", sortOrder: 1, sets: 4, repMin: 8, repMax: 10, rirMin: 1, rirMax: 2, restSeconds: 120, notes: "Own the lockout." },
      { exerciseKey: "romanian-deadlift", sortOrder: 2, sets: 3, repMin: 8, repMax: 10, rirMin: 1, rirMax: 2, restSeconds: 120, notes: "Keep the hinge controlled." },
      { exerciseKey: "bulgarian-split-squat", sortOrder: 3, sets: 3, repMin: 10, repMax: 12, rirMin: 1, rirMax: 2, restSeconds: 90, notes: "Stay tall through the torso." },
      { exerciseKey: "seated-leg-curl", sortOrder: 4, sets: 3, repMin: 12, repMax: 15, rirMin: 1, rirMax: 2, restSeconds: 75, notes: "Control the lowering phase." },
      { exerciseKey: "cable-kickback", sortOrder: 5, sets: 3, repMin: 12, repMax: 15, rirMin: 1, rirMax: 2, restSeconds: 60, notes: "Keep the pelvis still." },
      { exerciseKey: "walking-lunge", sortOrder: 6, sets: 2, repMin: 20, repMax: 20, rirMin: 1, rirMax: 2, restSeconds: 75, notes: "Finish under control." }
    ]
  },
  {
    code: "UPPER_A",
    name: "Upper Body Power",
    focus: "Chest + back balance",
    estimatedDurationMinutes: 60,
    sortOrder: 2,
    exercises: [
      { exerciseKey: "chest-press", sortOrder: 1, sets: 4, repMin: 8, repMax: 10, rirMin: 1, rirMax: 2, restSeconds: 90, notes: "Press with a stable chest." },
      { exerciseKey: "lat-pulldown", sortOrder: 2, sets: 4, repMin: 8, repMax: 10, rirMin: 1, rirMax: 2, restSeconds: 90, notes: "Pull elbows down and back." },
      { exerciseKey: "cable-pull-through", sortOrder: 3, sets: 3, repMin: 12, repMax: 15, rirMin: 1, rirMax: 2, restSeconds: 60, notes: "Keep the hips loaded." }
    ]
  },
  {
    code: "LOWER_B",
    name: "Glutes + Legs",
    focus: "Lower-body balance",
    estimatedDurationMinutes: 66,
    sortOrder: 3,
    exercises: [
      { exerciseKey: "glute-drive-machine", sortOrder: 1, sets: 4, repMin: 8, repMax: 10, rirMin: 1, rirMax: 2, restSeconds: 120, notes: "Drive through the heels." },
      { exerciseKey: "smith-hip-thrust", sortOrder: 2, sets: 3, repMin: 8, repMax: 10, rirMin: 1, rirMax: 2, restSeconds: 120, notes: "Keep the bar path steady." },
      { exerciseKey: "dumbbell-hip-thrust", sortOrder: 3, sets: 3, repMin: 10, repMax: 12, rirMin: 1, rirMax: 2, restSeconds: 90, notes: "Own the top squeeze." },
      { exerciseKey: "cable-pull-through", sortOrder: 4, sets: 3, repMin: 12, repMax: 15, rirMin: 1, rirMax: 2, restSeconds: 60, notes: "Keep tension through the hinge." }
    ]
  },
  {
    code: "RECOVERY",
    name: "Recovery",
    focus: "Zone 2 + mobility",
    estimatedDurationMinutes: 30,
    sortOrder: 4,
    exercises: [
      { exerciseKey: "walking-lunge", sortOrder: 1, sets: 2, repMin: 20, repMax: 20, rirMin: 3, rirMax: 3, restSeconds: 60, notes: "Keep the pace easy and controlled." }
    ]
  }
] satisfies Array<{
  code: string;
  name: string;
  focus: string;
  estimatedDurationMinutes: number;
  sortOrder: number;
  exercises: ProgramTemplateExercise[];
}>;

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeDateKey(value: string) {
  return value.slice(0, 10);
}

function formatDateLabel(dateKey: string) {
  return formatDate(new Date(`${dateKey}T00:00:00Z`), { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function formatCalendarLabel(dateKey: string) {
  return formatDate(new Date(`${dateKey}T00:00:00Z`), { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function formatMonthLabel(dateKey: string) {
  return formatDate(new Date(`${dateKey}T00:00:00Z`), { month: "long", year: "numeric", timeZone: "UTC" });
}

function addDays(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function buildTemplateSeedRows(phaseId: string): Array<WorkoutTemplatesInsert & { exercises: Array<WorkoutTemplateExercisesInsert> }> {
  return templateSeed.map((template) => ({
    id: createId(),
    phase_id: phaseId,
    name: template.name,
    code: template.code,
    focus: template.focus,
    estimated_duration_minutes: template.estimatedDurationMinutes,
    sort_order: template.sortOrder,
    exercises: template.exercises.map((exercise) => ({
      id: createId(),
      workout_template_id: "",
      exercise_key: exercise.exerciseKey,
      sort_order: exercise.sortOrder,
      sets: exercise.sets,
      rep_min: exercise.repMin,
      rep_max: exercise.repMax,
      rir_min: exercise.rirMin,
      rir_max: exercise.rirMax,
      rest_seconds: exercise.restSeconds,
      notes: exercise.notes,
      prescription_metadata: {
        origin: "coachx-demo",
        label: template.code
      } satisfies Json
    }))
  }));
}

function buildScheduledWorkoutRows(userId: string, phaseId: string, templates: WorkoutTemplatesRow[], startDate: string): ScheduledWorkoutsInsert[] {
  const workoutTemplateIds = new Map(templates.map((template) => [template.code, template.id]));
  const schedulePattern = [
    { offset: 0, code: "WORKOUT_A" },
    { offset: 2, code: "UPPER_A" },
    { offset: 4, code: "LOWER_B" },
    { offset: 6, code: "RECOVERY" }
  ] as const;

  const rows: ScheduledWorkoutsInsert[] = [];
  for (let week = 0; week < 8; week += 1) {
    for (const item of schedulePattern) {
      const templateId = workoutTemplateIds.get(item.code);
      if (!templateId) {
        continue;
      }

      rows.push({
        id: createId(),
        user_id: userId,
        program_phase_id: phaseId,
        workout_template_id: templateId,
        scheduled_date: addDays(startDate, week * 7 + item.offset),
        status: "scheduled",
        planned_duration_minutes: templates.find((template) => template.id === templateId)?.estimated_duration_minutes ?? 60,
        adjustment_metadata: null as Json | null
      });
    }
  }

  return rows;
}

function buildMuscleFocus(templateExercises: WorkoutTemplateExercisesRow[]): MuscleGroup[] {
  const focus = new Set<MuscleGroup>();

  for (const row of templateExercises) {
    const definition = getExerciseDefinition(row.exercise_key);
    definition.primaryMuscles.forEach((muscle) => focus.add(muscle));
    definition.secondaryMuscles.forEach((muscle) => focus.add(muscle));
  }

  return Array.from(focus);
}

function buildWorkoutBadge(templateCode: string) {
  switch (templateCode) {
    case "WORKOUT_A":
      return "Workout A";
    case "UPPER_A":
      return "Workout B";
    case "LOWER_B":
      return "Workout C";
    case "RECOVERY":
      return "Recovery";
    default:
      return "Workout";
  }
}

function buildWorkoutTitle(template: WorkoutTemplatesRow) {
  return template.name;
}

function buildWorkoutType(template: WorkoutTemplatesRow) {
  return template.focus;
}

function buildVolumeLabel(templateCode: string) {
  switch (templateCode) {
    case "WORKOUT_A":
      return "7.8k";
    case "UPPER_A":
      return "6.1k";
    case "LOWER_B":
      return "7.2k";
    case "RECOVERY":
      return "2.4k";
    default:
      return "â€”";
  }
}

function buildInsight(templateCode: string) {
  switch (templateCode) {
    case "WORKOUT_A":
      return "Keep the pelvis neutral on thrusts and hinge with control on every rep.";
    case "UPPER_A":
      return "Stay tall through the torso and keep the pull pattern smooth.";
    case "LOWER_B":
      return "Maintain stable foot pressure and own the top squeeze.";
    case "RECOVERY":
      return "Keep the recovery slot calm and repeatable.";
    default:
      return "Follow the plan with controlled reps and clean execution.";
  }
}

function buildCurrentProgram(program: ProgramsRow, phase: ProgramPhasesRow, templates: WorkoutTemplatesRow[], templateExercises: WorkoutTemplateExercisesRow[]): ProgramState {
  const base = createOnboardingDemoState().program;
  const exerciseCodes = templates
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((template) => template.code);

  const keyMovements = templateExercises
    .map((exercise) => getExerciseDefinition(exercise.exercise_key).name)
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 4);

  return {
    ...base,
    status: program.status === "active" ? "active" : "proposed",
    phaseLabel: phase.name,
    goal: program.goal,
    duration: `${phase.week_count} weeks`,
    firstWorkout: templates[0]?.name ?? "Workout A",
    workoutTemplates: exerciseCodes.map((code) => {
      switch (code) {
        case "WORKOUT_A":
          return "Lower A";
        case "UPPER_A":
          return "Upper";
        case "LOWER_B":
          return "Lower B";
        case "RECOVERY":
          return "Recovery";
        default:
          return code;
      }
    }),
    keyMovements: keyMovements.length > 0 ? keyMovements : base.keyMovements,
    recentAdjustments: ["No recent active adjustments"],
    activatedAt: program.started_at,
    currentPhase: phase.name,
    previousPhase: "Initial setup",
    completedPhase: "Baseline collected",
    recommendation: base.recommendation
  };
}

export function createDemoProgramBundle(userId: string): ProgramBundle {
  const program = {
    id: createId(),
    user_id: userId,
    status: "active" as const,
    name: "Phase 1",
    goal: "Body Recomposition",
    started_at: new Date("2026-08-08T08:00:00.000Z").toISOString(),
    completed_at: null,
    created_at: new Date("2026-08-08T08:00:00.000Z").toISOString(),
    updated_at: new Date("2026-08-08T08:00:00.000Z").toISOString()
  };

  const phase = {
    id: createId(),
    program_id: program.id,
    name: "Phase 1",
    phase_number: 1,
    goal: "Body Recomposition",
    start_date: demoStartDate,
    end_date: addDays(demoStartDate, 55),
    status: "active" as const,
    week_count: 8,
    created_at: program.created_at,
    updated_at: program.updated_at
  };

  const templateSeeds = buildTemplateSeedRows(phase.id);

  const templates: WorkoutTemplatesRow[] = templateSeeds.map((template) => {
    const templateId = template.id ?? createId();
    return {
      id: templateId,
      phase_id: phase.id,
      name: template.name,
      code: template.code,
      focus: template.focus,
      estimated_duration_minutes: template.estimated_duration_minutes,
      sort_order: template.sort_order,
      created_at: program.created_at,
      updated_at: program.updated_at
    } satisfies WorkoutTemplatesRow;
  });

  const templateExercises = templateSeeds.flatMap((template) =>
    template.exercises.map((exercise) => ({
      ...exercise,
      workout_template_id: templates.find((entry) => entry.code === template.code)?.id ?? "",
      created_at: program.created_at,
      updated_at: program.updated_at
    }))
  ) as WorkoutTemplateExercisesRow[];

  const scheduledWorkouts = buildScheduledWorkoutRows(userId, phase.id, templates, demoStartDate).map((row) => ({
    ...row,
    created_at: program.created_at,
    updated_at: program.updated_at
  })) as ScheduledWorkoutsRow[];

  return {
    program,
    phase,
    templates,
    templateExercises,
    scheduledWorkouts
  };
}

export function buildProgramBundleFromProposal(userId: string, proposal: ProgramState): ProgramBundle {
  const bundle = createDemoProgramBundle(userId);
  const startedAt = proposal.activatedAt ?? new Date().toISOString();

  return {
    program: {
      ...bundle.program,
      status: "active",
      name: proposal.phaseLabel,
      goal: proposal.goal,
      started_at: startedAt,
      updated_at: startedAt
    },
    phase: {
      ...bundle.phase,
      name: proposal.phaseLabel,
      goal: proposal.goal,
      status: "active",
      start_date: demoStartDate,
      end_date: addDays(demoStartDate, 55),
      week_count: 8,
      updated_at: startedAt
    },
    templates: bundle.templates.map((template, index) => ({
      ...template,
      sort_order: index + 1,
      updated_at: startedAt
    })),
    templateExercises: bundle.templateExercises.map((exercise) => ({
      ...exercise,
      updated_at: startedAt
    })),
    scheduledWorkouts: bundle.scheduledWorkouts.map((row) => ({
      ...row,
      updated_at: startedAt
    }))
  };
}

export function createProgramBundleFromRows(program: ProgramsRow, phase: ProgramPhasesRow, templates: WorkoutTemplatesRow[], templateExercises: WorkoutTemplateExercisesRow[], scheduledWorkouts: ScheduledWorkoutsRow[]) {
  return {
    source: "remote" as const,
    program: buildCurrentProgram(program, phase, templates, templateExercises),
    activeProgram: programsRowSchema.parse(program),
    activePhase: phasesRowSchema.parse(phase),
    templates: templates.map((template) => templatesRowSchema.parse(template)),
    templateExercises: templateExercises.map((exercise) => templateExerciseRowSchema.parse(exercise)),
    scheduledWorkouts: scheduledWorkouts.map((row) => scheduledWorkoutRowSchema.parse(row)),
    selectedDateKey: scheduledWorkouts[0]?.scheduled_date ?? null,
    monthLabel: scheduledWorkouts[0] ? formatMonthLabel(scheduledWorkouts[0].scheduled_date) : null,
    weekdays: [...weekdayLabelsFor(getCurrentLocale())]
  } satisfies ProgramBundleView;
}

export async function loadProgramBundle(client: SupabaseClient<Database>, userId: string): Promise<ProgramBundleView | null> {
  const programResult = await client.from("programs").select("*").eq("user_id", userId).eq("status", "active").maybeSingle();

  if (programResult.error) {
    throw programResult.error;
  }

  if (!programResult.data) {
    return null;
  }

  const program = programResult.data as ProgramsRow;
  const phaseResult = await client.from("program_phases").select("*").eq("program_id", program.id).order("phase_number", { ascending: true }).limit(1).maybeSingle();
  if (phaseResult.error) {
    throw phaseResult.error;
  }

  if (!phaseResult.data) {
    return null;
  }

  const phase = phaseResult.data as ProgramPhasesRow;
  const templatesResult = await client.from("workout_templates").select("*").eq("phase_id", phase.id).order("sort_order", { ascending: true });

  if (templatesResult.error) {
    throw templatesResult.error;
  }

  const templateRows = (templatesResult.data ?? []) as WorkoutTemplatesRow[];
  const templateIds = templateRows.map((row) => row.id);
  const [exercisesResult, scheduleResult] = await Promise.all([
    client.from("workout_template_exercises").select("*").in("workout_template_id", templateIds).order("sort_order", { ascending: true }),
    client.from("scheduled_workouts").select("*").eq("user_id", userId).order("scheduled_date", { ascending: true })
  ]);

  if (exercisesResult.error) {
    throw exercisesResult.error;
  }

  if (scheduleResult.error) {
    throw scheduleResult.error;
  }

  const templateExercises = (exercisesResult.data ?? []) as WorkoutTemplateExercisesRow[];
  const scheduledWorkouts = (scheduleResult.data ?? []) as ScheduledWorkoutsRow[];

  return {
    source: "remote",
    program: buildCurrentProgram(program, phase, templateRows, templateExercises),
    activeProgram: program,
    activePhase: phase,
    templates: templateRows,
    templateExercises,
    scheduledWorkouts,
    selectedDateKey: scheduledWorkouts[0]?.scheduled_date ?? null,
    monthLabel: scheduledWorkouts[0] ? formatMonthLabel(scheduledWorkouts[0].scheduled_date) : null,
    weekdays: [...weekdayLabelsFor(getCurrentLocale())]
  };
}

export async function saveProgramBundle(client: SupabaseClient<Database>, userId: string, bundle: ProgramBundle) {
  const programPayload: ProgramsInsert[] = [bundle.program];
  const programResult = await client.from("programs").upsert(programPayload as never[], { onConflict: "id" }).select("*").single();
  if (programResult.error) {
    throw programResult.error;
  }
  const savedProgram = programResult.data as ProgramsRow;

  const phasePayload: ProgramPhasesInsert[] = [bundle.phase];
  const phaseResult = await client.from("program_phases").upsert(phasePayload as never[], { onConflict: "id" }).select("*").single();
  if (phaseResult.error) {
    throw phaseResult.error;
  }
  const savedPhase = phaseResult.data as ProgramPhasesRow;

  const templateRows: WorkoutTemplatesInsert[] = bundle.templates.map((template) => ({ ...template, phase_id: savedPhase.id }));
  const templatesResult = await client.from("workout_templates").upsert(templateRows as never[], { onConflict: "id" }).select("*");
  if (templatesResult.error) {
    throw templatesResult.error;
  }
  const savedTemplates = (templatesResult.data ?? []) as WorkoutTemplatesRow[];

  const templateIdMap = new Map(savedTemplates.map((template) => [template.code, template.id]));
  const exerciseRows: WorkoutTemplateExercisesInsert[] = bundle.templateExercises.map((exercise) => ({
    ...exercise,
    workout_template_id: templateIdMap.get(bundle.templates.find((template) => template.id === exercise.workout_template_id)?.code ?? "") ?? exercise.workout_template_id
  }));

  const exercisesResult = await client.from("workout_template_exercises").upsert(exerciseRows as never[], { onConflict: "id" }).select("*");
  if (exercisesResult.error) {
    throw exercisesResult.error;
  }
  const savedExercises = (exercisesResult.data ?? []) as WorkoutTemplateExercisesRow[];

  const scheduleRows: ScheduledWorkoutsInsert[] = bundle.scheduledWorkouts.map((scheduledWorkout) => ({
    ...scheduledWorkout,
    user_id: userId,
    program_phase_id: savedPhase.id,
    workout_template_id: templateIdMap.get(bundle.templates.find((template) => template.id === scheduledWorkout.workout_template_id)?.code ?? "") ?? scheduledWorkout.workout_template_id
  }));

  const scheduleResult = await client.from("scheduled_workouts").upsert(scheduleRows as never[], { onConflict: "user_id,scheduled_date" }).select("*");
  if (scheduleResult.error) {
    throw scheduleResult.error;
  }
  const savedScheduledWorkouts = (scheduleResult.data ?? []) as ScheduledWorkoutsRow[];

  return {
    program: savedProgram,
    phase: savedPhase,
    templates: savedTemplates,
    templateExercises: savedExercises,
    scheduledWorkouts: savedScheduledWorkouts
  };
}

export function getProgramDaySummary(bundle: ProgramBundleView, dateKey: string): ProgramDaySummary | null {
  const scheduledWorkout = bundle.scheduledWorkouts.find((row) => row.scheduled_date === normalizeDateKey(dateKey));
  if (!scheduledWorkout) {
    return {
      dateKey: normalizeDateKey(dateKey),
      dateLabel: formatDateLabel(dateKey),
      calendarLabel: formatCalendarLabel(dateKey),
      phase: bundle.program?.phaseLabel ?? "Phase 1",
      workoutTitle: "Rest Day",
      workoutBadge: "Rest Day",
      workoutType: "Recovery and reset",
      duration: "0 min",
      volume: "â€”",
      sets: "0",
      workoutCount: "0 exercises",
      primaryTarget: "Recovery",
      secondaryTarget: "Hydration",
      coachInsight: "No scheduled workout today. Keep the recovery rhythm steady.",
      nutritionCalories: "2050 kcal",
      macros: "140P Â· 220C Â· 60F",
      cardio: "Zone 2 Â· 20 min",
      habits: "Daily habits 0/5",
      muscleFocus: ["core"],
      anatomyKey: resolveAnatomyVisual(["core"]).key,
      movements: [],
      scheduledWorkoutId: "",
      templateCode: "REST",
      isRestDay: true
    };
  }

  const template = bundle.templates.find((item) => item.id === scheduledWorkout.workout_template_id);
  const templateExerciseRows = bundle.templateExercises
    .filter((exercise) => exercise.workout_template_id === scheduledWorkout.workout_template_id)
    .sort((left, right) => left.sort_order - right.sort_order);
  const focus = buildMuscleFocus(templateExerciseRows);
  const anatomy = resolveAnatomyVisual(focus);
  const primaryMuscle = focus[0] ?? "core";
  const secondaryMuscle = focus[1] ?? focus[0] ?? "core";

  return {
    dateKey: scheduledWorkout.scheduled_date,
    dateLabel: formatDateLabel(scheduledWorkout.scheduled_date),
    calendarLabel: formatCalendarLabel(scheduledWorkout.scheduled_date),
    phase: bundle.program?.phaseLabel ?? "Phase 1",
    workoutTitle: template?.name ?? "Workout",
    workoutBadge: buildWorkoutBadge(template?.code ?? "WORKOUT_A"),
    workoutType: template?.focus ?? "Posterior chain emphasis",
    duration: `${scheduledWorkout.planned_duration_minutes} min`,
    volume: buildVolumeLabel(template?.code ?? "WORKOUT_A"),
    sets: String(templateExerciseRows.reduce((total, exercise) => total + exercise.sets, 0)),
    workoutCount: `${templateExerciseRows.length} exercises`,
    primaryTarget: String(primaryMuscle).replace(/^[a-z]/, (char) => char.toUpperCase()),
    secondaryTarget: String(secondaryMuscle).replace(/^[a-z]/, (char) => char.toUpperCase()),
    coachInsight: buildInsight(template?.code ?? "WORKOUT_A"),
    nutritionCalories: "2050 kcal",
    macros: "140P Â· 220C Â· 60F",
    cardio: "Zone 2 Â· 20 min",
    habits: "Daily habits 0/5",
    muscleFocus: focus,
    anatomyKey: anatomy.key,
    movements: templateExerciseRows.map((exercise) => {
      const definition = getExerciseDefinition(exercise.exercise_key);
      const repRange = exercise.rep_min === exercise.rep_max ? `${exercise.rep_min}` : `${exercise.rep_min}-${exercise.rep_max}`;
      return {
        name: definition.name,
        prescription: `${exercise.sets} sets x ${repRange} reps`,
        icon: "fitness_center",
        thumbnail: definition.thumbnail
      };
    }),
    scheduledWorkoutId: scheduledWorkout.id,
    templateCode: template?.code ?? "WORKOUT_A",
    isRestDay: false
  };
}

export function buildCalendarDays(bundle: ProgramBundleView, monthDateKey: string, selectedDateKey: string) {
  const currentMonth = new Date(`${monthDateKey}T00:00:00Z`);
  const monthIndex = currentMonth.getUTCMonth();
  const year = currentMonth.getUTCFullYear();
  const firstOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  const startWeekday = (firstOfMonth.getUTCDay() + 6) % 7;
  const visibleStart = new Date(Date.UTC(year, monthIndex, 1 - startWeekday));
  const scheduledDates = new Set(bundle.scheduledWorkouts.map((row) => row.scheduled_date));
  const completedDates = new Set(bundle.scheduledWorkouts.filter((row) => row.status === "completed").map((row) => row.scheduled_date));

  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(visibleStart);
    current.setUTCDate(visibleStart.getUTCDate() + index);
    const dateKey = current.toISOString().slice(0, 10);
    const weekdayIndex = (current.getUTCDay() + 6) % 7;
    const monthOffset = current.getUTCMonth() < monthIndex ? -1 : current.getUTCMonth() > monthIndex ? 1 : 0;

    return {
      key: dateKey,
      day: current.getUTCDate(),
      weekday: weekdayLabelsFor(getCurrentLocale())[weekdayIndex],
      monthOffset: monthOffset as -1 | 0 | 1,
      isDimmed: monthOffset !== 0,
      isSelected: dateKey === selectedDateKey,
      isToday: dateKey === selectedDateKey,
      hasActivity: scheduledDates.has(dateKey),
      completed: completedDates.has(dateKey),
      label: weekdayLabelsFor(getCurrentLocale())[weekdayIndex].toUpperCase()
    } satisfies ProgramCalendarDay;
  });
}

function buildWorkoutSessionExercise(seed: ProgramTemplateExercise, index: number, templateLength: number) {
  const definition = getExerciseDefinition(seed.exerciseKey);
  return {
    id: `${seed.exerciseKey}-${index + 1}`,
    prescribedExerciseId: seed.exerciseKey,
    performedExerciseId: seed.exerciseKey,
    order: index + 1,
    totalExercises: templateLength,
    totalSets: seed.sets,
    targetRir: `${seed.rirMin}-${seed.rirMax}`,
    restSeconds: seed.restSeconds,
    lastComparableSession: definition.lastPerformance,
    suggestedTarget: definition.progressionTarget,
    sets: Array.from({ length: seed.sets }, (_, setIndex) => ({
      setNumber: setIndex + 1,
      previous: definition.lastPerformance,
      kilograms: "",
      reps: "",
      completed: false
    })),
    completedSets: []
  };
}

export function buildWorkoutSessionFromDaySummary(day: ProgramDaySummary, template: ProgramTemplateView): WorkoutSessionState {
  const base = createOnboardingDemoState();
  const exercises = template.exercises.map((exercise, index) => buildWorkoutSessionExercise(exercise, index, template.exercises.length));
  const totalSets = template.exercises.reduce((total, exercise) => total + exercise.sets, 0);
  const adjustment: SessionAdjustmentState = {
    reason: "I can't train today",
    selectedTime: "30 min",
    recommendation: base.program.recommendation.summary,
    applied: false
  };

  return {
    id: day.scheduledWorkoutId,
    dateLabel: day.dateLabel,
    workoutLabel: day.workoutTitle.toUpperCase(),
    phaseLabel: day.workoutBadge.toUpperCase(),
    subtitle: `${day.workoutCount} · ${day.duration} | Hypertrophy | Target RIR 1-2`,
    totalExercises: template.exercises.length,
    totalSets,
    lastSessionLabel: "LAST SESSION JULY 31 | COMPLETED · 66 MIN",
    workoutType: day.workoutTitle.toUpperCase(),
    targetRir: "1-2",
    exercises,
    restTimer: null,
    adjustment,
    safety: { feeling: null, location: "lower back", intensity: 5, movementPhase: "top of movement", action: "Use an alternative exercise" },
    summary: {
      duration: day.duration,
      exercisesCompleted: `${template.exercises.length} / ${template.exercises.length}`,
      setsCompleted: String(totalSets),
      totalVolume: `${template.code === "WORKOUT_A" ? "4,820" : "4,200"} kg`,
      insight: day.coachInsight,
      nextTime: template.exercises.slice(0, 2).map((exercise) => {
        const definition = getExerciseDefinition(exercise.exerciseKey);
        return {
          label: `${definition.name.toUpperCase()}: ${exercise.repMin === exercise.repMax ? exercise.repMin : `${exercise.repMin}-${exercise.repMax}`} reps`,
          detail: `Target: ${exercise.sets} sets at RIR ${exercise.rirMin}-${exercise.rirMax}`
        };
      }),
      feedback: ["Too Easy", "Good", "Challenging"]
    }
  };
}

export async function loadOrCreateProgramBundle(client: SupabaseClient<Database>, userId: string, demoMode = false) {
  const remote = await loadProgramBundle(client, userId);
  if (remote) {
    return remote;
  }

  if (demoMode) {
    const bundle = createDemoProgramBundle(userId);
    return {
      source: "demo" as const,
      program: buildCurrentProgram(bundle.program, bundle.phase, bundle.templates, bundle.templateExercises),
      activeProgram: bundle.program,
      activePhase: bundle.phase,
      templates: bundle.templates,
      templateExercises: bundle.templateExercises,
      scheduledWorkouts: bundle.scheduledWorkouts,
      selectedDateKey: bundle.scheduledWorkouts[0]?.scheduled_date ?? null,
      monthLabel: bundle.scheduledWorkouts[0] ? formatMonthLabel(bundle.scheduledWorkouts[0].scheduled_date) : null,
      weekdays: [...weekdayLabelsFor(getCurrentLocale())]
    } satisfies ProgramBundleView;
  }

  return {
    source: "empty" as const,
    program: null,
    activeProgram: null,
    activePhase: null,
    templates: [],
    templateExercises: [],
    scheduledWorkouts: [],
    selectedDateKey: null,
    monthLabel: null,
    weekdays: [...weekdayLabelsFor(getCurrentLocale())]
  } satisfies ProgramBundleView;
}

export async function activateProgramFromProposal(client: SupabaseClient<Database>, userId: string, proposal: ProgramState) {
  const bundle = buildProgramBundleFromProposal(userId, proposal);
  const saved = await saveProgramBundle(client, userId, bundle);
  return createProgramBundleFromRows(saved.program, saved.phase, saved.templates, saved.templateExercises, saved.scheduledWorkouts);
}

export async function rescheduleWorkout(client: SupabaseClient<Database>, workoutId: string, nextDate: string) {
  const result = await client.from("scheduled_workouts").update({
    scheduled_date: nextDate,
    status: "rescheduled",
    adjustment_metadata: {
      from_date: null,
      to_date: nextDate,
      reason: "manual reschedule"
    } satisfies ScheduledWorkoutsUpdate["adjustment_metadata"]
  } as never).eq("id", workoutId).select("*").single();

  if (result.error) {
    throw result.error;
  }

  return scheduledWorkoutRowSchema.parse(result.data);
}
