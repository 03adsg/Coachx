import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const redirectUrl = new URL("/", request.url);
  const code = request.nextUrl.searchParams.get("code");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.redirect(redirectUrl);
  const supabase = createSupabaseRouteClient(request, response);

  if (supabase && code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}
