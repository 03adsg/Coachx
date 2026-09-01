"use client";

import dynamic from "next/dynamic";
import { use } from "react";

const NutritionScreen = dynamic(() => import("@/components/nutrition-screen").then((module) => module.NutritionScreen), {
  ssr: false
});

interface NutritionPageProps {
  params: Promise<{ date: string }>;
  searchParams?: Promise<{ state?: "ready" | "loading" | "empty" | "error" }>;
}

export default function DayNutritionPage({ params, searchParams }: NutritionPageProps) {
  const { date } = use(params);
  const resolvedSearchParams = searchParams ? use(searchParams) : {};
  const mode = resolvedSearchParams.state ?? "ready";

  return <NutritionScreen dateKey={date} mode={mode} />;
}
