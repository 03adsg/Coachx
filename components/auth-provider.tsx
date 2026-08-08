"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabaseConfigSummary, isCoachxDemoMode, isSupabaseConfigured } from "@/lib/supabase/env";

interface AuthStoreValue {
  isConfigured: boolean;
  isDemoMode: boolean;
  ready: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  statusLabel: string;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthStoreValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured());
  const [loading, setLoading] = useState(isSupabaseConfigured());

  useEffect(() => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      setReady(true);
      setLoading(false);
      return;
    }

    const supabase = client;
    let active = true;

    async function hydrate() {
      const { data, error } = await supabase.auth.getSession();
      if (!active) {
        return;
      }

      if (!error) {
        setSession(data.session);
      }

      setReady(true);
      setLoading(false);
    }

    void hydrate();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setReady(true);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthStoreValue>(() => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      const notConfigured = "Supabase auth is not configured.";

      return {
        isConfigured: false,
        isDemoMode: true,
        ready,
        loading,
        session,
        user: null,
        statusLabel: getSupabaseConfigSummary(),
        signInWithEmail: async () => notConfigured,
        signUpWithEmail: async () => notConfigured,
        signOut: async () => notConfigured,
        refreshSession: async () => {}
      };
    }

    const signInWithEmail: AuthStoreValue["signInWithEmail"] = async (email, password) => {
      const { error } = await client.auth.signInWithPassword({
        email,
        password
      });

      return error?.message ?? null;
    };

    const signUpWithEmail: AuthStoreValue["signUpWithEmail"] = async (email, password) => {
      const redirectTo = typeof window === "undefined" ? undefined : `${window.location.origin}/auth/callback`;
      const { error } = await client.auth.signUp({
        email,
        password,
        options: redirectTo ? { emailRedirectTo: redirectTo } : undefined
      });

      return error?.message ?? null;
    };

    const signOut: AuthStoreValue["signOut"] = async () => {
      const { error } = await client.auth.signOut();
      return error?.message ?? null;
    };

    const refreshSession: AuthStoreValue["refreshSession"] = async () => {
      const { data } = await client.auth.getSession();
      setSession(data.session);
    };

    return {
      isConfigured: isSupabaseConfigured(),
      isDemoMode: isCoachxDemoMode(),
      ready,
      loading,
      session,
      user: session?.user ?? null,
      statusLabel: getSupabaseConfigSummary(),
      signInWithEmail,
      signUpWithEmail,
      signOut,
      refreshSession
    };
  }, [loading, ready, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStore() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthStore must be used within AuthProvider");
  }

  return context;
}
