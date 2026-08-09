"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAuthStore } from "@/components/auth-provider";
import { useProgramStore } from "@/components/program-provider";
import { applyMealSelection, addHydration, buildNutritionDayView, createNutritionStoreSnapshot, markMealCompleted, markMealEaten, nutritionStorageKey, reviveNutritionStoreSnapshot, serializeNutritionStoreSnapshot, toggleSupplement, type NutritionStoreSnapshot } from "@/lib/nutrition-service";
import type { NutritionDay } from "@/lib/nutrition-data";

interface NutritionStoreValue {
  day: NutritionDay;
  selectMealOption: (slotId: string, optionId: string) => void;
  markMealEaten: (slotId: string) => void;
  markMealCompleted: (slotId: string) => void;
  addHydration: (amountMl: number) => void;
  toggleSupplement: (reminderId: string) => void;
  resetNutritionDemo: () => void;
}

const NutritionStoreContext = createContext<NutritionStoreValue | null>(null);

export function NutritionProvider({ children, dateKey }: { children: ReactNode; dateKey: string }) {
  const auth = useAuthStore();
  const programStore = useProgramStore();
  const authRef = useRef(auth);
  const programStoreRef = useRef(programStore);
  const hydratedRef = useRef(false);
  const [snapshot, setSnapshot] = useState<NutritionStoreSnapshot>(() =>
    createNutritionStoreSnapshot(dateKey, programStore.getDaySummary(dateKey), auth.user?.id ?? "demo-user", programStore.activeProgram?.id ?? null)
  );

  const programDaySummary = programStore.getDaySummary(dateKey);
  const programSignature = [
    programDaySummary?.scheduledWorkoutId ?? "rest",
    programDaySummary?.templateCode ?? "none",
    programDaySummary?.isRestDay ? "rest" : "training",
    programStore.activeProgram?.id ?? "program-none"
  ].join("|");

  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  useEffect(() => {
    programStoreRef.current = programStore;
  }, [programStore]);

  useEffect(() => {
    if (!auth.ready || !programStore.ready) {
      return;
    }

    hydratedRef.current = false;

    const currentAuth = authRef.current;
    const currentProgram = programStoreRef.current;
    const storageKey = nutritionStorageKey(currentAuth.user?.id ?? null, dateKey);
    const rawSnapshot = typeof window === "undefined" ? null : window.localStorage.getItem(storageKey);
    const revived = reviveNutritionStoreSnapshot(rawSnapshot, dateKey, currentProgram.getDaySummary(dateKey));
    const shouldRefresh =
      !rawSnapshot ||
      revived.day.calendarDate !== dateKey ||
      revived.plan.userId !== (currentAuth.user?.id ?? "demo-user") ||
      revived.day.dayType !== (currentProgram.getDaySummary(dateKey)?.isRestDay ? "rest" : "training");

    const nextSnapshot = shouldRefresh
      ? createNutritionStoreSnapshot(
          dateKey,
          currentProgram.getDaySummary(dateKey),
          currentAuth.user?.id ?? "demo-user",
          currentProgram.activeProgram?.id ?? null
        )
      : {
          ...revived,
          plan: {
            ...revived.plan,
            userId: currentAuth.user?.id ?? revived.plan.userId
          },
          day: {
            ...revived.day,
            userId: currentAuth.user?.id ?? revived.day.userId
          }
        };

    setSnapshot(nextSnapshot);
    hydratedRef.current = true;
  }, [dateKey, auth.ready, auth.user?.id, programStore.ready, programSignature]);

  useEffect(() => {
    if (!hydratedRef.current || typeof window === "undefined") {
      return;
    }

    const storageKey = nutritionStorageKey(authRef.current.user?.id ?? null, dateKey);
    window.localStorage.setItem(storageKey, serializeNutritionStoreSnapshot(snapshot));
  }, [snapshot, dateKey]);

  const day = useMemo(() => buildNutritionDayView(snapshot), [snapshot]);

  const value = useMemo<NutritionStoreValue>(() => {
    const selectMealOption: NutritionStoreValue["selectMealOption"] = (slotId, optionId) => {
      setSnapshot((current) => applyMealSelection(current, slotId, optionId));
    };

    const markMealEatenAction: NutritionStoreValue["markMealEaten"] = (slotId) => {
      setSnapshot((current) => markMealEaten(current, slotId));
    };

    const markMealCompletedAction: NutritionStoreValue["markMealCompleted"] = (slotId) => {
      setSnapshot((current) => markMealCompleted(current, slotId));
    };

    const addHydrationAction: NutritionStoreValue["addHydration"] = (amountMl) => {
      setSnapshot((current) => addHydration(current, amountMl));
    };

    const toggleSupplementAction: NutritionStoreValue["toggleSupplement"] = (reminderId) => {
      setSnapshot((current) => toggleSupplement(current, reminderId));
    };

    const resetNutritionDemo: NutritionStoreValue["resetNutritionDemo"] = () => {
      const currentAuth = authRef.current;
      const currentProgram = programStoreRef.current;
      setSnapshot(
        createNutritionStoreSnapshot(
          dateKey,
          currentProgram.getDaySummary(dateKey),
          currentAuth.user?.id ?? "demo-user",
          currentProgram.activeProgram?.id ?? null
        )
      );
    };

    return {
      day,
      selectMealOption,
      markMealEaten: markMealEatenAction,
      markMealCompleted: markMealCompletedAction,
      addHydration: addHydrationAction,
      toggleSupplement: toggleSupplementAction,
      resetNutritionDemo
    };
  }, [day, dateKey]);

  return <NutritionStoreContext.Provider value={value}>{children}</NutritionStoreContext.Provider>;
}

export function useNutritionSession() {
  const context = useContext(NutritionStoreContext);

  if (!context) {
    throw new Error("useNutritionSession must be used within a NutritionProvider");
  }

  return context;
}
