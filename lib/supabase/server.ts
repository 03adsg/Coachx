import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseConfig } from "@/lib/supabase/env";

type CookiePair = { name: string; value: string; options?: CookieOptions };

interface CookieAdapter {
  getAll: () => Array<{ name: string; value: string }>;
  setAll: (cookies: CookiePair[]) => void;
}

export function createSupabaseServerClient(adapter: CookieAdapter) {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll: adapter.getAll,
      setAll: adapter.setAll
    }
  });
}

export function createSupabaseRouteClient(request: NextRequest, response: NextResponse) {
  return createSupabaseServerClient({
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookies) {
      cookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
    }
  });
}
