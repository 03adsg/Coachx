export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AthleteOnboardingStatus = "not_started" | "in_progress" | "completed";
export type ProgramStatus = "proposed" | "active" | "completed" | "archived";
export type ProgramPhaseStatus = "upcoming" | "active" | "completed" | "archived";
export type ScheduledWorkoutStatus = "scheduled" | "completed" | "skipped" | "rescheduled" | "cancelled";
export type WorkoutSessionStatus = "in_progress" | "completed" | "abandoned";
export type WorkoutSessionExerciseStatus = "planned" | "completed" | "skipped";
export type WorkoutSetStatus = "planned" | "completed" | "skipped";

export interface ProgramsRow {
  id: string;
  user_id: string;
  status: ProgramStatus;
  name: string;
  goal: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgramsInsert {
  id?: string;
  user_id: string;
  status?: ProgramStatus;
  name?: string;
  goal?: string;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramsUpdate {
  status?: ProgramStatus;
  name?: string;
  goal?: string;
  started_at?: string | null;
  completed_at?: string | null;
  updated_at?: string;
}

export interface ProgramPhasesRow {
  id: string;
  program_id: string;
  name: string;
  phase_number: number;
  goal: string;
  start_date: string;
  end_date: string;
  status: ProgramPhaseStatus;
  week_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramPhasesInsert {
  id?: string;
  program_id: string;
  name: string;
  phase_number: number;
  goal: string;
  start_date: string;
  end_date: string;
  status?: ProgramPhaseStatus;
  week_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramPhasesUpdate {
  name?: string;
  phase_number?: number;
  goal?: string;
  start_date?: string;
  end_date?: string;
  status?: ProgramPhaseStatus;
  week_count?: number;
  updated_at?: string;
}

export interface WorkoutTemplatesRow {
  id: string;
  phase_id: string;
  name: string;
  code: string;
  focus: string;
  estimated_duration_minutes: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutTemplatesInsert {
  id?: string;
  phase_id: string;
  name: string;
  code: string;
  focus: string;
  estimated_duration_minutes: number;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutTemplatesUpdate {
  name?: string;
  code?: string;
  focus?: string;
  estimated_duration_minutes?: number;
  sort_order?: number;
  updated_at?: string;
}

export interface WorkoutTemplateExercisesRow {
  id: string;
  workout_template_id: string;
  exercise_key: string;
  sort_order: number;
  sets: number;
  rep_min: number;
  rep_max: number;
  rir_min: number;
  rir_max: number;
  rest_seconds: number;
  notes: string | null;
  prescription_metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface WorkoutTemplateExercisesInsert {
  id?: string;
  workout_template_id: string;
  exercise_key: string;
  sort_order: number;
  sets: number;
  rep_min: number;
  rep_max: number;
  rir_min: number;
  rir_max: number;
  rest_seconds: number;
  notes?: string | null;
  prescription_metadata?: Json;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutTemplateExercisesUpdate {
  exercise_key?: string;
  sort_order?: number;
  sets?: number;
  rep_min?: number;
  rep_max?: number;
  rir_min?: number;
  rir_max?: number;
  rest_seconds?: number;
  notes?: string | null;
  prescription_metadata?: Json;
  updated_at?: string;
}

export interface ScheduledWorkoutsRow {
  id: string;
  user_id: string;
  program_phase_id: string;
  workout_template_id: string;
  scheduled_date: string;
  status: ScheduledWorkoutStatus;
  planned_duration_minutes: number;
  adjustment_metadata: Json | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduledWorkoutsInsert {
  id?: string;
  user_id: string;
  program_phase_id: string;
  workout_template_id: string;
  scheduled_date: string;
  status?: ScheduledWorkoutStatus;
  planned_duration_minutes: number;
  adjustment_metadata?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduledWorkoutsUpdate {
  program_phase_id?: string;
  workout_template_id?: string;
  scheduled_date?: string;
  status?: ScheduledWorkoutStatus;
  planned_duration_minutes?: number;
  adjustment_metadata?: Json | null;
  updated_at?: string;
}

export interface WorkoutSessionsRow {
  id: string;
  user_id: string;
  scheduled_workout_id: string | null;
  workout_template_id: string | null;
  status: WorkoutSessionStatus;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  notes: string | null;
  session_metadata: Json | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSessionsInsert {
  id?: string;
  user_id: string;
  scheduled_workout_id?: string | null;
  workout_template_id?: string | null;
  status?: WorkoutSessionStatus;
  started_at?: string;
  completed_at?: string | null;
  duration_seconds?: number | null;
  notes?: string | null;
  session_metadata?: Json | null;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutSessionsUpdate {
  scheduled_workout_id?: string | null;
  workout_template_id?: string | null;
  status?: WorkoutSessionStatus;
  started_at?: string;
  completed_at?: string | null;
  duration_seconds?: number | null;
  notes?: string | null;
  session_metadata?: Json | null;
  updated_at?: string;
}

export interface WorkoutSessionExercisesRow {
  id: string;
  workout_session_id: string;
  prescribed_template_exercise_id: string | null;
  prescribed_exercise_key: string;
  performed_exercise_key: string;
  sort_order: number;
  target_sets: number | null;
  rep_min: number | null;
  rep_max: number | null;
  rir_min: number | null;
  rir_max: number | null;
  rest_seconds: number | null;
  notes: string | null;
  swap_reason: string | null;
  status: WorkoutSessionExerciseStatus;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSessionExercisesInsert {
  id?: string;
  workout_session_id: string;
  prescribed_template_exercise_id?: string | null;
  prescribed_exercise_key: string;
  performed_exercise_key: string;
  sort_order: number;
  target_sets?: number | null;
  rep_min?: number | null;
  rep_max?: number | null;
  rir_min?: number | null;
  rir_max?: number | null;
  rest_seconds?: number | null;
  notes?: string | null;
  swap_reason?: string | null;
  status?: WorkoutSessionExerciseStatus;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutSessionExercisesUpdate {
  prescribed_template_exercise_id?: string | null;
  prescribed_exercise_key?: string;
  performed_exercise_key?: string;
  sort_order?: number;
  target_sets?: number | null;
  rep_min?: number | null;
  rep_max?: number | null;
  rir_min?: number | null;
  rir_max?: number | null;
  rest_seconds?: number | null;
  notes?: string | null;
  swap_reason?: string | null;
  status?: WorkoutSessionExerciseStatus;
  started_at?: string | null;
  completed_at?: string | null;
  updated_at?: string;
}

export interface WorkoutSetsRow {
  id: string;
  workout_session_exercise_id: string;
  set_number: number;
  status: WorkoutSetStatus;
  weight_kg: number | null;
  reps: number | null;
  rir: number | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSetsInsert {
  id?: string;
  workout_session_exercise_id: string;
  set_number: number;
  status?: WorkoutSetStatus;
  weight_kg?: number | null;
  reps?: number | null;
  rir?: number | null;
  completed_at?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutSetsUpdate {
  status?: WorkoutSetStatus;
  weight_kg?: number | null;
  reps?: number | null;
  rir?: number | null;
  completed_at?: string | null;
  notes?: string | null;
  updated_at?: string;
}

export interface AthleteProfilesRow {
  id: string;
  display_name: string;
  age_years: number | null;
  date_of_birth: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  unit_system: "metric" | "imperial";
  onboarding_status: AthleteOnboardingStatus;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AthleteProfilesInsert {
  id: string;
  display_name?: string;
  age_years?: number | null;
  date_of_birth?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  unit_system?: "metric" | "imperial";
  onboarding_status?: AthleteOnboardingStatus;
  onboarding_completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AthleteProfilesUpdate {
  display_name?: string;
  age_years?: number | null;
  date_of_birth?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  unit_system?: "metric" | "imperial";
  onboarding_status?: AthleteOnboardingStatus;
  onboarding_completed_at?: string | null;
  updated_at?: string;
}

export interface AthletePreferencesRow {
  id: string;
  user_id: string;
  goals: Json;
  training_preferences: Json;
  schedule_lifestyle: Json;
  health_limitations: Json;
  nutrition_preferences: Json;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface AthletePreferencesInsert {
  id?: string;
  user_id: string;
  goals?: Json;
  training_preferences?: Json;
  schedule_lifestyle?: Json;
  health_limitations?: Json;
  nutrition_preferences?: Json;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AthletePreferencesUpdate {
  goals?: Json;
  training_preferences?: Json;
  schedule_lifestyle?: Json;
  health_limitations?: Json;
  nutrition_preferences?: Json;
  version?: number;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      athlete_profiles: {
        Row: AthleteProfilesRow;
        Insert: AthleteProfilesInsert;
        Update: AthleteProfilesUpdate;
        Relationships: [];
      };
      athlete_preferences: {
        Row: AthletePreferencesRow;
        Insert: AthletePreferencesInsert;
        Update: AthletePreferencesUpdate;
        Relationships: [];
      };
      programs: {
        Row: ProgramsRow;
        Insert: ProgramsInsert;
        Update: ProgramsUpdate;
        Relationships: [];
      };
      program_phases: {
        Row: ProgramPhasesRow;
        Insert: ProgramPhasesInsert;
        Update: ProgramPhasesUpdate;
        Relationships: [];
      };
      workout_templates: {
        Row: WorkoutTemplatesRow;
        Insert: WorkoutTemplatesInsert;
        Update: WorkoutTemplatesUpdate;
        Relationships: [];
      };
      workout_template_exercises: {
        Row: WorkoutTemplateExercisesRow;
        Insert: WorkoutTemplateExercisesInsert;
        Update: WorkoutTemplateExercisesUpdate;
        Relationships: [];
      };
      scheduled_workouts: {
        Row: ScheduledWorkoutsRow;
        Insert: ScheduledWorkoutsInsert;
        Update: ScheduledWorkoutsUpdate;
        Relationships: [];
      };
      workout_sessions: {
        Row: WorkoutSessionsRow;
        Insert: WorkoutSessionsInsert;
        Update: WorkoutSessionsUpdate;
        Relationships: [];
      };
      workout_session_exercises: {
        Row: WorkoutSessionExercisesRow;
        Insert: WorkoutSessionExercisesInsert;
        Update: WorkoutSessionExercisesUpdate;
        Relationships: [];
      };
      workout_sets: {
        Row: WorkoutSetsRow;
        Insert: WorkoutSetsInsert;
        Update: WorkoutSetsUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      complete_workout_session: {
        Args: {
          p_workout_session_id: string;
          p_duration_seconds?: number | null;
          p_notes?: string | null;
        };
        Returns: WorkoutSessionsRow;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
