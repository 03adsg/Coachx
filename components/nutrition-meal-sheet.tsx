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
  const slotLabel = copy.mealLabels[slot.id as keyof typeof copy.mealLabels] ?? slot.label;

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
                      {option.name}
                    </div>
                    <div className="caption" style={{ marginTop: 4 }}>
                      {option.summary}
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
