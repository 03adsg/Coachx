"use client";

import Link from "next/link";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { AnatomyPreview } from "@/components/anatomy-preview";
import { useWorkoutStore } from "@/components/workout-provider";
import { coachxDemoState } from "@/lib/coachx-data";
import { getExerciseDefinition } from "@/lib/workout-data";

export default function WorkoutSummaryPage() {
  const { session } = useWorkoutStore();
  const focusExercise = getExerciseDefinition(session.exercises[0].performedExerciseId);

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="workout-summary-topbar">
          <span className="eyebrow" style={{ margin: 0 }}>
            COACHX
          </span>
        </header>
      }
    >
      <main className="content tight">
        <section className="section workout-summary-hero">
          <div className="workout-summary-hero__icon">
            <span className="icon filled" aria-hidden="true">
              check_circle
            </span>
          </div>
          <h1 className="headline-lg" style={{ textTransform: "uppercase" }}>
            Workout Complete
          </h1>
          <p className="body-lg" style={{ color: "var(--text-secondary)" }}>
            {session.workoutLabel} · {session.phaseLabel}
          </p>
          <p className="caption" style={{ marginTop: 8 }}>
            {session.dateLabel.replace(/,/, " ·")} · {session.totalExercises} / {session.totalExercises} exercises completed
          </p>
        </section>

        <section className="grid-2 section">
          {[
            ["Duration", session.summary.duration],
            ["Exercises", session.summary.exercisesCompleted],
            ["Working Sets", session.summary.setsCompleted],
            ["Total Volume", session.summary.totalVolume]
          ].map(([label, value]) => (
            <Card key={label} className="workout-summary-tile">
              <div className="eyebrow" style={{ margin: 0 }}>
                {label}
              </div>
              <div className="headline-md" style={{ marginTop: 8 }}>
                {value}
              </div>
            </Card>
          ))}
        </section>

        <section className="section">
          <Card className="workout-insight-card elevated">
            <div className="row start">
              <span className="icon accent filled" aria-hidden="true">
                tips_and_updates
              </span>
              <div>
                <div className="eyebrow" style={{ color: "#b6ff00" }}>
                  CoachX Insight
                </div>
                <p className="body-md" style={{ color: "var(--text-primary)", marginTop: 6 }}>
                  {session.summary.insight}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Today&apos;s Focus
          </div>
          <Card className="workout-focus-card">
            <AnatomyPreview focus={coachxDemoState.day.muscleFocus} />
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Today&apos;s Performance
          </div>
          <Card className="workout-performance-card">
            <div className="row">
              <div>
                <div className="workout-status-pill workout-status-pill--match">New Best</div>
                <div className="headline-md" style={{ marginTop: 10 }}>
                  {focusExercise.name}
                </div>
              </div>
              <div className="headline-md" style={{ textAlign: "right" }}>
                85 kg × 10
              </div>
            </div>
            <div className="workout-divider" />
            <div className="stack">
              {["Hip Thrust — 80 → 85 kg (+5 kg)", "Romanian Deadlift — 30 kg | Target completed", "Bulgarian Split Squat — +2 reps vs last session"].map((item) => (
                <div key={item} className="caption" style={{ color: "var(--text-primary)" }}>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="workout-next-card">
            <div className="eyebrow">Next Time</div>
            <div className="stack" style={{ marginTop: 12 }}>
              {session.summary.nextTime.map((item) => (
                <div key={item.label} className="workout-next-card__item">
                  <div className="body-md" style={{ fontWeight: 700 }}>
                    {item.label}
                  </div>
                  <div className="caption">{item.detail}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            How did that session feel?
          </div>
          <div className="workout-chip-row">
            {session.summary.feedback.map((item) => (
              <button key={item} className={`workout-filter-chip ${item === "Good" ? "active" : ""}`} type="button">
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <Card className="workout-week-card">
            <div className="row">
              <div>
                <div className="eyebrow">This Week</div>
                <div className="body-md" style={{ marginTop: 6 }}>
                  Phase 1 · Week 1 of 8
                </div>
              </div>
              <div className="headline-md">3 / 4</div>
            </div>
            <div className="progress-track" style={{ marginTop: 16 }}>
              <div className="progress-fill" style={{ width: "75%" }} />
            </div>
          </Card>
        </section>

        <div className="stack">
          <Link className="button-primary focus-ring" href="/">
            Done
          </Link>
          <Link className="workout-secondary-button focus-ring" href="/progress">
            View Progress
          </Link>
        </div>
      </main>
    </Screen>
  );
}
