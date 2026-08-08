"use client";

import type { ReactNode } from "react";
import { OnboardingProvider } from "@/components/onboarding-provider";
import { ProfileSettingsProvider } from "@/components/profile-settings-provider";
import { ProgressProvider } from "@/components/progress-provider";
import { WorkoutProvider } from "@/components/workout-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <WorkoutProvider>
      <ProgressProvider>
        <OnboardingProvider>
          <ProfileSettingsProvider>{children}</ProfileSettingsProvider>
        </OnboardingProvider>
      </ProgressProvider>
    </WorkoutProvider>
  );
}
