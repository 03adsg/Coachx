"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuthStore } from "@/components/auth-provider";
import { useLocale } from "@/components/locale-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { publishFeedbackError, publishFeedbackSuccess } from "@/components/feedback-provider";
import {
  completeWorkoutSession,
  saveWorkoutSet,
  swapWorkoutSessionExercise,
} from "@/lib/workout-session-service";
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
  completeSet: (exerciseId: string, setNumber: number, payload: { kilograms: string; reps: string; rir?: string }) => Promise<void>;
  swapExercise: (exerciseId: string, alternativeId: string) => Promise<void>;
  startRestTimer: (exerciseId: string, setNumber: number, seconds: number) => void;
  addThirtySeconds: () => void;
  skipRestTimer: () => void;
  selectAdjustmentTime: (minutes: "20 min" | "30 min" | "45 min") => void;
  applyAdjustment: () => void;
  updateSafety: (patch: Partial<WorkoutSessionState["safety"]>) => void;
  finishWorkout: () => Promise<void>;
  resetDemoWorkout: () => void;
}

const WorkoutStoreContext = createContext<WorkoutStoreValue | null>(null);

function getStorageKey(userId: string | null) {
  return `coachx-workout-session:${userId ?? "demo"}`;
}

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

function getSessionExercise(session: WorkoutSessionState, exerciseId: string) {
  return session.exercises.find((exercise) => exercise.id === exerciseId) ?? session.exercises[0];
}

function updateSessionExerciseDraft(
  session: WorkoutSessionState,
  exerciseId: string,
  setNumber: number,
  patch: Partial<SessionExercise["sets"][number]>
) {
  return {
    ...session,
    exercises: session.exercises.map((exercise) =>
      exercise.id !== exerciseId
        ? exercise
        : {
            ...exercise,
            sets: exercise.sets.map((set) => (set.setNumber === setNumber ? { ...set, ...patch } : set))
          }
    )
  };
}

function markCompletedSetOnSession(session: WorkoutSessionState, exerciseId: string, setNumber: number, payload: { kilograms: string; reps: string; rir?: string }): WorkoutSessionState {
  const completedAt = new Date().toISOString();

  return {
    ...session,
    exercises: session.exercises.map((exercise) => {
      if (exercise.id !== exerciseId) {
        return exercise;
      }

      const alreadyCompleted = exercise.completedSets.some((set) => set.setNumber === setNumber);
      const nextCompletedSets = alreadyCompleted
        ? exercise.completedSets
        : [
            ...exercise.completedSets,
            {
              setNumber,
              kilograms: Number(payload.kilograms || 0),
              reps: Number(payload.reps || 0),
              rir: payload.rir ? Number(payload.rir) : undefined,
              performedAt: completedAt
            } satisfies CompletedSet
          ];

      const completedCount = nextCompletedSets.length;
      const exerciseCompleted = completedCount >= exercise.totalSets;

      return {
        ...exercise,
        sets: exercise.sets.map((set) =>
          set.setNumber === setNumber
            ? {
                ...set,
                kilograms: payload.kilograms,
                reps: payload.reps,
                rir: payload.rir,
                completed: true,
                status: "completed" as const,
                completedAt
              }
            : set
        ),
        completedSets: nextCompletedSets,
        status: exerciseCompleted ? "completed" : exercise.status,
        startedAt: exercise.startedAt ?? completedAt,
        completedAt: exerciseCompleted ? completedAt : exercise.completedAt
      };
    }),
    restTimer: computeRestTimer(exerciseId, setNumber, getExerciseDefinition(getSessionExercise(session, exerciseId).performedExerciseId).restSeconds)
  } satisfies WorkoutSessionState;
}

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const auth = useAuthStore();
  const { locale } = useLocale();
  const sessionRef = useRef<WorkoutSessionState>(createDemoWorkoutSession());
  const [session, setSession] = useState<WorkoutSessionState>(createDemoWorkoutSession);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    if (!auth.ready) {
      return;
    }

    const key = getStorageKey(auth.isConfigured && auth.user ? auth.user.id : null);
    const cached = typeof window === "undefined" ? null : window.localStorage.getItem(key);
    const revived = reviveSession(cached);
    setSession(revived);
    sessionRef.current = revived;
  }, [auth.isConfigured, auth.ready, auth.user?.id, locale]);

  useEffect(() => {
    if (!auth.ready || typeof window === "undefined") {
      return;
    }

    const key = getStorageKey(auth.isConfigured && auth.user ? auth.user.id : null);
    window.localStorage.setItem(key, JSON.stringify(session));
  }, [auth.isConfigured, auth.ready, auth.user?.id, session, locale]);

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
  }, [session.restTimer?.active, locale]);

  const value = useMemo<WorkoutStoreValue>(() => {
    const hydrateSession: WorkoutStoreValue["hydrateSession"] = (nextSession) => {
      setSession(nextSession);
      sessionRef.current = nextSession;
    };

    const updateSetDraft: WorkoutStoreValue["updateSetDraft"] = (exerciseId, setNumber, patch) => {
      setSession((current) => updateSessionExerciseDraft(current, exerciseId, setNumber, patch));
    };

    const completeSet: WorkoutStoreValue["completeSet"] = async (exerciseId, setNumber, payload) => {
      const currentSession = sessionRef.current;
      const currentExercise = getSessionExercise(currentSession, exerciseId);
      const currentSet = currentExercise.sets.find((set) => set.setNumber === setNumber) ?? currentExercise.sets[currentExercise.sets.length - 1];
      const savedWorkoutSessionExerciseId = currentExercise.sessionExerciseId ?? currentExercise.id;

      setSession((current) => ({
        ...markCompletedSetOnSession(current, exerciseId, setNumber, payload),
        saveState: "pending",
        saveError: null
      }));

      const client = getSupabaseBrowserClient();
      if (!auth.isConfigured || !auth.user || !client || !currentSession.workoutSessionId) {
        return;
      }

      try {
        const saved = await saveWorkoutSet(client, {
          workoutSessionExerciseId: savedWorkoutSessionExerciseId,
          workoutSetId: currentSet?.workoutSetId ?? null,
          setNumber,
          payload
        });

        publishFeedbackSuccess("workout.set", "Set completed", "Your reps and load are saved.");
        setSession((current) => ({
          ...current,
          saveState: "saved",
          saveError: null,
          exercises: current.exercises.map((exercise) => {
            if (exercise.id !== exerciseId) {
              return exercise;
            }

            const nextSets = exercise.sets.map((set) =>
              set.setNumber === setNumber
                ? {
                    ...set,
                    workoutSetId: saved.id,
                    kilograms: saved.weight_kg == null ? "" : String(saved.weight_kg),
                    reps: saved.reps == null ? "" : String(saved.reps),
                    rir: saved.rir == null ? undefined : String(saved.rir),
                    completed: saved.status === "completed",
                    status: saved.status,
                    completedAt: saved.completed_at,
                    notes: saved.notes
                  }
                : set
            );
            const completedSets = exercise.completedSets.some((set) => set.setNumber === setNumber)
              ? exercise.completedSets
              : [
                  ...exercise.completedSets,
                  {
                    setNumber,
                    kilograms: saved.weight_kg ?? 0,
                    reps: saved.reps ?? 0,
                    rir: saved.rir ?? undefined,
                    performedAt: saved.completed_at ?? new Date().toISOString()
                  }
                ];
            const completedCount = completedSets.length;
            const exerciseCompleted = completedCount >= exercise.totalSets;

            return {
              ...exercise,
              sets: nextSets,
              completedSets,
              status: exerciseCompleted ? "completed" : exercise.status,
              completedAt: exerciseCompleted ? saved.completed_at ?? exercise.completedAt : exercise.completedAt
            };
          })
        }));
      } catch (error) {
        publishFeedbackError("workout.set", "Set could not be saved", "Your previous set data is still here.");
        setSession((current) => ({
          ...current,
          saveState: "error",
          saveError: error instanceof Error ? error.message : "Unable to save workout set."
        }));
        throw error;
      }
    };

    const swapExercise: WorkoutStoreValue["swapExercise"] = async (exerciseId, alternativeId) => {
      setSession((current) => ({
        ...current,
        saveState: "pending",
        saveError: null,
        exercises: current.exercises.map((exercise) =>
          exercise.id !== exerciseId
            ? exercise
            : {
                ...exercise,
                performedExerciseId: alternativeId
              }
        )
      }));

      const client = getSupabaseBrowserClient();
      if (!auth.isConfigured || !auth.user || !client || !sessionRef.current.workoutSessionId) {
        return;
      }

      try {
        await swapWorkoutSessionExercise(client, {
          workoutSessionExerciseId: getSessionExercise(sessionRef.current, exerciseId).sessionExerciseId ?? exerciseId,
          performedExerciseKey: alternativeId,
          swapReason: "manual swap"
        });

        publishFeedbackSuccess("workout.swap", "Exercise swapped", "The current set history is preserved.");
        setSession((current) => ({
          ...current,
          saveState: "saved",
          saveError: null
        }));
      } catch (error) {
        publishFeedbackError("workout.swap", "Exercise swap could not be saved", "Your workout history is unchanged.");
        setSession((current) => ({
          ...current,
          saveState: "error",
          saveError: error instanceof Error ? error.message : "Unable to swap workout exercise."
        }));
        throw error;
      }
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

    const finishWorkout: WorkoutStoreValue["finishWorkout"] = async () => {
      setSession((current) => ({
        ...current,
        restTimer: null,
        saveState: "pending",
        saveError: null
      }));

      const client = getSupabaseBrowserClient();
      if (!auth.isConfigured || !auth.user || !client || !sessionRef.current.workoutSessionId) {
        return;
      }

      try {
        const finished = await completeWorkoutSession(client, {
          workoutSessionId: sessionRef.current.workoutSessionId,
          durationSeconds: sessionRef.current.durationSeconds ?? null,
          notes: sessionRef.current.notes ?? null
        });

        publishFeedbackSuccess("workout.finish", "Workout complete", "Your session is saved and ready to review.");
        setSession((current) => ({
          ...current,
          status: finished.status,
          completedAt: finished.completed_at,
          durationSeconds: finished.duration_seconds,
          notes: finished.notes,
          persistence: {
            workoutSessionId: finished.id,
            scheduledWorkoutId: finished.scheduled_workout_id,
            workoutTemplateId: finished.workout_template_id,
            status: finished.status,
            startedAt: finished.started_at,
            completedAt: finished.completed_at,
            durationSeconds: finished.duration_seconds,
            notes: finished.notes,
            sessionMetadata: (finished.session_metadata as Record<string, unknown> | null) ?? null
          },
          saveState: "saved",
          saveError: null,
          source: "remote"
        }));
      } catch (error) {
        publishFeedbackError("workout.finish", "Workout could not be completed", "Your current session is still open.");
        setSession((current) => ({
          ...current,
          saveState: "error",
          saveError: error instanceof Error ? error.message : "Unable to complete workout."
        }));
        throw error;
      }
    };

    const resetDemoWorkout: WorkoutStoreValue["resetDemoWorkout"] = () => {
      const demo = createDemoWorkoutSession();
      setSession(demo);
      sessionRef.current = demo;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(getStorageKey(null), JSON.stringify(demo));
      }
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
  }, [auth.isConfigured, auth.user, session, locale]);

  return <WorkoutStoreContext.Provider value={value}>{children}</WorkoutStoreContext.Provider>;
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
