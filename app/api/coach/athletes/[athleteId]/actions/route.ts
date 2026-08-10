import { NextResponse, type NextRequest } from "next/server";
import { isAssignedCoach } from "@/lib/coach/coach-auth-service";
import {
  addCoachReviewNote,
  markCoachCheckinReview,
  setCoachProposalDecision,
  setCoachRecommendationDecision
} from "@/lib/coach/coach-review-service";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import type { CoachActionTargetType, CoachActionType, CoachRecommendationApplicationStatus, ProgramChangeStatus, WeeklyCheckinReviewStatus } from "@/lib/supabase/database.types";

function createFallbackResponse(message: string, status = 503) {
  return NextResponse.json({ error: message }, { status });
}

function jsonWithCookies(source: NextResponse, body: unknown, status = 200) {
  const response = NextResponse.json(body, { status });
  for (const cookie of source.cookies.getAll()) {
    response.cookies.set({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      expires: cookie.expires,
      httpOnly: cookie.httpOnly,
      maxAge: cookie.maxAge,
      path: cookie.path,
      sameSite: cookie.sameSite,
      secure: cookie.secure,
      partitioned: cookie.partitioned
    });
  }
  return response;
}

async function resolveAuth(request: NextRequest, response: NextResponse) {
  const supabase = createSupabaseRouteClient(request, response);
  if (!supabase) {
    return { supabase: null, userId: null, errorResponse: createFallbackResponse("Supabase is not configured.") };
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase: null, userId: null, errorResponse: createFallbackResponse("Authentication is required.", 401) };
  }

  return { supabase, userId: user.id, errorResponse: null };
}

function parseBody(body: unknown) {
  const value = body as Record<string, unknown> | null;
  const targetType = typeof value?.targetType === "string" ? value.targetType.trim() : "";
  const targetId = typeof value?.targetId === "string" ? value.targetId.trim() : "";
  const actionType = typeof value?.actionType === "string" ? value.actionType.trim() : "";
  const status = typeof value?.status === "string" ? value.status.trim() : "";
  const note = typeof value?.note === "string" ? value.note.trim() : "";

  if (!targetType || !targetId || !actionType) {
    throw new Error("targetType, targetId, and actionType are required.");
  }

  return {
    targetType: targetType as CoachActionTargetType,
    targetId,
    actionType: actionType as CoachActionType,
    status,
    note: note.length > 0 ? note : null
  };
}

function parseCheckinStatus(actionType: CoachActionType, status: string): WeeklyCheckinReviewStatus {
  if (status === "reviewed" || status === "needs_attention" || status === "acknowledged") {
    return status;
  }

  if (actionType === "checkin_acknowledged") {
    return "acknowledged";
  }

  if (actionType === "followup_requested") {
    return "needs_attention";
  }

  return "reviewed";
}

function parseProposalStatus(actionType: CoachActionType, status: string): ProgramChangeStatus {
  if (status === "approved" || status === "rejected") {
    return status;
  }

  return actionType === "proposal_rejected" ? "rejected" : "approved";
}

function parseRecommendationStatus(actionType: CoachActionType, status: string): CoachRecommendationApplicationStatus {
  if (status === "reviewing" || status === "rejected") {
    return status;
  }

  return actionType === "recommendation_rejected" ? "rejected" : "reviewing";
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ athleteId: string }> }) {
  const response = NextResponse.json({ ok: true });
  const auth = await resolveAuth(request, response);
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const { athleteId } = await params;
  const allowed = await isAssignedCoach(auth.supabase!, auth.userId!, athleteId);
  if (!allowed) {
    return createFallbackResponse("This athlete is not assigned to the current coach.", 403);
  }

  const body = await request.json().catch(() => ({}));

  try {
    const { targetType, targetId, actionType, status, note } = parseBody(body);

    if (targetType === "weekly_checkin") {
      if (actionType === "note_added" && note) {
        const noteRow = await addCoachReviewNote(auth.supabase!, auth.userId!, athleteId, targetId, note);
        return jsonWithCookies(response, { note: noteRow });
      }

      const review = await markCoachCheckinReview(
        auth.supabase!,
        auth.userId!,
        athleteId,
        targetId,
        parseCheckinStatus(actionType, status),
        note
      );

      return jsonWithCookies(response, review);
    }

    if (targetType === "recommendation") {
      const recommendation = await setCoachRecommendationDecision(auth.supabase!, auth.userId!, athleteId, targetId, parseRecommendationStatus(actionType, status));
      return jsonWithCookies(response, { recommendation });
    }

    if (targetType === "proposal") {
      const proposal = await setCoachProposalDecision(auth.supabase!, auth.userId!, athleteId, targetId, parseProposalStatus(actionType, status));
      return jsonWithCookies(response, { proposal });
    }

    return createFallbackResponse("Unsupported coach action target.", 400);
  } catch (error) {
    return createFallbackResponse(error instanceof Error ? error.message : "Unable to process coach action.", 400);
  }
}

