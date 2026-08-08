"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth-provider";
import { OnboardingProvider } from "@/components/onboarding-provider";
import { ProfileSettingsProvider } from "@/components/profile-settings-provider";
import { ProgressProvider } from "@/components/progress-provider";
import { WorkoutProvider } from "@/components/workout-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <ProgressProvider>
          <OnboardingProvider>
            <ProfileSettingsProvider>{children}</ProfileSettingsProvider>
          </OnboardingProvider>
        </ProgressProvider>
      </WorkoutProvider>
    </AuthProvider>
  );
}
