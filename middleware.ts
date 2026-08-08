import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { isCoachxDemoMode, isSupabaseConfigured } from "@/lib/supabase/env";
import { isProtectedAthleteRoute } from "@/lib/auth/navigation";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isSupabaseConfigured() || isCoachxDemoMode()) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createSupabaseRouteClient(request, response);

  if (!supabase) {
    return NextResponse.next();
  }

  const athleteClient = supabase as SupabaseClient<any>;
  const {
    data: { user }
  } = await athleteClient.auth.getUser();

  if (!user) {
    if (isProtectedAthleteRoute(pathname)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/entry";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  const { data: profile, error } = await athleteClient
    .from("athlete_profiles")
    .select("onboarding_status")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return response;
  }

  const onboardingStatus = profile?.onboarding_status ?? "not_started";
  const routeForStatus = onboardingStatus === "completed" ? "/" : "/onboarding";

  if (pathname === "/entry" || pathname === "/login") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = routeForStatus;
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/" && routeForStatus !== "/") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = routeForStatus;
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (onboardingStatus !== "completed" && isProtectedAthleteRoute(pathname) && !pathname.startsWith("/onboarding") && !pathname.startsWith("/entry")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/onboarding";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|manifest.json|robots.txt|sitemap.xml).*)"]
};
