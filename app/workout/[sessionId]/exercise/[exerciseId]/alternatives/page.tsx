"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useWorkoutStore } from "@/components/workout-provider";
import { getExerciseDefinition, getWorkoutAlternativeCards, getWorkoutExercise } from "@/lib/workout-data";

export default function ExerciseAlternativesPage() {
  const params = useParams<{ sessionId: string; exerciseId: string }>();
  const router = useRouter();
  const exerciseId = params?.exerciseId ?? "hip-thrust";
  const { session, swapExercise } = useWorkoutStore();
  const exercise = getWorkoutExercise(session, exerciseId);
  const currentDefinition = getExerciseDefinition(exercise.prescribedExerciseId);
  const performedDefinition = getExerciseDefinition(exercise.performedExerciseId);
  const alternatives = getWorkoutAlternativeCards(currentDefinition.id);

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
          <div className="workout-section-topbar__copy">
            <div className="headline-md" style={{ fontSize: 20, textTransform: "uppercase" }}>
              Choose Alternative
            </div>
            <div className="caption">Replacing {currentDefinition.name}</div>
          </div>
          <button aria-label="Search" className="tap-target focus-ring" type="button">
            <span className="icon" aria-hidden="true">
              search
            </span>
          </button>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <Card className="workout-alternative-current">
            <div className="row start">
              <div className="workout-alternative-current__thumb">
                <img alt={performedDefinition.name} src={performedDefinition.thumbnail ?? performedDefinition.heroImage ?? "/coachx-icon.svg"} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="workout-status-pill">Current</div>
                <h1 className="headline-md" style={{ marginTop: 8, textTransform: "uppercase" }}>
                  {performedDefinition.name}
                </h1>
                <div className="caption" style={{ marginTop: 4 }}>
                  Equipment: {performedDefinition.equipment.toUpperCase()}
                </div>
                <div className="caption" style={{ marginTop: 4 }}>
                  {performedDefinition.summary}
                </div>
              </div>
            </div>
            <div className="workout-mini-panel" style={{ marginTop: 12 }}>
              <div className="row">
                <span className="caption">Prescription:</span>
                <span className="body-md" style={{ fontWeight: 700 }}>
                  {currentDefinition.programSets} x {currentDefinition.programReps} <span className="caption">| RIR {currentDefinition.programRir}</span>
                </span>
              </div>
            </div>
          </Card>
        </section>

        <section className="section workout-filter-scroll">
          {["All", "Machine", "Dumbbells", "Barbell", "Smith", "Cable"].map((chip, index) => (
            <button key={chip} className={`workout-filter-chip ${index === 0 ? "active" : ""}`} type="button">
              {chip}
            </button>
          ))}
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Best Matches
          </div>
          <div className="caption" style={{ fontStyle: "italic", marginBottom: 12 }}>
            Glute-focused hip extension. Alternatives preserve primary training objective.
          </div>

          <div className="stack">
            {alternatives.map((alternative) => {
              const definition = getExerciseDefinition(alternative.exerciseId);
              return (
                <Card key={alternative.id} className="workout-alternative-card">
                  <div className="workout-status-pill workout-status-pill--match">
                    {alternative.label} MATCH
                  </div>
                  <h2 className="headline-md" style={{ marginTop: 12, textTransform: "uppercase" }}>
                    {definition.name}
                  </h2>
                  <div className="caption" style={{ marginTop: 4 }}>
                    Equipment: {alternative.equipment.toUpperCase()}
                  </div>
                  <p className="body-md" style={{ marginTop: 12, color: "var(--text-secondary)" }}>
                    {alternative.summary}
                  </p>
                  <div className="workout-mini-panel" style={{ marginTop: 14 }}>
                    <div className="row">
                      <span className="caption">Last:</span>
                      <span className="body-md" style={{ fontWeight: 700 }}>
                        {alternative.lastPerformance}
                      </span>
                    </div>
                  </div>
                  <button
                    className="workout-secondary-button focus-ring"
                    type="button"
                    onClick={() => {
                      swapExercise(exercise.id, alternative.exerciseId);
                      router.push(`/workout/${session.id}/exercise/${exercise.id}`);
                    }}
                  >
                    <span className="icon" aria-hidden="true">
                      swap_horiz
                    </span>
                    Use This Exercise
                  </button>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </Screen>
  );
}
