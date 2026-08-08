"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useWorkoutStore } from "@/components/workout-provider";

const choices = ["I can't train today", "I need a shorter session", "I want to train later", "I missed this workout", "Other"];

export default function AdjustWorkoutPage() {
  const router = useRouter();
  const { session, updateSafety } = useWorkoutStore();
  const [selected, setSelected] = useState<string | null>(null);

  const continueHref =
    selected === "I need a shorter session" || selected === "I can't train today"
      ? `/workout/${session.id}/adjust/shorter`
      : `/workout/${session.id}/adjust/reorganize`;

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="workout-section-topbar">
          <button aria-label="Back" className="tap-target focus-ring" type="button" onClick={() => router.back()}>
            <span className="icon" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <div className="headline-md" style={{ fontSize: 20, textTransform: "uppercase" }}>
            Adjust Workout
          </div>
          <span className="tap-target" />
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <Card className="workout-adjust-hero">
            <div className="eyebrow" style={{ color: "#b6ff00" }}>
              Today
            </div>
            <h1 className="headline-lg" style={{ marginTop: 8, textTransform: "uppercase" }}>
              {session.workoutType}
            </h1>
            <div className="body-lg" style={{ marginTop: 8, color: "var(--text-secondary)" }}>
              {session.phaseLabel}
            </div>
            <div className="caption" style={{ marginTop: 12 }}>
              {session.totalExercises} exercises · ~68 min
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            What changed?
          </div>
          <div className="stack">
            {choices.map((choice) => (
              <button
                key={choice}
                className={`workout-choice-card ${selected === choice ? "selected" : ""}`}
                type="button"
                onClick={() => {
                  setSelected(choice);
                  updateSafety({ action: choice });
                }}
              >
                <span className="body-lg" style={{ textTransform: "uppercase" }}>
                  {choice}
                </span>
                <span className="choice-radio" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <div className="sticky-action">
          <Link className={`button-primary focus-ring ${selected ? "" : "is-disabled"}`.trim()} aria-disabled={!selected} href={continueHref}>
            Continue
          </Link>
        </div>
      </main>
    </Screen>
  );
}
