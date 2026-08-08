"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  activateProgram,
  baselineSeed,
  createOnboardingDemoState,
  createProgramProposal,
  finalizeOnboarding,
  getEntryDestination,
  getResumeOnboardingRoute,
  isNutritionChoiceAllowed,
  markStepComplete,
  reorderPriorityItems,
  type GoalProfile,
  shouldRequireCoachReview,
  type AthleteProfile,
  type BaselinePose,
  type GoalPriority,
  type HealthLimitations,
  type NutritionPreferences,
  type OnboardingState,
  type OnboardingStepId,
  type ProgramState,
  type ScheduleLifestyle,
  type TrainingExperience,
  type TrainingPreferences
} from "@/lib/onboarding-data";
import { createProgressDemoState } from "@/lib/progress-data";
import type { MeasurementType } from "@/lib/progress-data";

interface OnboardingStoreValue {
  state: OnboardingState;
  program: ProgramState;
  entryDestination: string;
  resumeRoute: string;
  startStep: (step: OnboardingStepId) => void;
  completeStep: (step: OnboardingStepId) => void;
  setProfile: (patch: Partial<AthleteProfile>) => void;
  setGoals: (patch: Partial<GoalProfile>) => void;
  setMainGoal: (goal: string) => void;
  reorderPriorities: (fromIndex: number, toIndex: number) => void;
  setTrainingExperience: (patch: Partial<TrainingExperience>) => void;
  setTrainingPreferences: (patch: Partial<TrainingPreferences>) => void;
  setScheduleLifestyle: (patch: Partial<ScheduleLifestyle>) => void;
  setHealthLimitations: (patch: Partial<HealthLimitations>) => void;
  setNutritionPreferences: (patch: Partial<NutritionPreferences>) => void;
  setBaselineMeasurement: (type: Extract<MeasurementType, "weight" | "waist" | "hips" | "thigh">, value: string) => void;
  setBaselinePhoto: (pose: BaselinePose, status: "captured" | "missing" | "retake") => void;
  setResumeStep: (step: OnboardingStepId) => void;
  setCurrentStep: (step: OnboardingStepId) => void;
  setGoalDecision: (value: "KEEP" | "ADJUST") => void;
  setPriorityDecision: (value: "KEEP" | "ADJUST") => void;
  setAthleteFeedback: (value: "Very Good" | "Good" | "Mixed" | "Too Hard" | "Too Easy" | "Not Sure") => void;
  setProgram: (patch: Partial<ProgramState>) => void;
  createProgramProposal: () => void;
  activateProgram: () => void;
  finalizeOnboarding: () => void;
  resetOnboarding: () => void;
  requiresCoachReview: boolean;
  canUseNutritionChoice: (choice: { tags: string[]; ingredients?: string[]; allergens?: string[] }) => boolean;
}

const OnboardingStoreContext = createContext<OnboardingStoreValue | null>(null);
const STORAGE_KEY = "coachx-demo-onboarding-state-v1";

function reviveState(rawValue: string | null) {
  if (!rawValue) {
    return createOnboardingDemoState();
  }

  try {
    const parsed = JSON.parse(rawValue) as OnboardingState;
    return {
      ...createOnboardingDemoState(),
      ...parsed,
      progress: {
        ...createOnboardingDemoState().progress,
        ...parsed.progress
      },
      program: {
        ...createOnboardingDemoState().program,
        ...parsed.program
      }
    };
  } catch {
    return createOnboardingDemoState();
  }
}

function updateProgramActivation() {
  const progress = createProgressDemoState();
  const dateKey = "2026-08-08";
  return {
    ...progress,
    measurement: {
      ...progress.measurement,
      checkpoint: "week-4",
      currentDateLabel: "August 8",
      currentDateKey: dateKey,
      savedAt: new Date().toISOString()
    },
    photos: {
      ...progress.photos,
      selectedCheckpoint: "week-4"
    }
  };
}

function updateMeasurementBaseline(seed: typeof baselineSeed) {
  const progress = createProgressDemoState();
  return {
    ...progress,
    measurement: {
      ...progress.measurement,
      definitions: progress.measurement.definitions.map((definition) => {
        const measurement = seed.measurements.find((item) => item.type === definition.type);
        return measurement ? { ...definition, lastValue: Number(measurement.value), lastDate: measurement.dateLabel } : definition;
      }),
      histories: progress.measurement.histories.map((history) => {
        const measurement = seed.measurements.find((item) => item.type === history.type);
        if (!measurement) {
          return history;
        }

        return {
          ...history,
          entries: [
            {
              type: history.type,
              value: Number(measurement.value),
              unit: measurement.unit,
              dateKey: "2026-08-08"
            }
          ]
        };
      })
    },
    photos: {
      ...progress.photos,
      checkpoints: progress.photos.checkpoints.map((checkpoint) =>
        checkpoint.checkpoint === "baseline"
          ? {
              ...checkpoint,
              photos: {
                ...checkpoint.photos,
                front: { ...checkpoint.photos.front, status: "captured", image: "/progress-photo-front.svg" },
                side: { ...checkpoint.photos.side, status: "captured", image: "/progress-photo-side.svg" },
                back: { ...checkpoint.photos.back, status: "missing", image: null }
              }
            }
          : checkpoint
      )
    }
  };
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => createOnboardingDemoState());

  useEffect(() => {
    setState(reviveState(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<OnboardingStoreValue>(() => {
    const entryDestination = getEntryDestination(state.progress);
    const resumeRoute = getResumeOnboardingRoute(state.progress);

    const startStep: OnboardingStoreValue["startStep"] = (step) => {
      setState((current) => ({
        ...current,
        progress: {
          ...current.progress,
          currentStep: step,
          resumeStep: step,
          status: current.progress.status === "complete" ? "complete" : "in-progress"
        }
      }));
    };

    const completeStep: OnboardingStoreValue["completeStep"] = (step) => {
      setState((current) => markStepComplete(current, step));
    };

    const setProfile: OnboardingStoreValue["setProfile"] = (patch) => {
      setState((current) => ({
        ...current,
        profile: {
          ...current.profile,
          ...patch
        }
      }));
    };

    const setGoals: OnboardingStoreValue["setGoals"] = (patch) => {
      setState((current) => ({
        ...current,
        goals: {
          ...current.goals,
          ...patch,
          priorities: patch.priorities ? [...patch.priorities] : current.goals.priorities
        }
      }));
    };

    const setMainGoal: OnboardingStoreValue["setMainGoal"] = (goal) => {
      setState((current) => ({
        ...current,
        goals: {
          ...current.goals,
          mainGoal: goal
        }
      }));
    };

    const reorderPriorities: OnboardingStoreValue["reorderPriorities"] = (fromIndex, toIndex) => {
      setState((current) => ({
        ...current,
        goals: {
          ...current.goals,
          priorities: reorderPriorityItems(current.goals.priorities, fromIndex, toIndex)
        }
      }));
    };

    const setTrainingExperience: OnboardingStoreValue["setTrainingExperience"] = (patch) => {
      setState((current) => ({
        ...current,
        trainingExperience: {
          ...current.trainingExperience,
          ...patch
        }
      }));
    };

    const setTrainingPreferences: OnboardingStoreValue["setTrainingPreferences"] = (patch) => {
      setState((current) => ({
        ...current,
        trainingPreferences: {
          ...current.trainingPreferences,
          ...patch
        }
      }));
    };

    const setScheduleLifestyle: OnboardingStoreValue["setScheduleLifestyle"] = (patch) => {
      setState((current) => ({
        ...current,
        scheduleLifestyle: {
          ...current.scheduleLifestyle,
          ...patch
        }
      }));
    };

    const setHealthLimitations: OnboardingStoreValue["setHealthLimitations"] = (patch) => {
      setState((current) => ({
        ...current,
        healthLimitations: {
          ...current.healthLimitations,
          ...patch,
          coachReviewRequired: shouldRequireCoachReview({
            ...current.healthLimitations,
            ...patch,
            coachReviewRequired: current.healthLimitations.coachReviewRequired || Boolean(patch.coachReviewRequired)
          })
        }
      }));
    };

    const setNutritionPreferences: OnboardingStoreValue["setNutritionPreferences"] = (patch) => {
      setState((current) => ({
        ...current,
        nutritionPreferences: {
          ...current.nutritionPreferences,
          ...patch
        }
      }));
    };

    const setBaselineMeasurement: OnboardingStoreValue["setBaselineMeasurement"] = (type, value) => {
      setState((current) => ({
        ...current,
        baseline: {
          ...current.baseline,
          measurements: current.baseline.measurements.map((measurement) =>
            measurement.type === type ? { ...measurement, value } : measurement
          )
        }
      }));
    };

    const setBaselinePhoto: OnboardingStoreValue["setBaselinePhoto"] = (pose, status) => {
      setState((current) => ({
        ...current,
        baseline: {
          ...current.baseline,
          photos: {
            ...current.baseline.photos,
            poses: current.baseline.photos.poses.map((item) => (item.pose === pose ? { ...item, status } : item))
          }
        }
      }));
    };

    const setResumeStep: OnboardingStoreValue["setResumeStep"] = (step) => {
      setState((current) => ({
        ...current,
        progress: {
          ...current.progress,
          resumeStep: step
        }
      }));
    };

    const setCurrentStep: OnboardingStoreValue["setCurrentStep"] = (step) => {
      setState((current) => ({
        ...current,
        progress: {
          ...current.progress,
          currentStep: step,
          status: current.progress.status === "complete" ? "complete" : "in-progress"
        }
      }));
    };

    const setGoalDecision: OnboardingStoreValue["setGoalDecision"] = (value) => {
      setState((current) => ({
        ...current,
        program: {
          ...current.program,
          recommendation: {
            ...current.program.recommendation,
            summary: value === "KEEP" ? current.program.recommendation.summary : `${current.program.recommendation.summary} — adjust focus`
          }
        }
      }));
    };

    const setPriorityDecision: OnboardingStoreValue["setPriorityDecision"] = (value) => {
      setState((current) => ({
        ...current,
        program: {
          ...current.program,
          recommendation: {
            ...current.program.recommendation,
            changes:
              value === "KEEP"
                ? current.program.recommendation.changes
                : [...current.program.recommendation.changes, "Revisit priority emphasis before activation"]
          }
        }
      }));
    };

    const setAthleteFeedback: OnboardingStoreValue["setAthleteFeedback"] = (value) => {
      setState((current) => ({
        ...current,
        program: {
          ...current.program,
          recentAdjustments: [`Athlete feedback: ${value}`]
        }
      }));
    };

    const setProgram: OnboardingStoreValue["setProgram"] = (patch) => {
      setState((current) => ({
        ...current,
        program: {
          ...current.program,
          ...patch
        }
      }));
    };

    const createProgramProposalAction: OnboardingStoreValue["createProgramProposal"] = () => {
      setState((current) => ({
        ...current,
        program: createProgramProposal(current)
      }));
    };

    const activateProgramAction: OnboardingStoreValue["activateProgram"] = () => {
      const seed = updateMeasurementBaseline(baselineSeed);
      window.localStorage.setItem("coachx-demo-progress-state-v2", JSON.stringify(seed));
      window.dispatchEvent(new Event("coachx-progress-state-updated"));
      setState((current) => ({
        ...current,
        program: activateProgram(createProgramProposal(current)),
        progress: {
          ...current.progress,
          currentStep: "program",
          completedSteps: Array.from(new Set([...current.progress.completedSteps, "program"])),
          resumeStep: "program",
          status: "complete"
        }
      }));
    };

    const finalizeOnboardingAction: OnboardingStoreValue["finalizeOnboarding"] = () => {
      const seed = updateMeasurementBaseline(baselineSeed);
      window.localStorage.setItem("coachx-demo-progress-state-v2", JSON.stringify(seed));
      window.dispatchEvent(new Event("coachx-progress-state-updated"));
      setState((current) => finalizeOnboarding(current));
    };

    const resetOnboardingAction: OnboardingStoreValue["resetOnboarding"] = () => {
      const demo = createOnboardingDemoState();
      setState(demo);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      window.localStorage.setItem("coachx-demo-progress-state-v2", JSON.stringify(updateMeasurementBaseline(baselineSeed)));
      window.dispatchEvent(new Event("coachx-progress-state-updated"));
      window.dispatchEvent(new Event("coachx-progress-state-updated"));
    };

    return {
      state,
      program: state.program,
      entryDestination,
      resumeRoute,
      startStep,
      completeStep,
      setProfile,
      setGoals,
      setMainGoal,
      reorderPriorities,
      setTrainingExperience,
      setTrainingPreferences,
      setScheduleLifestyle,
      setHealthLimitations,
      setNutritionPreferences,
      setBaselineMeasurement,
      setBaselinePhoto,
      setResumeStep,
      setCurrentStep,
      setGoalDecision,
      setPriorityDecision,
      setAthleteFeedback,
      setProgram,
      createProgramProposal: createProgramProposalAction,
      activateProgram: activateProgramAction,
      finalizeOnboarding: finalizeOnboardingAction,
      resetOnboarding: resetOnboardingAction,
      requiresCoachReview: shouldRequireCoachReview(state.healthLimitations),
      canUseNutritionChoice: (choice) => isNutritionChoiceAllowed(choice, state.nutritionPreferences)
    };
  }, [state]);

  return <OnboardingStoreContext.Provider value={value}>{children}</OnboardingStoreContext.Provider>;
}

export function useOnboardingStore() {
  const context = useContext(OnboardingStoreContext);

  if (!context) {
    throw new Error("useOnboardingStore must be used within OnboardingProvider");
  }

  return context;
}

export function getOnboardingLink(step: OnboardingStepId) {
  switch (step) {
    case "entry": return "/entry";
    case "intro": return "/onboarding";
    case "profile": return "/onboarding/profile";
    case "goals": return "/onboarding/goals";
    case "training-experience": return "/onboarding/training-experience";
    case "training-preferences": return "/onboarding/training-preferences";
    case "schedule": return "/onboarding/schedule";
    case "health": return "/onboarding/health";
    case "nutrition": return "/onboarding/nutrition";
    case "baseline": return "/onboarding/baseline";
    case "review": return "/onboarding/review";
    case "building-plan": return "/onboarding/building-plan";
    case "plan-ready": return "/onboarding/plan-ready";
    case "program": return "/program";
  }
}
