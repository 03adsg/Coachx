import { NextResponse, type NextRequest } from "next/server";
import { getOpenAIClient } from "@/lib/ai/openai-client";
import { buildCoachRecommendationContext } from "@/lib/ai/coach-context";
import { generateCoachRecommendation } from "@/lib/ai/coach-engine";
import { getLatestCoachRecommendation, saveCoachRecommendation } from "@/lib/ai/recommendation-service";
import { coachRecommendationContextTypeSchema } from "@/lib/ai/schemas";
import { createSupabaseRouteClient } from "@/lib/supabase/server";

function createFallbackResponse(message: string, status = 503) {
  return NextResponse.json(
    {
      error: message
    },
    { status }
  );
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

function parseRequestBody(body: unknown) {
  const value = body as Record<string, unknown> | null;
  const contextType = coachRecommendationContextTypeSchema.parse(value?.contextType ?? "phase_review");
  const contextKey = typeof value?.contextKey === "string" && value.contextKey.trim().length > 0 ? value.contextKey.trim() : "current";

  return {
    contextType,
    contextKey
  };
}

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  const auth = await resolveAuth(request, response);

  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const url = new URL(request.url);
  const contextType = coachRecommendationContextTypeSchema.parse(url.searchParams.get("contextType") ?? "phase_review");
  const contextKey = url.searchParams.get("contextKey")?.trim() || "current";

  const latest = await getLatestCoachRecommendation(auth.supabase!, auth.userId!, contextType, contextKey);

  return jsonWithCookies(response, {
    recommendation: latest,
    found: Boolean(latest)
  });
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  const auth = await resolveAuth(request, response);

  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const body = await request.json().catch(() => ({}));
  const { contextType, contextKey } = parseRequestBody(body);
  const context = await buildCoachRecommendationContext(auth.supabase!, auth.userId!, contextType, contextKey);
  const openAI = getOpenAIClient();
  const result = await generateCoachRecommendation(openAI?.client ?? null, openAI?.model ?? "fallback", context);
  const saved = await saveCoachRecommendation(auth.supabase!, auth.userId!, context, result);

  return jsonWithCookies(response, {
    recommendation: saved,
    generationStatus: result.generationStatus,
    source: result.source,
    openaiConfigured: Boolean(openAI)
  });
}
