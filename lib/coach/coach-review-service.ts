import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CoachActionEventsInsert,
  CoachActionType,
  CoachReviewNotesInsert,
  Database,
  Json,
  WeeklyCheckinReviewStatus,
  CoachRecommendationApplicationStatus,
  ProgramChangeStatus,
  CoachReviewNotesRow
} from "@/lib/supabase/database.types";
import { buildCoachActionAuditMetadata } from "@/lib/coach/coach-policy";

export interface CoachReviewActionResult {
  status: "ok";
  noteId: string | null;
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function insertActionEvent(
  client: SupabaseClient<Database>,
  payload: Omit<CoachActionEventsInsert, "id" | "created_at">
) {
  const result = await client
    .from("coach_action_events")
    .insert({
      id: createId(),
      created_at: new Date().toISOString(),
      ...payload
    } as never)
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function addCoachReviewNote(
  client: SupabaseClient<Database>,
  coachUserId: string,
  athleteUserId: string,
  weeklyCheckinId: string,
  note: string
): Promise<CoachReviewNotesRow> {
  const result = await client
    .from("coach_review_notes")
    .insert({
      id: createId(),
      coach_user_id: coachUserId,
      athlete_user_id: athleteUserId,
      weekly_checkin_id: weeklyCheckinId,
      note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } satisfies CoachReviewNotesInsert as never)
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return result.data as CoachReviewNotesRow;
}

export async function markCoachCheckinReview(
  client: SupabaseClient<Database>,
  coachUserId: string,
  athleteUserId: string,
  weeklyCheckinId: string,
  status: WeeklyCheckinReviewStatus,
  note?: string | null
) {
  const reviewResult = await client
    .from("weekly_checkin_reviews")
    .upsert(
      {
        user_id: athleteUserId,
        weekly_checkin_id: weeklyCheckinId,
        status,
        reviewed_at: status === "reviewed" || status === "acknowledged" || status === "needs_attention" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      } satisfies Partial<Record<string, Json>> as never,
      { onConflict: "weekly_checkin_id" }
    )
    .select("*")
    .single();

  if (reviewResult.error) {
    throw reviewResult.error;
  }

  const noteRow: CoachReviewNotesRow | null = note?.trim() ? await addCoachReviewNote(client, coachUserId, athleteUserId, weeklyCheckinId, note.trim()) : null;
  await insertActionEvent(client, {
    coach_user_id: coachUserId,
    athlete_user_id: athleteUserId,
    action_type: status === "needs_attention" ? "followup_requested" : "checkin_reviewed",
    target_type: "weekly_checkin",
    target_id: weeklyCheckinId,
    metadata: buildCoachActionAuditMetadata({
      actionType: status === "needs_attention" ? "followup_requested" : "checkin_reviewed",
      status,
      note: noteRow?.note ?? null
    }) as unknown as Json
  });

  return {
    status: "ok" as const,
    noteId: noteRow?.id ?? null
  } satisfies CoachReviewActionResult;
}

export async function setCoachRecommendationDecision(
  client: SupabaseClient<Database>,
  coachUserId: string,
  athleteUserId: string,
  recommendationId: string,
  applicationStatus: CoachRecommendationApplicationStatus
) {
  const result = await client
    .from("ai_recommendations")
    .update({
      application_status: applicationStatus,
      updated_at: new Date().toISOString()
    } as never)
    .eq("id", recommendationId)
    .eq("user_id", athleteUserId)
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  await insertActionEvent(client, {
    coach_user_id: coachUserId,
    athlete_user_id: athleteUserId,
    action_type: applicationStatus === "rejected" ? "recommendation_rejected" : "recommendation_approved",
    target_type: "recommendation",
    target_id: recommendationId,
    metadata: buildCoachActionAuditMetadata({
      actionType: applicationStatus === "rejected" ? "recommendation_rejected" : "recommendation_approved",
      status: applicationStatus,
      note: null
    }) as unknown as Json
  });

  return result.data;
}

export async function setCoachProposalDecision(
  client: SupabaseClient<Database>,
  coachUserId: string,
  athleteUserId: string,
  proposalId: string,
  status: ProgramChangeStatus
) {
  const result = await client
    .from("program_change_proposals")
    .update({
      status,
      approved_at: status === "approved" ? new Date().toISOString() : null,
      rejected_at: status === "rejected" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    } as never)
    .eq("id", proposalId)
    .eq("user_id", athleteUserId)
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  await insertActionEvent(client, {
    coach_user_id: coachUserId,
    athlete_user_id: athleteUserId,
    action_type: status === "rejected" ? "proposal_rejected" : "proposal_approved",
    target_type: "proposal",
    target_id: proposalId,
    metadata: buildCoachActionAuditMetadata({
      actionType: status === "rejected" ? "proposal_rejected" : "proposal_approved",
      status,
      note: null
    }) as unknown as Json
  });

  return result.data;
}
