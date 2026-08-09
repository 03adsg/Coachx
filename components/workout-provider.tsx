"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  coachxExerciseAlternativeMap,
  createDemoWorkoutSession,
  getExerciseDefinition,
  type CompletedSet,
  type RestTimerState,
  type SessionExercise,
  type WorkoutSessionState
} from "@/lib/workout-data";

interface WorkoutStoreValue {
  session: WorkoutSessionState;
  hydrateSession: (nextSession: WorkoutSessionState) => void;
  updateSetDraft: (exerciseId: string, setNumber: number, patch: Partial<SessionExercise["sets"][number]>) => void;
  completeSet: (exerciseId: string, setNumber: number, payload: { kilograms: string; reps: string; rir?: string }) => void;
  swapExercise: (exerciseId: string, alternativeId: string) => void;
  startRestTimer: (exerciseId: string, setNumber: number, seconds: number) => void;
  addThirtySeconds: () => void;
  skipRestTimer: () => void;
  selectAdjustmentTime: (minutes: "20 min" | "30 min" | "45 min") => void;
  applyAdjustment: () => void;
  updateSafety: (patch: Partial<WorkoutSessionState["safety"]>) => void;
  finishWorkout: () => void;
  resetDemoWorkout: () => void;
}

const WorkoutStoreContext = createContext<WorkoutStoreValue | null>(null);
const STORAGE_KEY = "coachx-demo-workout-session";

function reviveSession(raw: string | null) {
  if (!raw) {
    return createDemoWorkoutSession();
  }

  try {
    return JSON.parse(raw) as WorkoutSessionState;
  } catch {
    return createDemoWorkoutSession();
  }
}

function computeRestTimer(exerciseId: string, setNumber: number, seconds: number): RestTimerState {
  return {
    exerciseId,
    setNumber,
    secondsRemaining: seconds,
    active: true
  };
}

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<WorkoutSessionState>(createDemoWorkoutSession);

  useEffect(() => {
    setSession(reviveSession(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    if (!session.restTimer?.active) {
      return;
    }

    const interval = window.setInterval(() => {
      setSession((current) => {
        if (!current.restTimer?.active) {
          return current;
        }

        const nextRemaining = Math.max(0, current.restTimer.secondsRemaining - 1);
        return {
          ...current,
          restTimer: {
            ...current.restTimer,
            secondsRemaining: nextRemaining,
            active: nextRemaining > 0
          }
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [session.restTimer?.active]);

  const value = useMemo<WorkoutStoreValue>(() => {
    const updateSetDraft: WorkoutStoreValue["updateSetDraft"] = (exerciseId, setNumber, patch) => {
      setSession((current) => ({
        ...current,
        exercises: current.exercises.map((exercise) =>
          exercise.id !== exerciseId
            ? exercise
            : {
                ...exercise,
                sets: exercise.sets.map((set) => (set.setNumber === setNumber ? { ...set, ...patch } : set))
              }
        )
      }));
    };

    const completeSet: WorkoutStoreValue["completeSet"] = (exerciseId, setNumber, payload) => {
      setSession((current) => {
        const exercises = current.exercises.map((exercise) => {
          if (exercise.id !== exerciseId) {
            return exercise;
          }

          const alreadyCompleted = exercise.completedSets.some((set) => set.setNumber === setNumber);
          if (alreadyCompleted) {
            return exercise;
          }

          const completedSet: CompletedSet = {
            setNumber,
            kilograms: Number(payload.kilograms || 0),
            reps: Number(payload.reps || 0),
            rir: payload.rir ? Number(payload.rir) : undefined,
            performedAt: new Date().toISOString()
          };

          return {
            ...exercise,
            sets: exercise.sets.map((set) =>
              set.setNumber === setNumber
                ? {
                    ...set,
                    kilograms: payload.kilograms,
                    reps: payload.reps,
                    rir: payload.rir,
                    completed: true
                  }
                : set
            ),
            completedSets: [...exercise.completedSets, completedSet]
          };
        });

        return {
          ...current,
          exercises,
          restTimer: computeRestTimer(exerciseId, setNumber, getExerciseDefinition(getSessionExercise(current, exerciseId).performedExerciseId).restSeconds)
        };
      });
    };

    const swapExercise: WorkoutStoreValue["swapExercise"] = (exerciseId, alternativeId) => {
      setSession((current) => ({
        ...current,
        exercises: current.exercises.map((exercise) =>
          exercise.id !== exerciseId
            ? exercise
            : {
                ...exercise,
                performedExerciseId: alternativeId
              }
        )
      }));
    };

    const startRestTimer: WorkoutStoreValue["startRestTimer"] = (exerciseId, setNumber, seconds) => {
      setSession((current) => ({
        ...current,
        restTimer: computeRestTimer(exerciseId, setNumber, seconds)
      }));
    };

    const addThirtySeconds: WorkoutStoreValue["addThirtySeconds"] = () => {
      setSession((current) =>
        current.restTimer
          ? {
              ...current,
              restTimer: {
                ...current.restTimer,
                secondsRemaining: current.restTimer.secondsRemaining + 30,
                active: true
              }
            }
          : current
      );
    };

    const skipRestTimer: WorkoutStoreValue["skipRestTimer"] = () => {
      setSession((current) =>
        current.restTimer
          ? {
              ...current,
              restTimer: null
            }
          : current
      );
    };

    const selectAdjustmentTime: WorkoutStoreValue["selectAdjustmentTime"] = (minutes) => {
      setSession((current) => ({
        ...current,
        adjustment: {
          ...current.adjustment,
          selectedTime: minutes
        }
      }));
    };

    const hydrateSession: WorkoutStoreValue["hydrateSession"] = (nextSession) => {
      setSession(nextSession);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    };

    const applyAdjustment: WorkoutStoreValue["applyAdjustment"] = () => {
      setSession((current) => ({
        ...current,
        adjustment: {
          ...current.adjustment,
          applied: true
        }
      }));
    };

    const updateSafety: WorkoutStoreValue["updateSafety"] = (patch) => {
      setSession((current) => ({
        ...current,
        safety: {
          ...current.safety,
          ...patch
        }
      }));
    };

    const finishWorkout: WorkoutStoreValue["finishWorkout"] = () => {
      setSession((current) => ({
        ...current,
        restTimer: null
      }));
    };

    const resetDemoWorkout: WorkoutStoreValue["resetDemoWorkout"] = () => {
      const demo = createDemoWorkoutSession();
      setSession(demo);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    };

    return {
      session,
      hydrateSession,
      updateSetDraft,
      completeSet,
      swapExercise,
      startRestTimer,
      addThirtySeconds,
      skipRestTimer,
      selectAdjustmentTime,
      applyAdjustment,
      updateSafety,
      finishWorkout,
      resetDemoWorkout
    };
  }, [session]);

  return <WorkoutStoreContext.Provider value={value}>{children}</WorkoutStoreContext.Provider>;
}

function getSessionExercise(session: WorkoutSessionState, exerciseId: string) {
  return session.exercises.find((exercise) => exercise.id === exerciseId) ?? session.exercises[0];
}

export function useWorkoutStore() {
  const context = useContext(WorkoutStoreContext);

  if (!context) {
    throw new Error("useWorkoutStore must be used within WorkoutProvider");
  }

  return context;
}

export function getWorkoutExercise(session: WorkoutSessionState, exerciseId: string) {
  return getSessionExercise(session, exerciseId);
}

export function getWorkoutAlternativeCards(exerciseId: string) {
  return coachxExerciseAlternativeMap[exerciseId] ?? [];
}
