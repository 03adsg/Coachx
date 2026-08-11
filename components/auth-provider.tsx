"use client";

import { createContext, useCallback, useEffect, useMemo, useState, useContext, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabaseConfigSummary, isCoachxDemoMode, isSupabaseConfigured } from "@/lib/supabase/env";
import { publishFeedbackError, publishFeedbackSuccess } from "@/components/feedback-provider";
import { readRememberSessionPreference, resolveSafeInternalPath, writeRememberSessionPreference } from "@/lib/auth/session-policy";
import { mapAuthErrorMessage } from "@/lib/auth/auth-errors";

interface AuthStoreValue {
  isConfigured: boolean;
  isDemoMode: boolean;
  ready: boolean;
  loading: boolean;
  rememberSession: boolean;
  session: Session | null;
  user: User | null;
  statusLabel: string;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (email: string, password: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
  refreshSession: () => Promise<void>;
  setRememberSessionPreference: (rememberSession: boolean) => void;
}

const AuthContext = createContext<AuthStoreValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [rememberSession, setRememberSession] = useState(() => readRememberSessionPreference());
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured());
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const setRememberSessionPreference = useCallback((nextRememberSession: boolean) => {
    setRememberSession(nextRememberSession);
  }, []);

  useEffect(() => {
    writeRememberSessionPreference(rememberSession);
  }, [rememberSession]);

  useEffect(() => {
    const client = getSupabaseBrowserClient(rememberSession);

    if (!client) {
      setReady(true);
      setLoading(false);
      return;
    }

    const activeClient = client;
    let active = true;

    async function hydrate() {
      setLoading(true);
      const { data, error } = await activeClient.auth.getSession();
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

    const { data } = activeClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setReady(true);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [rememberSession]);

  const value = useMemo<AuthStoreValue>(() => {
    const client = getSupabaseBrowserClient(rememberSession);

    if (!client) {
      const notConfigured = "Sign-in is not available right now.";

      return {
        isConfigured: false,
        isDemoMode: true,
        ready,
        loading,
        rememberSession,
        session,
        user: null,
        statusLabel: getSupabaseConfigSummary(),
        signInWithEmail: async () => notConfigured,
        signUpWithEmail: async () => notConfigured,
        signInWithGoogle: async () => notConfigured,
        requestPasswordReset: async () => notConfigured,
        updatePassword: async () => notConfigured,
        signOut: async () => notConfigured,
        refreshSession: async () => {},
        setRememberSessionPreference
      };
    }

    const currentRedirect = (pathname: string) => {
      if (typeof window === "undefined") {
        return pathname;
      }

      return `${window.location.origin}${resolveSafeInternalPath(pathname)}`;
    };

    const signInWithEmail: AuthStoreValue["signInWithEmail"] = async (email, password) => {
      const { error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        publishFeedbackError("auth.sign-in", "Sign in could not be completed", mapAuthErrorMessage(error.message));
      } else {
        publishFeedbackSuccess("auth.sign-in", "Signed in", "Your athlete route is ready.");
      }

      return error?.message ?? null;
    };

    const signUpWithEmail: AuthStoreValue["signUpWithEmail"] = async (email, password) => {
      const redirectTo = typeof window === "undefined" ? undefined : currentRedirect("/auth/callback?next=/");
      const { error } = await client.auth.signUp({
        email,
        password,
        options: redirectTo ? { emailRedirectTo: redirectTo } : undefined
      });

      if (error) {
        publishFeedbackError("auth.sign-up", "Sign up could not be completed", mapAuthErrorMessage(error.message));
      } else {
        publishFeedbackSuccess("auth.sign-up", "Account created", "Check your inbox if confirmation is required.");
      }

      return error?.message ?? null;
    };

    const signInWithGoogle: AuthStoreValue["signInWithGoogle"] = async () => {
      if (typeof window === "undefined") {
        return "Google sign-in is not available right now.";
      }

      const redirectTo = currentRedirect("/auth/callback?next=/");
      const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            prompt: "select_account"
          }
        }
      });

      if (error) {
        publishFeedbackError("auth.sign-in", "Google sign-in could not be completed", mapAuthErrorMessage(error.message));
        return error.message;
      }

      if (data?.url) {
        window.location.assign(data.url);
        return null;
      }

      return "Google sign-in could not be started.";
    };

    const requestPasswordReset: AuthStoreValue["requestPasswordReset"] = async (email) => {
      const redirectTo = typeof window === "undefined" ? undefined : currentRedirect("/auth/callback?next=/reset-password");
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo
      });

      if (error) {
        publishFeedbackError("auth.sign-in", "Reset email could not be sent", mapAuthErrorMessage(error.message));
      } else {
        publishFeedbackSuccess("auth.sign-in", "Reset link sent", "Check your email for the next step.");
      }

      return error?.message ?? null;
    };

    const updatePassword: AuthStoreValue["updatePassword"] = async (password) => {
      const { error } = await client.auth.updateUser({ password });

      if (error) {
        publishFeedbackError("auth.sign-in", "Password could not be updated", mapAuthErrorMessage(error.message));
      } else {
        publishFeedbackSuccess("auth.sign-in", "Password updated", "Sign in again with your new password.");
      }

      return error?.message ?? null;
    };

    const signOut: AuthStoreValue["signOut"] = async () => {
      const { error } = await client.auth.signOut();
      if (error) {
        publishFeedbackError("auth.sign-out", "Sign out could not be completed", mapAuthErrorMessage(error.message));
      } else {
        publishFeedbackSuccess("auth.sign-out", "Signed out", "Your session has ended.");
      }
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
      rememberSession,
      session,
      user: session?.user ?? null,
      statusLabel: getSupabaseConfigSummary(),
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      requestPasswordReset,
      updatePassword,
      signOut,
      refreshSession,
      setRememberSessionPreference
    };
  }, [loading, ready, rememberSession, session, setRememberSessionPreference]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStore() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthStore must be used within AuthProvider");
  }

  return context;
}
