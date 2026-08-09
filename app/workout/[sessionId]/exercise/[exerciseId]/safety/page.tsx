"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useWorkoutStore } from "@/components/workout-provider";
import { getExerciseDefinition, getWorkoutExercise } from "@/lib/workout-data";

const feelings = ["Muscle Burn", "Soreness", "Discomfort", "Pain"] as const;

export default function SafetyAssessmentPage() {
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
            AthlexForce
          </div>
          <span className="tap-target" />
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <Card className="workout-safety-exercise-card">
            <div className="eyebrow" style={{ color: "#b6ff00" }}>
              Set 3 of 4
            </div>
            <div className="headline-md" style={{ marginTop: 8, textTransform: "uppercase" }}>
              {definition.name}
            </div>
            <div className="caption" style={{ marginTop: 6 }}>
              {definition.label}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="headline-lg">What doesn&apos;t feel right?</div>
        </section>

        <section className="section">
          <div className="stack">
            {feelings.map((feeling) => (
              <button
                key={feeling}
                className={`workout-choice-card ${session.safety.feeling?.toLowerCase() === feeling.toLowerCase() ? "selected" : ""}`}
                type="button"
                onClick={() => updateSafety({ feeling: feeling.toLowerCase() as typeof session.safety.feeling })}
              >
                <span className="body-lg" style={{ textTransform: "uppercase" }}>
                  {feeling}
                </span>
                <span className="choice-radio" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <div className="sticky-action">
          <Link className="button-primary focus-ring" href={`/workout/${session.id}/exercise/${exercise.id}/safety/location`}>
            Continue
          </Link>
        </div>
      </main>
    </Screen>
  );
}
