"use client";

import Link from "next/link";
import { Screen } from "@/components/screen";
import { Card, PrimaryButton } from "@/components/ui";
import { useWorkoutStore } from "@/components/workout-provider";
import { countCompletedExercises, getExerciseDefinition } from "@/lib/workout-data";

export default function WorkoutOverviewPage() {
  const { session } = useWorkoutStore();

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="topbar workout-overview-topbar">
          <Link aria-label="Go back" className="tap-target focus-ring" href="/day/2026-08-08">
            <span className="icon" aria-hidden="true">
              arrow_back
            </span>
          </Link>
          <div className="headline-md" style={{ fontSize: 18, lineHeight: "24px", fontWeight: 700 }}>
            Workout Session
          </div>
          <button aria-label="More options" className="tap-target focus-ring" type="button">
            <span className="icon" aria-hidden="true">
              more_vert
            </span>
          </button>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <div className="eyebrow" style={{ color: "#9fb15e" }}>
            {session.workoutType}
          </div>
          <h1 className="headline-xl" style={{ textTransform: "uppercase" }}>
            {session.phaseLabel}
          </h1>
          <p className="caption" style={{ marginTop: 6 }}>
            {session.subtitle}
          </p>
        </section>

        <section className="section">
          <div className="row" style={{ marginBottom: 8 }}>
            <div className="eyebrow" style={{ margin: 0 }}>
              {countCompletedExercises(session)} / {session.totalExercises} exercises completed
            </div>
          </div>
          <div className="progress-track" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: `${(countCompletedExercises(session) / session.totalExercises) * 100}%` }} />
          </div>
          <div className="caption" style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="icon" style={{ fontSize: 16 }}>
              history
            </span>
            <span>{session.lastSessionLabel}</span>
          </div>
        </section>

        <section className="stack-lg">
          {session.exercises.map((exercise, index) => {
            const definition = getExerciseDefinition(exercise.performedExerciseId);
            const heroImage = definition.heroImage ?? definition.thumbnail ?? "/coachx-icon.svg";
            const equipment = definition.label;

            return (
              <Card key={exercise.id} className="workout-overview-card">
                <div className="workout-overview-card__media">
                  <img alt={`${definition.name} demo`} className="workout-overview-card__image" src={heroImage} />
                  <div className="workout-overview-card__fade" />
                  <div className="workout-overview-card__content">
                    <div className="workout-overview-card__number">{String(index + 1).padStart(2, "0")}</div>
                    <div>
                      <div className="headline-md" style={{ textTransform: "uppercase" }}>
                        {definition.name}
                      </div>
                      <div className="pill" style={{ minHeight: 24, marginTop: 8, padding: "0 10px", background: "rgba(37,37,37,0.9)" }}>
                        {equipment}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-16" style={{ display: "grid", gap: 12 }}>
                  <div className="row">
                    <span className="caption">Prescription:</span>
                    <span className="body-md" style={{ fontWeight: 700 }}>
                      {definition.programSets} x {definition.programReps} <span className="caption" style={{ marginLeft: 8 }}>{definition.programRir === "1-2" ? "RIR: 1-2" : `RIR: ${definition.programRir}`}</span>
                    </span>
                  </div>
                  <div className="workout-mini-panel">
                    <div className="row" style={{ marginBottom: 4 }}>
                      <span className="eyebrow" style={{ margin: 0 }}>
                        Last Session
                      </span>
                      <span className="pill" style={{ minHeight: 24, padding: "0 10px", background: "rgba(182,255,0,0.12)" }}>
                        Ready to Progress
                      </span>
                    </div>
                    <div className="body-md">{exercise.lastComparableSession}</div>
                  </div>
                  <Link className="workout-secondary-button focus-ring" href={`/workout/${session.id}/exercise/${exercise.id}`}>
                    <span className="icon" aria-hidden="true">
                      swap_horiz
                    </span>
                    Swap
                  </Link>
                </div>
              </Card>
            );
          })}
        </section>

        <div className="sticky-action">
          <PrimaryButton href={`/workout/${session.id}/exercise/${session.exercises[0].id}`}>Start Session</PrimaryButton>
        </div>
      </main>
    </Screen>
  );
}
