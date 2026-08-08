"use client";

import type { ReactNode } from "react";
import { ProgressProvider } from "@/components/progress-provider";
import { WorkoutProvider } from "@/components/workout-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <WorkoutProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </WorkoutProvider>
  );
}
