"use client";

import { useSearchParams } from "next/navigation";
import { NutritionScreen } from "@/components/nutrition-screen";
import { useProgramStore } from "@/components/program-provider";

export default function NutritionPage() {
  const searchParams = useSearchParams();
  const { selectedDateKey } = useProgramStore();
  const requestedDate = searchParams.get("date");
  const requestedMode = searchParams.get("state");
  const dateKey = requestedDate ?? selectedDateKey ?? new Date().toISOString().slice(0, 10);
  const mode = requestedMode === "loading" || requestedMode === "empty" || requestedMode === "error" ? requestedMode : "ready";

  return <NutritionScreen dateKey={dateKey} mode={mode} />;
}
