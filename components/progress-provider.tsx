"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  buildMeasurementHistory,
  computeMeasurementDifference,
  createProgressDemoState,
  formatMeasurementDifference,
  formatMeasurementValue,
  getMeasurementDefinition,
  getMeasurementRows,
  getPhotoCheckpoint,
  parseMeasurementInput,
  type AthleteFeedback,
  type ComparisonMode,
  type MeasurementState,
  type MeasurementType,
  type PhotoPose,
  type ProgressState
} from "@/lib/progress-data";

interface ProgressStoreValue {
  state: ProgressState;
  measurementRows: ReturnType<typeof getMeasurementRows>;
  updateMeasurementDraft: (type: MeasurementType, value: string) => void;
  saveMeasurements: () => { ok: boolean; errors: string[] };
  dismissMeasurementErrors: () => void;
  setComparisonPose: (pose: PhotoPose) => void;
  setComparisonMode: (mode: ComparisonMode) => void;
  capturePhoto: (pose: PhotoPose) => void;
  retakePhoto: (pose: PhotoPose) => void;
  markPhotoMissing: (pose: PhotoPose) => void;
  setSelectedPhotoCheckpoint: (checkpoint: ProgressState["photos"]["selectedCheckpoint"]) => void;
  setGuidanceVisible: (visible: boolean) => void;
  setAthleteFeedback: (value: AthleteFeedback) => void;
  setGoalDecision: (value: "KEEP" | "ADJUST") => void;
  setPriorityDecision: (value: "KEEP" | "ADJUST") => void;
  savePhaseReview: () => void;
  resetProgressDemo: () => void;
}

const ProgressStoreContext = createContext<ProgressStoreValue | null>(null);
const STORAGE_KEY = "coachx-demo-progress-state-v2";

function reviveState(rawValue: string | null) {
  if (!rawValue) {
    return createProgressDemoState();
  }

  try {
    const parsed = JSON.parse(rawValue) as ProgressState;
    return {
      ...parsed,
      photos: {
        ...parsed.photos,
        checkpoints: parsed.photos.checkpoints.map((checkpoint) => ({
          ...checkpoint,
          photos: {
            ...checkpoint.photos,
            front: {
              ...checkpoint.photos.front,
              image: checkpoint.photos.front.image && checkpoint.photos.front.image.includes("progress-photo-") ? "/progress-photo-front.svg" : checkpoint.photos.front.image
            },
            side: {
              ...checkpoint.photos.side,
              image: checkpoint.photos.side.image && checkpoint.photos.side.image.includes("progress-photo-") ? "/progress-photo-side.svg" : checkpoint.photos.side.image
            },
            back: {
              ...checkpoint.photos.back,
              image: checkpoint.photos.back.image && checkpoint.photos.back.image.includes("progress-photo-") ? "/progress-photo-back.svg" : checkpoint.photos.back.image
            }
          }
        }))
      }
    };
  } catch {
    return createProgressDemoState();
  }
}

function updateMeasurementDraft(measurement: MeasurementState, type: MeasurementType, value: string) {
  return {
    ...measurement,
    definitions: measurement.definitions.map((definition) => (definition.type === type ? { ...definition, todayValue: value } : definition)),
    validationErrors: {
      ...measurement.validationErrors,
      [type]: undefined
    }
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => createProgressDemoState());

  useEffect(() => {
    setState(reviveState(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<ProgressStoreValue>(() => {
    const measurementRows = getMeasurementRows(state.measurement);

    const updateMeasurementDraftAction: ProgressStoreValue["updateMeasurementDraft"] = (type, value) => {
      setState((current) => ({
        ...current,
        measurement: updateMeasurementDraft(current.measurement, type, value)
      }));
    };

    const saveMeasurements: ProgressStoreValue["saveMeasurements"] = () => {
      const errors: string[] = [];
      const nextValidationErrors: MeasurementState["validationErrors"] = {};
      const updates: Partial<Record<MeasurementType, number>> = {};

      state.measurement.definitions.forEach((definition) => {
        const parsed = parseMeasurementInput(definition.todayValue, definition.min, definition.max);
        if (!parsed.valid) {
          if (definition.todayValue.trim()) {
            nextValidationErrors[definition.type] = parsed.reason;
            errors.push(`${definition.label}: ${parsed.reason}`);
          }
          return;
        }

        updates[definition.type] = parsed.value;
      });

      if (errors.length > 0) {
        setState((current) => ({
          ...current,
          measurement: {
            ...current.measurement,
            validationErrors: nextValidationErrors
          }
        }));
        return { ok: false, errors };
      }

      const rows = state.measurement.definitions
        .map((definition) => {
          const parsed = definition.todayValue.trim() ? Number(definition.todayValue) : null;
          const previousValue = getMeasurementDefinition(state.measurement, definition.type).lastValue;
          const existingRow = state.measurement.lastSavedRows.find((row) => row.type === definition.type) ?? null;
          return {
            type: definition.type,
            label: definition.label,
            unit: definition.unit,
            previousValue,
            currentValue: parsed ?? existingRow?.currentValue ?? null,
            previousDate: definition.lastDate,
            currentDate: parsed === null ? existingRow?.currentDate ?? null : state.measurement.currentDateLabel,
            difference: computeMeasurementDifference(previousValue, parsed ?? existingRow?.currentValue ?? null)
          };
        })
        .filter((row) => row.currentValue !== null || row.previousValue !== null);

      setState((current) => ({
        ...current,
        measurement: {
          ...current.measurement,
          histories: buildMeasurementHistory(current.measurement, updates),
          lastSavedRows: rows,
          savedAt: new Date().toISOString(),
          validationErrors: {}
        }
      }));

      return { ok: true, errors: [] };
    };

    const dismissMeasurementErrors: ProgressStoreValue["dismissMeasurementErrors"] = () => {
      setState((current) => ({
        ...current,
        measurement: {
          ...current.measurement,
          validationErrors: {}
        }
      }));
    };

    const setComparisonPose: ProgressStoreValue["setComparisonPose"] = (pose) => {
      setState((current) => ({
        ...current,
        photos: {
          ...current.photos,
          comparisonPose: pose
        }
      }));
    };

    const setComparisonMode: ProgressStoreValue["setComparisonMode"] = (mode) => {
      setState((current) => ({
        ...current,
        photos: {
          ...current.photos,
          comparisonMode: mode
        }
      }));
    };

    const updateCheckpointPhoto = (pose: PhotoPose, status: "captured" | "missing" | "retake") => {
      setState((current) => ({
        ...current,
        photos: {
          ...current.photos,
          checkpoints: current.photos.checkpoints.map((checkpoint) => {
            if (checkpoint.checkpoint !== current.photos.selectedCheckpoint) {
              return checkpoint;
            }

            const photo = checkpoint.photos[pose];
            return {
              ...checkpoint,
              photos: {
                ...checkpoint.photos,
                [pose]: {
                  ...photo,
                  status,
                  image:
                  status === "missing" ? null : `/progress-photo-${pose}.svg`,
                  updatedAt: new Date().toISOString()
                }
              }
            };
          })
        }
      }));
    };

    const capturePhoto: ProgressStoreValue["capturePhoto"] = (pose) => updateCheckpointPhoto(pose, "captured");
    const retakePhoto: ProgressStoreValue["retakePhoto"] = (pose) => updateCheckpointPhoto(pose, "retake");
    const markPhotoMissing: ProgressStoreValue["markPhotoMissing"] = (pose) => updateCheckpointPhoto(pose, "missing");

    const setSelectedPhotoCheckpoint: ProgressStoreValue["setSelectedPhotoCheckpoint"] = (checkpoint) => {
      setState((current) => ({
        ...current,
        photos: {
          ...current.photos,
          selectedCheckpoint: checkpoint
        }
      }));
    };

    const setGuidanceVisible: ProgressStoreValue["setGuidanceVisible"] = (visible) => {
      setState((current) => ({
        ...current,
        photos: {
          ...current.photos,
          guidanceVisible: visible
        }
      }));
    };

    const setAthleteFeedback: ProgressStoreValue["setAthleteFeedback"] = (value) => {
      setState((current) => ({
        ...current,
        phaseReview: {
          ...current.phaseReview,
          athleteFeedback: current.phaseReview.athleteFeedback.map((feedback, index) =>
            index === 0 ? { ...feedback, value } : feedback
          )
        }
      }));
    };

    const setGoalDecision: ProgressStoreValue["setGoalDecision"] = (value) => {
      setState((current) => ({
        ...current,
        phaseReview: {
          ...current.phaseReview,
          mainGoalDecision: {
            ...current.phaseReview.mainGoalDecision,
            current: value
          }
        }
      }));
    };

    const setPriorityDecision: ProgressStoreValue["setPriorityDecision"] = (value) => {
      setState((current) => ({
        ...current,
        phaseReview: {
          ...current.phaseReview,
          priorityDecision: {
            ...current.phaseReview.priorityDecision,
            current: value
          }
        }
      }));
    };

    const savePhaseReview: ProgressStoreValue["savePhaseReview"] = () => {
      setState((current) => ({
        ...current,
        phaseReview: {
          ...current.phaseReview,
          status: "COACH REVIEW REQUIRED"
        }
      }));
    };

    const resetProgressDemo: ProgressStoreValue["resetProgressDemo"] = () => {
      const demo = createProgressDemoState();
      setState(demo);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    };

    return {
      state,
      measurementRows,
      updateMeasurementDraft: updateMeasurementDraftAction,
      saveMeasurements,
      dismissMeasurementErrors,
      setComparisonPose,
      setComparisonMode,
      capturePhoto,
      retakePhoto,
      markPhotoMissing,
      setSelectedPhotoCheckpoint,
      setGuidanceVisible,
      setAthleteFeedback,
      setGoalDecision,
      setPriorityDecision,
      savePhaseReview,
      resetProgressDemo
    };
  }, [state]);

  return <ProgressStoreContext.Provider value={value}>{children}</ProgressStoreContext.Provider>;
}

export function useProgressStore() {
  const context = useContext(ProgressStoreContext);

  if (!context) {
    throw new Error("useProgressStore must be used within ProgressProvider");
  }

  return context;
}

export function formatProgressMeasurement(value: number | null, unit: string) {
  return formatMeasurementValue(value, unit);
}

export function formatProgressDifference(value: number | null, unit: string) {
  return formatMeasurementDifference(value, unit);
}

export function getProgressPhotoCheckpointLabel(checkpoint: ProgressState["photos"]["selectedCheckpoint"]) {
  return getPhotoCheckpoint(createProgressDemoState().photos, checkpoint).label;
}
