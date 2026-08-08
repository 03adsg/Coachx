"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
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

export function NutritionMealSheet({
  slot,
  options,
  selectedOptionId,
  onSelectOption,
  onConfirm,
  onClose
}: NutritionMealSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const sheet = sheetRef.current;

    if (!sheet || reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        sheet,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" }
      );
    }, sheet);

    return () => context.revert();
  }, [reducedMotion, slot.id]);

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

  return (
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
              Choose option
            </div>
            <h3 className="headline-md" id="nutrition-meal-sheet-title">
              {slot.label}
            </h3>
            <p className="caption" style={{ marginTop: 6 }}>
              {slot.target.calories} kcal target · {slot.target.protein}P / {slot.target.carbs}C / {slot.target.fat}F
            </p>
          </div>
          <button aria-label="Close meal chooser" className="tap-target focus-ring nutrition-sheet__close" onClick={onClose} type="button">
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
            Cancel
          </button>
          <button
            className="button-primary focus-ring nutrition-sheet__primary"
            disabled={!selectedOption}
            onClick={onConfirm}
            type="button"
          >
            Confirm selection
          </button>
        </div>
      </div>
    </div>
  );
}
