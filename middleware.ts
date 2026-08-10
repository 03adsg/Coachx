import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseRouteClient } from "@/lib/supabase/server";
import { isCoachxDemoMode, isSupabaseConfigured } from "@/lib/supabase/env";
import { isProtectedAthleteRoute, isProtectedCoachRoute } from "@/lib/auth/navigation";

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
    if (isProtectedCoachRoute(pathname) || isProtectedAthleteRoute(pathname)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/entry";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  const [athleteResult, coachResult] = await Promise.all([
    athleteClient.from("athlete_profiles").select("onboarding_status").eq("id", user.id).maybeSingle(),
    athleteClient.from("coach_profiles").select("id").eq("user_id", user.id).maybeSingle()
  ]);

  if (athleteResult.error || coachResult.error) {
    return response;
  }

  const isCoach = Boolean(coachResult.data);
  const onboardingStatus = athleteResult.data?.onboarding_status ?? "not_started";
  const routeForStatus = isCoach && !athleteResult.data ? "/coach" : onboardingStatus === "completed" ? "/" : "/onboarding";

  if (isProtectedCoachRoute(pathname)) {
    if (!isCoach) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/entry";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname === "/coach" || pathname === "/coach/") {
      return response;
    }

    return response;
  }

  if (isCoach && !athleteResult.data && (pathname === "/" || pathname === "/entry" || pathname === "/login")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/coach";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (!athleteResult.data) {
    if (isProtectedAthleteRoute(pathname)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/entry";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

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
