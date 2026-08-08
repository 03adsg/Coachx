export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AthleteOnboardingStatus = "not_started" | "in_progress" | "completed";

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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
