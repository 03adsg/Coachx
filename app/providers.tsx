"use client";

import type { ReactNode } from "react";
import { WorkoutProvider } from "@/components/workout-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <WorkoutProvider>{children}</WorkoutProvider>;
}
