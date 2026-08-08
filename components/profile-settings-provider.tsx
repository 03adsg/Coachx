"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useOnboardingStore } from "@/components/onboarding-provider";
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
  const onboarding = useOnboardingStore();
  const [state, setState] = useState<ProfileSettingsState>(() =>
    typeof window === "undefined" ? reviveProfileSettingsState(null) : reviveProfileSettingsState(window.localStorage.getItem(profileStorageKey))
  );

  useEffect(() => {
    window.localStorage.setItem(profileStorageKey, serializeProfileSettingsState(state));
  }, [state]);

  const value = useMemo<ProfileSettingsStoreValue>(() => {
    const commitProfileSnapshot: ProfileSettingsStoreValue["commitProfileSnapshot"] = (nextSnapshot) => {
      const review = buildProfileReview(state.saved, nextSnapshot, onboarding.program);
      setState((current) => ({
        ...current,
        saved: nextSnapshot,
        pendingReview: review,
        saveState: "saved",
        saveError: null,
        lastSavedLabel: "Saved just now"
      }));
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

      onboarding.setProfile(state.saved.profile);
      onboarding.setGoals(state.saved.goals);
      onboarding.setTrainingPreferences(state.saved.trainingPreferences);
      onboarding.setScheduleLifestyle(state.saved.scheduleLifestyle);
      onboarding.setHealthLimitations(state.saved.healthLimitations);
      onboarding.setNutritionPreferences(state.saved.nutritionPreferences);
      onboarding.setProgram(applySnapshotToProgram(onboarding.program, state.saved));

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
  }, [onboarding, state]);

  return <ProfileSettingsContext.Provider value={value}>{children}</ProfileSettingsContext.Provider>;
}

export function useProfileSettingsStore() {
  const context = useContext(ProfileSettingsContext);

  if (!context) {
    throw new Error("useProfileSettingsStore must be used within ProfileSettingsProvider");
  }

  return context;
}
