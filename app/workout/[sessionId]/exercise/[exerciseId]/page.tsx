"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useWorkoutStore } from "@/components/workout-provider";
import { getExerciseDefinition, getWorkoutExercise } from "@/lib/workout-data";

export default function ActiveExercisePage() {
  const params = useParams<{ sessionId: string; exerciseId: string }>();
  const router = useRouter();
  const exerciseId = params?.exerciseId ?? "hip-thrust";
  const { session, updateSetDraft, completeSet, skipRestTimer, addThirtySeconds } = useWorkoutStore();
  const exercise = getWorkoutExercise(session, exerciseId);
  const definition = getExerciseDefinition(exercise.performedExerciseId);
  const currentSet = exercise.sets.find((set) => !set.completed) ?? exercise.sets[exercise.sets.length - 1];
  const completedCount = exercise.completedSets.length;
  const progressLabel = `${exercise.order} / ${session.totalExercises}`;
  const isFinalSet = currentSet.setNumber >= exercise.totalSets;

  const handleComplete = () => {
    completeSet(exercise.id, currentSet.setNumber, {
      kilograms: currentSet.kilograms,
      reps: currentSet.reps,
      rir: currentSet.rir
    });

    if (completedCount + 1 >= exercise.totalSets) {
      router.push(`/workout/${session.id}/summary`);
    }
  };

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="workout-active-topbar">
          <button aria-label="Close workout" className="tap-target focus-ring" type="button" onClick={() => router.push(`/workout/${session.id}`)}>
            <span className="icon" aria-hidden="true">
              close
            </span>
          </button>
          <div className="workout-active-topbar__title">EXERCISE {progressLabel}</div>
          <button aria-label="More options" className="tap-target focus-ring" type="button">
            <span className="icon" aria-hidden="true">
              more_vert
            </span>
          </button>
        </header>
      }
    >
      <main className="content tight">
        <div className="workout-progress-bar">
          <div className="workout-progress-bar__fill" style={{ width: `${(exercise.order / session.totalExercises) * 100}%` }} />
        </div>

        <section className="section">
          <Card className="workout-hero-card">
            <div className="row start">
              <div>
                <div className="eyebrow" style={{ color: "#c6c6c7", marginBottom: 8 }}>
                  {definition.label}
                </div>
                <h1 className="headline-lg" style={{ textTransform: "uppercase" }}>
                  {definition.name}
                </h1>
                <p className="body-md muted" style={{ marginTop: 8 }}>
                  Primary: {definition.primaryMuscles[0] === "glutes" ? "Glutes" : definition.primaryMuscles[0] === "back" ? "Back" : "Chest"} · Secondary: {definition.secondaryMuscles[0] === "hamstrings" ? "Hamstrings" : definition.secondaryMuscles[0]}
                </p>
              </div>
              <button aria-label="Preview exercise" className="workout-play-button" type="button">
                <span className="icon" aria-hidden="true">
                  play_arrow
                </span>
              </button>
            </div>
          </Card>
        </section>

        <section className="grid-3 section">
          <Card className="workout-stat-card">
            <div className="headline-md">{definition.programSets}</div>
            <div className="eyebrow" style={{ marginTop: 4 }}>
              Sets
            </div>
          </Card>
          <Card className="workout-stat-card">
            <div className="headline-md">{definition.programReps}</div>
            <div className="eyebrow" style={{ marginTop: 4 }}>
              Reps
            </div>
          </Card>
          <Card className="workout-stat-card">
            <div className="headline-md">{definition.restSeconds}</div>
            <div className="eyebrow" style={{ marginTop: 4 }}>
              Sec
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="workout-cue-card">
            <span className="icon accent filled" aria-hidden="true" style={{ fontSize: 22 }}>
              tips_and_updates
            </span>
            <p className="body-md">{definition.coachCues[0]}</p>
          </Card>
        </section>

        <section className="section">
          <Card className="workout-last-session-card">
            <div className="row" style={{ marginBottom: 12 }}>
              <span className="eyebrow" style={{ margin: 0 }}>
                Last Session · July 31
              </span>
              <span className="pill" style={{ minHeight: 24, padding: "0 10px", background: "rgba(182,255,0,0.12)" }}>
                {definition.lastPerformance.split(" | ")[0]}
              </span>
            </div>
            <div className="headline-md" style={{ fontSize: 20 }}>
              {definition.lastPerformance.split(" | ")[1]} <span className="caption">reps</span>
            </div>
            <div className="caption" style={{ marginTop: 12, borderTop: "1px solid #252525", paddingTop: 12, fontStyle: "italic", color: "#8c9479" }}>
              {exercise.suggestedTarget}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Log Sets
          </div>
          <div className="stack">
            {exercise.sets.map((set) => {
              const active = !set.completed && set.setNumber === currentSet.setNumber;
              return (
                <Card key={set.setNumber} className={`workout-set-row ${active ? "active" : ""} ${set.completed ? "completed" : ""}`.trim()}>
                  <div className="workout-set-row__meta">
                    <div className="headline-md" style={{ fontSize: 20 }}>
                      {set.setNumber}
                    </div>
                    <div className="caption">{set.previous}</div>
                  </div>
                  <div className="workout-set-row__inputs">
                    <label>
                      <span className="eyebrow" style={{ marginBottom: 4 }}>
                        Kg
                      </span>
                      <input
                        className="workout-input"
                        inputMode="numeric"
                        type="number"
                        value={set.kilograms}
                        onChange={(event) => updateSetDraft(exercise.id, set.setNumber, { kilograms: event.target.value })}
                      />
                    </label>
                    <label>
                      <span className="eyebrow" style={{ marginBottom: 4 }}>
                        Reps
                      </span>
                      <input
                        className="workout-input"
                        inputMode="numeric"
                        type="number"
                        value={set.reps}
                        onChange={(event) => updateSetDraft(exercise.id, set.setNumber, { reps: event.target.value })}
                      />
                    </label>
                  </div>
                  <button
                    aria-label={`Complete set ${set.setNumber}`}
                    className={`workout-set-button ${set.completed ? "done" : ""}`}
                    type="button"
                    onClick={() => completeSet(exercise.id, set.setNumber, { kilograms: set.kilograms, reps: set.reps, rir: set.rir })}
                  >
                    <span className="icon filled" aria-hidden="true">
                      check
                    </span>
                  </button>
                </Card>
              );
            })}
          </div>
        </section>

        {session.restTimer?.active ? (
          <section className="section">
            <Card className="workout-rest-card elevated">
              <div className="row" style={{ marginBottom: 12 }}>
                <div>
                  <div className="eyebrow">Rest timer</div>
                  <div className="headline-md" style={{ marginTop: 6 }}>
                    {session.restTimer.secondsRemaining}s
                  </div>
                </div>
                <div className="pill">Next set</div>
              </div>
              <div className="row">
                <button className="workout-secondary-button focus-ring" type="button" onClick={() => addThirtySeconds()}>
                  +30 SEC
                </button>
                <button className="workout-secondary-button focus-ring" type="button" onClick={() => skipRestTimer()}>
                  Skip
                </button>
              </div>
            </Card>
          </section>
        ) : null}

        <div className="stack">
          <Link className="workout-secondary-button focus-ring" href={`/workout/${session.id}/exercise/${exercise.id}/alternatives`}>
            <span className="icon" aria-hidden="true">
              swap_horiz
            </span>
            Alternatives
          </Link>
          <Link className="workout-secondary-button focus-ring" href={`/workout/${session.id}/exercise/${exercise.id}/safety`}>
            <span className="icon" aria-hidden="true">
              report
            </span>
            Pain / Discomfort
          </Link>
        </div>

        <div className="sticky-action">
          <button className="button-primary focus-ring" type="button" onClick={handleComplete}>
            {isFinalSet || completedCount >= exercise.totalSets ? "Finish Workout" : "Complete Set"}
          </button>
        </div>
      </main>
    </Screen>
  );
}
