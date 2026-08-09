"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuthStore } from "@/components/auth-provider";
import { useProgramStore } from "@/components/program-provider";
import { useOnboardingStore } from "@/components/onboarding-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  applySnapshotToProgram,
  buildProfileReview,
  createNotificationSettings,
  createProfileSnapshot,
  profileStorageKey,
  reviveProfileSettingsState,
  serializeProfileSettingsState,
  type NotificationCategoryId,
  type NotificationPermissionState,
  type NotificationSettings,
  type ProfileEditSection,
  type ProfileImpactReview,
  type ProfileSettingsState,
  type ProfileSnapshot,
  type ReminderIntensity
} from "@/lib/profile-settings-data";
import { buildProfileSnapshotFromOnboarding, loadAthleteSnapshot, mapOnboardingStatus, saveAthleteSnapshot } from "@/lib/athlete-service";

interface ProfileSettingsStoreValue extends ProfileSettingsState {
  commitProfileSnapshot: (nextSnapshot: ProfileSnapshot) => ProfileImpactReview;
  commitNotifications: (nextNotifications: NotificationSettings) => void;
  updateNotificationCategory: (categoryId: NotificationCategoryId, enabled: boolean) => void;
  setNotificationPermission: (permission: NotificationPermissionState) => void;
  setReminderIntensity: (intensity: ReminderIntensity) => void;
  setQuietHours: (patch: Partial<NotificationSettings["quietHours"]>) => void;
  clearPendingReview: () => void;
  applyPendingReview: () => void;
  markSaveError: (message: string) => void;
  resetProfileSettings: () => void;
  sectionOrder: Array<{ id: ProfileEditSection; label: string; route: string; summary: string }>;
}

const ProfileSettingsContext = createContext<ProfileSettingsStoreValue | null>(null);

export function ProfileSettingsProvider({ children }: { children: ReactNode }) {
  const auth = useAuthStore();
  const authRef = useRef(auth);
  const programStore = useProgramStore();
  const programStoreRef = useRef(programStore);
  const onboarding = useOnboardingStore();
  const onboardingRef = useRef(onboarding);
  const [state, setState] = useState<ProfileSettingsState>(() =>
    typeof window === "undefined" ? reviveProfileSettingsState(null) : reviveProfileSettingsState(window.localStorage.getItem(profileStorageKey))
  );

  useEffect(() => {
    onboardingRef.current = onboarding;
  }, [onboarding]);

  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  useEffect(() => {
    programStoreRef.current = programStore;
  }, [programStore]);

  useEffect(() => {
    window.localStorage.setItem(profileStorageKey, serializeProfileSettingsState(state));
  }, [state]);

  useEffect(() => {
    if (!auth.ready) {
      return;
    }

    let active = true;

    async function hydrateFromRemote() {
      const client = getSupabaseBrowserClient();
      const currentAuth = authRef.current;

      if (!currentAuth.isConfigured || !currentAuth.user || !client) {
        return;
      }

      try {
        const remote = await loadAthleteSnapshot(client, currentAuth.user.id);
        if (!active) {
          return;
        }

        if (remote.source === "default") {
          await saveAthleteSnapshot(
            client,
            currentAuth.user.id,
            state.saved,
            mapOnboardingStatus(onboardingRef.current.state.progress.status),
            onboardingRef.current.state.progress.status === "complete" ? new Date().toISOString() : null
          );
          return;
        }

        setState((current) => ({
          ...current,
          saved: remote.snapshot,
          pendingReview: null,
          saveState: "saved",
          saveError: null,
          lastSavedLabel: "Loaded from Supabase"
        }));
        onboardingRef.current.setProfile(remote.snapshot.profile);
        onboardingRef.current.setGoals(remote.snapshot.goals);
        onboardingRef.current.setTrainingPreferences(remote.snapshot.trainingPreferences);
        onboardingRef.current.setScheduleLifestyle(remote.snapshot.scheduleLifestyle);
        onboardingRef.current.setHealthLimitations(remote.snapshot.healthLimitations);
        onboardingRef.current.setNutritionPreferences(remote.snapshot.nutritionPreferences);
        onboardingRef.current.setProgram(applySnapshotToProgram(onboardingRef.current.program, remote.snapshot));
        if (!remote.preferencesPresent) {
          await saveAthleteSnapshot(
            client,
            currentAuth.user.id,
            remote.snapshot,
            mapOnboardingStatus(onboardingRef.current.state.progress.status),
            onboardingRef.current.state.progress.status === "complete" ? new Date().toISOString() : null
          );
        }
      } catch {
        if (active) {
          setState((current) => ({
            ...current,
            saveState: "error",
            saveError: "Unable to load saved profile from Supabase."
          }));
        }
      }
    }

    void hydrateFromRemote();

    return () => {
      active = false;
    };
  }, [auth.isConfigured, auth.ready, auth.user?.id]);

  async function persistSnapshot(nextSnapshot: ProfileSnapshot) {
    const client = getSupabaseBrowserClient();
    const currentAuth = authRef.current;

    if (!currentAuth.isConfigured || !currentAuth.user || !client) {
      return;
    }

    await saveAthleteSnapshot(
      client,
      currentAuth.user.id,
      nextSnapshot,
      mapOnboardingStatus(onboardingRef.current.state.progress.status),
      onboardingRef.current.state.progress.status === "complete" ? new Date().toISOString() : null
    );
  }

  const value = useMemo<ProfileSettingsStoreValue>(() => {
    const commitProfileSnapshot: ProfileSettingsStoreValue["commitProfileSnapshot"] = (nextSnapshot) => {
      const currentOnboarding = onboardingRef.current;
      const review = buildProfileReview(state.saved, nextSnapshot, programStoreRef.current.program ?? currentOnboarding.program);
      setState((current) => ({
        ...current,
        saved: nextSnapshot,
        pendingReview: review,
        saveState: "saved",
        saveError: null,
        lastSavedLabel: "Saved just now"
      }));
      void persistSnapshot(nextSnapshot).catch(() => {
        setState((current) => ({
          ...current,
          saveState: "error",
          saveError: "Unable to save profile to Supabase."
        }));
      });
      return review;
    };

    const commitNotifications: ProfileSettingsStoreValue["commitNotifications"] = (nextNotifications) => {
      setState((current) => ({
        ...current,
        notifications: nextNotifications,
        saveState: "saved",
        saveError: null,
        pendingReview: null,
        lastSavedLabel: "Notifications saved"
      }));
    };

    const updateNotificationCategory: ProfileSettingsStoreValue["updateNotificationCategory"] = (categoryId, enabled) => {
      setState((current) => ({
        ...current,
        notifications: {
          ...current.notifications,
          categories: current.notifications.categories.map((category) => (category.id === categoryId ? { ...category, enabled } : category))
        },
        saveState: "saved",
        saveError: null,
        pendingReview: null,
        lastSavedLabel: "Notification saved"
      }));
    };

    const setNotificationPermission: ProfileSettingsStoreValue["setNotificationPermission"] = (permission) => {
      setState((current) => ({
        ...current,
        notifications: {
          ...current.notifications,
          permission
        }
      }));
    };

    const setReminderIntensity: ProfileSettingsStoreValue["setReminderIntensity"] = (intensity) => {
      setState((current) => ({
        ...current,
        notifications: {
          ...current.notifications,
          intensity
        }
      }));
    };

    const setQuietHours: ProfileSettingsStoreValue["setQuietHours"] = (patch) => {
      setState((current) => ({
        ...current,
        notifications: {
          ...current.notifications,
          quietHours: {
            ...current.notifications.quietHours,
            ...patch
          }
        }
      }));
    };

    const clearPendingReview: ProfileSettingsStoreValue["clearPendingReview"] = () => {
      setState((current) => ({
        ...current,
        pendingReview: null
      }));
    };

    const applyPendingReview: ProfileSettingsStoreValue["applyPendingReview"] = () => {
      if (!state.pendingReview) {
        return;
      }

      const currentOnboarding = onboardingRef.current;
      currentOnboarding.setProfile(state.saved.profile);
      currentOnboarding.setGoals(state.saved.goals);
      currentOnboarding.setTrainingPreferences(state.saved.trainingPreferences);
      currentOnboarding.setScheduleLifestyle(state.saved.scheduleLifestyle);
      currentOnboarding.setHealthLimitations(state.saved.healthLimitations);
      currentOnboarding.setNutritionPreferences(state.saved.nutritionPreferences);
      currentOnboarding.setProgram(applySnapshotToProgram(programStoreRef.current.program ?? currentOnboarding.program, state.saved));

      setState((current) => ({
        ...current,
        pendingReview: null,
        saveState: "saved",
        saveError: null,
        lastSavedLabel: "Program update applied"
      }));
    };

    const markSaveError: ProfileSettingsStoreValue["markSaveError"] = (message) => {
      setState((current) => ({
        ...current,
        saveState: "error",
        saveError: message
      }));
    };

    const resetProfileSettings: ProfileSettingsStoreValue["resetProfileSettings"] = () => {
      const snapshot = createProfileSnapshot();
      const notifications = createNotificationSettings();
      setState({
        saved: snapshot,
        notifications,
        pendingReview: null,
        saveState: "idle",
        saveError: null,
        lastSavedLabel: "Draft not saved yet"
      });
    };

    return {
      ...state,
      commitProfileSnapshot,
      commitNotifications,
      updateNotificationCategory,
      setNotificationPermission,
      setReminderIntensity,
      setQuietHours,
      clearPendingReview,
      applyPendingReview,
      markSaveError,
      resetProfileSettings,
      sectionOrder: [
        { id: "personal", label: "Personal Details", route: "/profile/preferences/personal", summary: "Name, height, weight, units, timezone" },
        { id: "goals", label: "Goals & Priorities", route: "/profile/preferences/goals", summary: "Goal and ordered priorities" },
        { id: "training", label: "Training Preferences", route: "/profile/preferences/training", summary: "Days, duration, equipment, style" },
        { id: "schedule", label: "Schedule & Lifestyle", route: "/profile/preferences/schedule", summary: "Work, sleep, energy, reminders" },
        { id: "nutrition", label: "Nutrition Preferences", route: "/profile/preferences/nutrition", summary: "Meal routine, restrictions, preferences" },
        { id: "health", label: "Health & Limitations", route: "/profile/preferences/health", summary: "Pain, injuries, movement limits" },
        { id: "notifications", label: "Notifications & Reminders", route: "/profile/notifications", summary: "Workout, progress and coaching reminders" }
      ]
    };
  }, [state]);

  return <ProfileSettingsContext.Provider value={value}>{children}</ProfileSettingsContext.Provider>;
}

export function useProfileSettingsStore() {
  const context = useContext(ProfileSettingsContext);

  if (!context) {
    throw new Error("useProfileSettingsStore must be used within ProfileSettingsProvider");
  }

  return context;
}
