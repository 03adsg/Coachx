"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useWorkoutStore } from "@/components/workout-provider";
import { getExerciseDefinition, getWorkoutExercise } from "@/lib/workout-data";

const choices = [
  "Continue with less weight",
  "Try a different range",
  "Use an alternative exercise",
  "Stop this exercise",
  "Ask AthlexForce"
];

export default function SafetyResolutionPage() {
  const params = useParams<{ exerciseId: string }>();
  const router = useRouter();
  const { session, updateSafety } = useWorkoutStore();
  const exercise = getWorkoutExercise(session, params?.exerciseId ?? session.exercises[0].id);
  const definition = getExerciseDefinition(exercise.performedExerciseId);

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
            Adjust Session
          </div>
          <span className="tap-target" />
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <Card className="workout-safety-exercise-card">
            <div className="eyebrow" style={{ color: "#b6ff00" }}>
              Step 06 — Session Decision
            </div>
            <div className="headline-lg" style={{ marginTop: 8 }}>
              What should happen next?
            </div>
            <div className="caption" style={{ marginTop: 6 }}>
              {definition.name} · {definition.label}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="stack">
            {choices.map((choice) => (
              <button
                key={choice}
                className={`workout-choice-card ${session.safety.action === choice ? "selected" : ""}`}
                type="button"
                onClick={() => updateSafety({ action: choice })}
              >
                <span className="body-lg" style={{ textTransform: "uppercase" }}>
                  {choice}
                </span>
                <span className="choice-radio" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <Card className="workout-detail-card">
            <div className="eyebrow">Log summary</div>
            <div className="caption" style={{ marginTop: 8 }}>
              Set {exercise.completedSets.length + 1} / {exercise.totalSets} · {definition.programReps} target
            </div>
          </Card>
        </section>

        <div className="sticky-action">
          <Link className="button-primary focus-ring" href={`/workout/${session.id}/exercise/${exercise.id}`}>
            Save &amp; Continue
          </Link>
        </div>
      </main>
    </Screen>
  );
}
