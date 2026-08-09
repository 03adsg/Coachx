"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuthStore } from "@/components/auth-provider";
import { useProgramStore } from "@/components/program-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  acknowledgeWeeklyCheckinReview,
  getCurrentQuestionKey,
  loadWeeklyCheckinSnapshot,
  saveCheckinResponse,
  submitWeeklyCheckin,
  type WeeklyCheckinSnapshot,
  type WeeklyCheckinSummary,
  type WeeklyCheckinResponseInput
} from "@/lib/checkin-service";
import {
  computeSignalFromScoredQuestions,
  createEmptyWeeklyCheckinResponses,
  deriveWeeklyCheckinReviewSummary,
  resolveWeeklyCheckinWindow,
  weeklyCheckinQuestions,
  type WeeklyCheckinQuestionDefinition
} from "@/lib/checkin-data";
import type { WeeklyCheckinResponsesRow, WeeklyCheckinsRow, WeeklyCheckinReviewsRow } from "@/lib/supabase/database.types";

interface CheckInStoreValue {
  loading: boolean;
  ready: boolean;
  error: string | null;
  dateKey: string;
  weekStartDate: string;
  weekEndDate: string;
  checkin: WeeklyCheckinsRow | null;
  responses: WeeklyCheckinResponsesRow[];
  review: WeeklyCheckinReviewsRow | null;
  summary: WeeklyCheckinSummary | null;
  currentQuestionKey: string;
  currentQuestionIndex: number;
  currentQuestion: WeeklyCheckinQuestionDefinition;
  source: WeeklyCheckinSnapshot["source"] | "demo";
  questions: WeeklyCheckinQuestionDefinition[];
  reloadCheckIn: () => Promise<void>;
  saveResponse: (input: WeeklyCheckinResponseInput) => Promise<void>;
  submitCheckIn: (overallNotes?: string | null) => Promise<void>;
  acknowledgeReview: () => Promise<void>;
}

const CheckInContext = createContext<CheckInStoreValue | null>(null);

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createFallbackSnapshot(dateKey: string): WeeklyCheckinSnapshot {
  const { weekStartDate, weekEndDate } = resolveWeeklyCheckinWindow(dateKey);
  const checkinId = createId();
  const userId = "00000000-0000-0000-0000-000000000000";
  const responses = createEmptyWeeklyCheckinResponses().map((response) => ({
    ...response,
    answeredAt: now
  }));
  const summarySignals = computeSignalFromScoredQuestions({
    training_adherence: 4,
    nutrition_adherence: 4,
    energy: 4,
    sleep: 4,
    stress: 4,
    recovery: 4,
    pain_discomfort: "none"
  });
  const review = deriveWeeklyCheckinReviewSummary(summarySignals);
  const now = new Date().toISOString();

  return {
    checkin: {
      id: checkinId,
      user_id: userId,
      program_id: null,
      program_phase_id: null,
      week_start_date: weekStartDate,
      week_end_date: weekEndDate,
      status: "in_progress",
      started_at: now,
      completed_at: null,
      submitted_at: null,
      overall_notes: null,
      created_at: now,
      updated_at: now
    },
    responses: responses.map((response) => ({
      id: createId(),
      user_id: userId,
      weekly_checkin_id: checkinId,
      question_key: response.questionKey,
      response_type: response.responseType,
      numeric_value: null,
      text_value: null,
      boolean_value: null,
      choice_value: null,
      json_value: null,
      answered_at: now,
      created_at: now,
      updated_at: now
    })),
    review: null,
    summary: {
      weekStartDate,
      weekEndDate,
      counts: {
        completedScheduledWorkouts: 0,
        plannedScheduledWorkouts: 0,
        completedNutritionDays: 0,
        plannedNutritionDays: 0,
        progressEntries: 0
      },
      adherencePercent: {
        training: 0,
        nutrition: 0
      },
      responseSnapshot: {},
      signals: summarySignals,
      reviewReason: review.reviewReason,
      review: {
        status: review.status,
        recommendationType: review.recommendationType,
        summary: review.reviewReason.summary,
        recommendationLabel: review.recommendationLabel
      }
    },
    source: "created"
  };
}

interface CheckInProviderProps {
  children: ReactNode;
  dateKey?: string;
}

export function CheckInProvider({ children, dateKey = new Date().toISOString().slice(0, 10) }: CheckInProviderProps) {
  const auth = useAuthStore();
  const program = useProgramStore();
  const authRef = useRef(auth);
  const programRef = useRef(program);
  const [snapshot, setSnapshot] = useState<WeeklyCheckinSnapshot>(() => createFallbackSnapshot(dateKey));
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  useEffect(() => {
    programRef.current = program;
  }, [program]);

  useEffect(() => {
    if (!auth.ready || !program.ready) {
      return;
    }

    let active = true;

    async function hydrate() {
      const client = getSupabaseBrowserClient();
      const currentAuth = authRef.current;
      const currentProgram = programRef.current;
      const programId = currentProgram.activeProgram?.id ?? null;
      const programPhaseId = currentProgram.activePhase?.id ?? null;

      if (!currentAuth.isConfigured || !currentAuth.user || !client) {
        if (!active) {
          return;
        }

        setSnapshot(createFallbackSnapshot(dateKey));
        setError(null);
        setLoading(false);
        setReady(true);
        return;
      }

      try {
        const remote = await loadWeeklyCheckinSnapshot(client, currentAuth.user.id, dateKey, programId, programPhaseId);
        if (!active) {
          return;
        }

        setSnapshot(remote);
        setError(null);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setSnapshot(createFallbackSnapshot(dateKey));
        setError(loadError instanceof Error ? loadError.message : "Unable to load weekly check-in.");
      } finally {
        if (!active) {
          return;
        }

        setLoading(false);
        setReady(true);
      }
    }

    void hydrate();

    return () => {
      active = false;
    };
  }, [auth.ready, auth.isConfigured, auth.user?.id, dateKey, program.ready, program.activeProgram?.id, program.activePhase?.id]);

  const value = useMemo<CheckInStoreValue>(() => {
    const currentQuestionKey = getCurrentQuestionKey(snapshot.responses);
    const currentQuestionIndex = weeklyCheckinQuestions.findIndex((question) => question.key === currentQuestionKey);
    const currentQuestion = weeklyCheckinQuestions[currentQuestionIndex >= 0 ? currentQuestionIndex : weeklyCheckinQuestions.length - 1];
    const { weekStartDate, weekEndDate } = resolveWeeklyCheckinWindow(dateKey);

    const reloadCheckIn: CheckInStoreValue["reloadCheckIn"] = async () => {
      const client = getSupabaseBrowserClient();
      const currentAuth = authRef.current;
      const currentProgram = programRef.current;
      const programId = currentProgram.activeProgram?.id ?? null;
      const programPhaseId = currentProgram.activePhase?.id ?? null;

      if (!currentAuth.isConfigured || !currentAuth.user || !client) {
        setSnapshot(createFallbackSnapshot(dateKey));
        return;
      }

      const remote = await loadWeeklyCheckinSnapshot(client, currentAuth.user.id, dateKey, programId, programPhaseId);
      setSnapshot(remote);
    };

    const saveResponse: CheckInStoreValue["saveResponse"] = async (input) => {
      const client = getSupabaseBrowserClient();
      const currentAuth = authRef.current;

      if (!currentAuth.isConfigured || !currentAuth.user || !client || !snapshot.checkin) {
        return;
      }

      await saveCheckinResponse(client, currentAuth.user.id, snapshot.checkin.id, input);
      await reloadCheckIn();
    };

    const submitCheckIn: CheckInStoreValue["submitCheckIn"] = async (overallNotes = null) => {
      const client = getSupabaseBrowserClient();
      const currentAuth = authRef.current;

      if (!currentAuth.isConfigured || !currentAuth.user || !client || !snapshot.checkin) {
        return;
      }

      await submitWeeklyCheckin(client, currentAuth.user.id, snapshot.checkin.id, overallNotes);
      await reloadCheckIn();
    };

    const acknowledgeReview: CheckInStoreValue["acknowledgeReview"] = async () => {
      const client = getSupabaseBrowserClient();
      const currentAuth = authRef.current;

      if (!currentAuth.isConfigured || !currentAuth.user || !client || !snapshot.checkin) {
        return;
      }

      await acknowledgeWeeklyCheckinReview(client, currentAuth.user.id, snapshot.checkin.id);
      await reloadCheckIn();
    };

    return {
      loading,
      ready,
      error,
      dateKey,
      weekStartDate,
      weekEndDate,
      checkin: snapshot.checkin,
      responses: snapshot.responses,
      review: snapshot.review,
      summary: snapshot.summary,
      currentQuestionKey,
      currentQuestionIndex,
      currentQuestion,
      source: snapshot.source,
      questions: weeklyCheckinQuestions,
      reloadCheckIn,
      saveResponse,
      submitCheckIn,
      acknowledgeReview
    };
  }, [dateKey, loading, ready, error, snapshot]);

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>;
}

export function useCheckInStore() {
  const context = useContext(CheckInContext);

  if (!context) {
    throw new Error("useCheckInStore must be used within a CheckInProvider");
  }

  return context;
}
