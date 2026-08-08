"use client";

import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useWorkoutStore } from "@/components/workout-provider";
import { getExerciseDefinition } from "@/lib/workout-data";

export default function ExerciseDetailPage() {
  const params = useParams<{ exerciseId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const exerciseId = params?.exerciseId ?? "barbell-hip-thrust";
  const definition = getExerciseDefinition(exerciseId);
  const { session } = useWorkoutStore();
  const fromWorkout = searchParams.get("from") === "workout";

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="exercise-detail-topbar">
          <button aria-label="Back" className="tap-target focus-ring" type="button" onClick={() => router.back()}>
            <span className="icon" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <div className="eyebrow" style={{ margin: 0 }}>
            Exercise
          </div>
          <button aria-label="Bookmark" className="tap-target focus-ring" type="button">
            <span className="icon" aria-hidden="true">
              bookmark
            </span>
          </button>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <Card className="exercise-detail-hero">
            <img className="exercise-detail-hero__image" src={definition.heroImage ?? definition.thumbnail ?? "/exercise-placeholder.svg"} alt={definition.name} />
            <div className="exercise-detail-hero__fade" />
            <div className="exercise-detail-hero__content">
              <div className="pill" style={{ minHeight: 24, padding: "0 10px", background: "rgba(37,37,37,0.92)" }}>
                {definition.equipment.toUpperCase()}
              </div>
              <h1 className="headline-lg" style={{ marginTop: 10, textTransform: "uppercase" }}>
                {definition.name}
              </h1>
              <div className="body-md" style={{ marginTop: 8, color: "#b6ff00" }}>
                {definition.primaryMuscles.map((muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1)).join(" + ")}
                <span style={{ color: "#999" }}> · </span>
                {definition.secondaryMuscles.map((muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1)).join(" + ")}
              </div>
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Muscles Worked
          </div>
          <Card className="workout-library-subcard">
            <div className="caption" style={{ marginBottom: 12 }}>
              CoachX keeps the muscle map semantic. This exercise targets glute extension with hamstring support.
            </div>
            <div className="stack">
              {[
                definition.primaryMuscles.map((muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1)).join(" + "),
                definition.secondaryMuscles.map((muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1)).join(" + "),
                "Adductors"
              ].map((muscle, index) => (
                <div key={muscle} className="row" style={{ justifyContent: "flex-start", gap: 10, color: index === 0 ? "#b6ff00" : "#e4e2e1" }}>
                  <span className={`icon ${index === 0 ? "filled" : ""}`} aria-hidden="true" style={{ fontSize: 14 }}>
                    fiber_manual_record
                  </span>
                  <span>{muscle}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            How To Do It
          </div>
          <Card className="workout-library-subcard">
            <div className="eyebrow" style={{ marginBottom: 10, color: "#b6ff00" }}>
              Setup
            </div>
            <ul className="workout-list">
              {definition.setup.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="workout-divider" />
            <ol className="workout-steps">
              {definition.howToDo.map((step, index) => (
                <li key={step}>
                  <span className="workout-step-number">{String(index + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </section>

        <section className="grid-2 section">
          <Card className="workout-cue-card">
            <div className="eyebrow" style={{ color: "#b6ff00" }}>
              Coach Cues
            </div>
            <div className="stack" style={{ marginTop: 12 }}>
              {definition.coachCues.map((cue) => (
                <div key={cue} className="body-md">
                  • {cue}
                </div>
              ))}
            </div>
          </Card>
          <Card className="workout-cue-card" style={{ borderColor: "#543232" }}>
            <div className="eyebrow" style={{ color: "#ffb4ab" }}>
              Avoid
            </div>
            <div className="stack" style={{ marginTop: 12 }}>
              {definition.commonMistakes.map((mistake) => (
                <div key={mistake} className="body-md">
                  • {mistake}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Your Program
          </div>
          <Card className="workout-program-card">
            <div className="grid-3">
              <div>
                <div className="eyebrow">Sets × Reps</div>
                <div className="headline-md" style={{ marginTop: 8 }}>
                  {definition.programSets} × {definition.programReps}
                </div>
              </div>
              <div>
                <div className="eyebrow">RIR</div>
                <div className="headline-md" style={{ marginTop: 8 }}>
                  {definition.programRir}
                </div>
              </div>
              <div>
                <div className="eyebrow">Rest</div>
                <div className="headline-md" style={{ marginTop: 8 }}>
                  {Math.round(definition.restSeconds / 60)}:{String(definition.restSeconds % 60).padStart(2, "0")}
                </div>
              </div>
            </div>
            <div className="workout-mini-panel" style={{ marginTop: 14 }}>
              <div className="caption">Last session:</div>
              <div className="body-md" style={{ marginTop: 6 }}>
                {definition.lastPerformance}
              </div>
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Progression Target
          </div>
          <Card className="workout-library-subcard">
            <div className="body-md">{definition.progressionTarget}</div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Alternatives
          </div>
          <div className="stack">
            {definition.alternatives.map((alternativeId) => {
              const alternative = getExerciseDefinition(alternativeId);
              return (
                <Card key={alternative.id} className="library-item library-item--compact">
                  <div className="library-item__thumb">
                    <img src={alternative.thumbnail ?? alternative.heroImage ?? "/exercise-placeholder.svg"} alt={alternative.name} />
                  </div>
                  <div className="library-item__body">
                    <div className="body-md" style={{ fontWeight: 700 }}>
                      {alternative.name}
                    </div>
                    <div className="caption" style={{ marginTop: 6, color: "#b6ff00" }}>
                      {alternative.equipment.toUpperCase()}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="sticky-action">
          <Link className="button-primary focus-ring" href={fromWorkout ? `/workout/${session.id}/exercise/${session.exercises[0].id}` : "/exercises"}>
            {fromWorkout ? "Back to Workout" : "Back to Library"}
          </Link>
        </div>
      </main>
    </Screen>
  );
}
