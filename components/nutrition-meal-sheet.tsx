"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useTranslator } from "@/components/locale-provider";
import type { MealOption, MealSlot } from "@/lib/nutrition-data";
import { useReducedMotion } from "@/motion/useReducedMotion";

interface NutritionMealSheetProps {
  slot: MealSlot;
  options: MealOption[];
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

function copyFor(locale: string) {
  return (
    {
      en: {
        mealLabels: { breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", dinner: "Dinner" },
        chooseOption: "Choose option",
        close: "Close meal chooser",
        cancel: "Cancel",
        confirm: "Confirm selection",
        noSafeOptions: "No safe options available",
        target: "target"
      },
      es: {
        mealLabels: { breakfast: "Desayuno", lunch: "Comida", snack: "Merienda", dinner: "Cena" },
        chooseOption: "Elegir opción",
        close: "Cerrar selector",
        cancel: "Cancelar",
        confirm: "Confirmar selección",
        noSafeOptions: "No hay opciones seguras",
        target: "objetivo"
      },
      ca: {
        mealLabels: { breakfast: "Esmorzar", lunch: "Dinar", snack: "Berenar", dinner: "Sopar" },
        chooseOption: "Tria opció",
        close: "Tanca el selector",
        cancel: "Cancel·la",
        confirm: "Confirma la selecció",
        noSafeOptions: "No hi ha opcions segures",
        target: "objectiu"
      },
      de: {
        mealLabels: { breakfast: "Frühstück", lunch: "Mittagessen", snack: "Snack", dinner: "Abendessen" },
        chooseOption: "Option wählen",
        close: "Auswahl schließen",
        cancel: "Abbrechen",
        confirm: "Auswahl bestätigen",
        noSafeOptions: "Keine sicheren Optionen verfügbar",
        target: "Ziel"
      }
    }[locale as "en" | "es" | "ca" | "de"] ?? {
      mealLabels: { breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", dinner: "Dinner" },
      chooseOption: "Choose option",
      close: "Close meal chooser",
      cancel: "Cancel",
      confirm: "Confirm selection",
      noSafeOptions: "No safe options available",
      target: "target"
    }
  );
}

type NutritionSheetPresentationCopy = {
  mealLabels: { breakfast: string; lunch: string; snack: string; dinner: string };
  options: Record<string, { name: string; summary: string }>;
};

function nutritionSheetPresentationFor(locale: string): NutritionSheetPresentationCopy | null {
  if (locale !== "es") {
    return null;
  }

  return {
    mealLabels: { breakfast: "Desayuno", lunch: "Comida", snack: "Merienda", dinner: "Cena" },
    options: {
      "eggs-avocado-toast": { name: "Tostada de huevos y aguacate", summary: "Desayuno saciante con energía estable." },
      "greek-yogurt-parfait": { name: "Parfait de yogur griego", summary: "Opción más ligera con proteína y fruta." },
      "overnight-oats-whey": { name: "Avena nocturna + whey", summary: "Desayuno portátil con un reparto de macros fiable." },
      "chicken-rice-bowl": { name: "Bol de pollo con arroz", summary: "Proteína magra, arroz jazmín y verduras verdes." },
      "lean-beef-potato": { name: "Ternera magra + patata", summary: "Combustible de entrenamiento con recalentado fácil." },
      "turkey-wrap": { name: "Wrap de pavo", summary: "Comida portátil con macros equilibrados." },
      "chicken-pasta": { name: "Pasta con pollo", summary: "Opción más alta en carbohidratos para la ventana principal de entrenamiento." },
      "greek-yogurt-whey": { name: "Yogur griego + whey", summary: "Proteína rápida y poco tiempo de preparación." },
      "cottage-cheese-berries": { name: "Requesón con bayas", summary: "Merienda cremosa con saciedad estable." },
      "protein-shake-banana": { name: "Batido de proteína + plátano", summary: "La opción con menos fricción cuando te mueves entre sesiones." },
      "chicken-sweet-potato": { name: "Pollo + boniato", summary: "Cena equilibrada que replica la copia exportada actual." },
      "salmon-rice": { name: "Salmón + arroz", summary: "Opción de recuperación con más grasa y porcionado sencillo." },
      "turkey-chili": { name: "Chili de pavo", summary: "Cena batch-friendly con final caliente." },
      "protein-oats": { name: "Avena proteica", summary: "Avena caliente con un final alto en proteína." },
      "egg-white-wrap": { name: "Wrap de claras", summary: "Desayuno magro para un día más ligero." },
      "yogurt-granola-rest": { name: "Yogur + granola", summary: "Opción sencilla con proteína suficiente para la recuperación." },
      "turkey-potato-rest": { name: "Pavo + patata", summary: "Plato de recuperación sencillo con ingredientes familiares." },
      "salmon-salad-rest": { name: "Ensalada de salmón", summary: "Comida alta en proteína con menos carga de carbohidratos." },
      "chicken-bowl-rest": { name: "Bol de pollo", summary: "Bol práctico para la estructura del día de descanso." },
      "cottage-cheese-rest": { name: "Requesón con bayas", summary: "Merienda alta en proteína y de preparación rápida." },
      "yogurt-pumpkin-rest": { name: "Yogur + semillas de calabaza", summary: "Merienda fácil con un perfil de carbohidratos más ligero." },
      "protein-shake-rest": { name: "Batido de proteína", summary: "Opción rápida cuando el día va cargado." },
      "cod-rice-rest": { name: "Bacalao + arroz", summary: "Cena ligera que mantiene la proteína alta." },
      "turkey-pasta-rest": { name: "Pasta con pavo", summary: "Cena cómoda para una noche de menor intensidad." },
      "salmon-veg-rest": { name: "Salmón + verduras", summary: "Cena con más grasa y preparación simple." }
    }
  };
}

export function NutritionMealSheet({
  slot,
  options,
  selectedOptionId,
  onSelectOption,
  onConfirm,
  onClose
}: NutritionMealSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { locale } = useTranslator();
  const copy = copyFor(locale);
  const presentation = nutritionSheetPresentationFor(locale);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;

    if (!sheet || reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(sheet, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" });
    }, sheet);

    return () => context.revert();
  }, [portalRoot, reducedMotion, slot.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const selectedOption = options.find((option) => option.id === selectedOptionId) ?? null;
  const slotLabel = presentation?.mealLabels[slot.id as keyof typeof presentation.mealLabels] ?? copy.mealLabels[slot.id as keyof typeof copy.mealLabels] ?? slot.label;

  if (!portalRoot) {
    return null;
  }

  return createPortal(
    <div className="nutrition-sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={sheetRef}
        aria-labelledby="nutrition-meal-sheet-title"
        aria-modal="true"
        className="nutrition-sheet card elevated"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="nutrition-sheet__grabber" aria-hidden="true" />
        <div className="nutrition-sheet__header">
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>
              {copy.chooseOption}
            </div>
            <h3 className="headline-md" id="nutrition-meal-sheet-title">
              {slotLabel}
            </h3>
            <p className="caption" style={{ marginTop: 6 }}>
              {slot.target.calories} kcal {copy.target} · {slot.target.protein}P / {slot.target.carbs}C / {slot.target.fat}F
            </p>
          </div>
          <button aria-label={copy.close} className="tap-target focus-ring nutrition-sheet__close" onClick={onClose} type="button">
            <span className="icon" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <div className="nutrition-sheet__body">
          {options.map((option) => {
            const isSelected = option.id === selectedOptionId;

            return (
              <button
                key={option.id}
                className={`nutrition-option-card focus-ring ${isSelected ? "selected" : ""}`.trim()}
                onClick={() => onSelectOption(option.id)}
                type="button"
              >
                <div className="nutrition-option-card__top">
                  <div>
                    <div className="body-md" style={{ fontWeight: 700 }}>
                      {presentation?.options[option.id]?.name ?? option.name}
                    </div>
                    <div className="caption" style={{ marginTop: 4 }}>
                      {presentation?.options[option.id]?.summary ?? option.summary}
                    </div>
                  </div>
                  <span className="pill nutrition-option-card__pill" style={{ minHeight: 24 }}>
                    {option.prepTime}
                  </span>
                </div>

                <div className="nutrition-option-card__macro">
                  {option.macro.calories} kcal · {option.macro.protein}P / {option.macro.carbs}C / {option.macro.fat}F
                </div>

                <div className="nutrition-food-list">
                  {option.portions.map((portion) => (
                    <div key={`${option.id}-${portion.name}`} className="nutrition-food-row">
                      <span>{portion.name}</span>
                      <span>
                        {portion.amount}
                        {portion.note ? ` · ${portion.note}` : ""}
                        {" "}
                        <span className="nutrition-food-row__state">({portion.preparation})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="nutrition-sheet__footer">
          <button className="button-secondary focus-ring nutrition-sheet__secondary" onClick={onClose} type="button">
            {copy.cancel}
          </button>
          <button className="button-primary focus-ring nutrition-sheet__primary" disabled={!selectedOption} onClick={onConfirm} type="button">
            {copy.confirm}
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  );
}
