"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useWorkoutStore } from "@/components/workout-provider";
import { getExerciseDefinition } from "@/lib/workout-data";

export default function ShorterSessionPage() {
  const router = useRouter();
  const { session, selectAdjustmentTime } = useWorkoutStore();
  const leadExercise = getExerciseDefinition(session.exercises[0].prescribedExerciseId);

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="workout-section-topbar">
          <button aria-label="Back" className="tap-target focus-ring" type="button" onClick={() => router.back()}>
            <span className="icon" aria-hidden="true">
              close
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
          <div className="headline-lg" style={{ textAlign: "center", textTransform: "uppercase", marginBottom: 20 }}>
            How much time do you have?
          </div>
          <div className="grid-3">
            {(["20 min", "30 min", "45 min"] as const).map((minutes) => (
              <button
                key={minutes}
                className={`workout-time-chip ${minutes === "30 min" ? "selected" : ""}`}
                type="button"
                onClick={() => selectAdjustmentTime(minutes)}
              >
                {minutes.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <Card className="workout-adjust-recommendation">
            <div className="eyebrow" style={{ color: "#b6ff00" }}>
              CoachX 30 Min Version
            </div>
            <p className="body-lg" style={{ marginTop: 12, color: "var(--text-secondary)" }}>
              Lower-priority work is removed while the main training objective stays intact.
            </p>
            <div className="workout-divider" />
            <div className="stack">
              <div className="eyebrow">Keep</div>
              {["Hip Thrust", "Romanian Deadlift", "Leg Curl", "Hip Abduction"].map((item) => (
                <div key={item} className="row">
                  <span className="icon accent filled" aria-hidden="true">
                    check_circle
                  </span>
                  <span className="body-lg">{item}</span>
                </div>
              ))}
              <div className="eyebrow" style={{ marginTop: 12 }}>
                Remove Today
              </div>
              {["Bulgarian Split Squat", "Cable Kickback"].map((item) => (
                <div key={item} className="row muted" style={{ textDecoration: "line-through" }}>
                  <span className="icon" aria-hidden="true">
                    do_not_disturb_on
                  </span>
                  <span className="body-lg">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <div className="sticky-action stack">
          <Link className="button-primary focus-ring" href={`/workout/${session.id}/adjust/updated`}>
            Use 30 Min Version →
          </Link>
          <Link className="workout-secondary-button focus-ring" href={`/workout/${session.id}/adjust/reorganize`}>
            Reschedule Full Workout
          </Link>
        </div>
      </main>
    </Screen>
  );
}
