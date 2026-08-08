"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createNutritionSession, type MealSlot, type NutritionDay } from "@/lib/nutrition-data";

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

function storageKey(dateKey: string) {
  return `coachx-demo-nutrition-session:${dateKey}`;
}

function reviveDay(dateKey: string, rawValue: string | null) {
  if (!rawValue) {
    return createNutritionSession(dateKey);
  }

  try {
    const parsed = JSON.parse(rawValue) as NutritionDay;
    if (parsed.dateKey !== dateKey) {
      return createNutritionSession(dateKey);
    }

    return parsed;
  } catch {
    return createNutritionSession(dateKey);
  }
}

function updateMealSlot(day: NutritionDay, slotId: string, updater: (slot: MealSlot) => MealSlot) {
  return {
    ...day,
    mealSlots: day.mealSlots.map((slot) => (slot.id === slotId ? updater(slot) : slot))
  };
}

export function NutritionProvider({ children, dateKey }: { children: ReactNode; dateKey: string }) {
  const [day, setDay] = useState<NutritionDay>(() => createNutritionSession(dateKey));

  useEffect(() => {
    setDay(reviveDay(dateKey, window.localStorage.getItem(storageKey(dateKey))));
  }, [dateKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey(dateKey), JSON.stringify(day));
  }, [day, dateKey]);

  const value = useMemo<NutritionStoreValue>(() => {
    const selectMealOption: NutritionStoreValue["selectMealOption"] = (slotId, optionId) => {
      setDay((current) =>
        updateMealSlot(current, slotId, (slot) => ({
          ...slot,
          state: "selected",
          selectedOptionId: optionId
        }))
      );
    };

    const markMealEaten: NutritionStoreValue["markMealEaten"] = (slotId) => {
      setDay((current) =>
        updateMealSlot(current, slotId, (slot) => ({
          ...slot,
          state: slot.selectedOptionId ? "eaten" : slot.state
        }))
      );
    };

    const markMealCompleted: NutritionStoreValue["markMealCompleted"] = (slotId) => {
      setDay((current) =>
        updateMealSlot(current, slotId, (slot) => ({
          ...slot,
          state: slot.selectedOptionId ? "completed" : slot.state
        }))
      );
    };

    const addHydration: NutritionStoreValue["addHydration"] = (amountMl) => {
      setDay((current) => ({
        ...current,
        hydration: {
          ...current.hydration,
          currentMl: Math.min(current.hydration.targetMl, current.hydration.currentMl + amountMl)
        }
      }));
    };

    const toggleSupplement: NutritionStoreValue["toggleSupplement"] = (reminderId) => {
      setDay((current) => ({
        ...current,
        supplements: current.supplements.map((reminder) =>
          reminder.id === reminderId ? { ...reminder, checked: !reminder.checked } : reminder
        )
      }));
    };

    const resetNutritionDemo: NutritionStoreValue["resetNutritionDemo"] = () => {
      const demo = createNutritionSession(dateKey);
      setDay(demo);
      window.localStorage.setItem(storageKey(dateKey), JSON.stringify(demo));
    };

    return {
      day,
      selectMealOption,
      markMealEaten,
      markMealCompleted,
      addHydration,
      toggleSupplement,
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
