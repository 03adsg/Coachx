"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useWorkoutStore } from "@/components/workout-provider";

export default function ScheduleUpdatedPage() {
  const router = useRouter();
  const { session } = useWorkoutStore();

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="workout-summary-topbar">
          <button aria-label="Back" className="tap-target focus-ring" type="button" onClick={() => router.back()}>
            <span className="icon" aria-hidden="true">
              close
            </span>
          </button>
          <div className="eyebrow" style={{ margin: 0 }}>
            Adjust Session
          </div>
          <span className="tap-target" />
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
            Schedule Updated
          </h1>
          <p className="body-lg" style={{ color: "var(--text-secondary)", marginTop: 8 }}>
            Glutes + Hamstrings moved to Tuesday at 19:00.
          </p>
        </section>

        <section className="section">
          <Card className="workout-updated-card">
            <div className="eyebrow">Updated Plan</div>
            <div className="workout-reorg-grid" style={{ marginTop: 16 }}>
              {[
                ["Sat", "Recov."],
                ["Sun", "Upper"],
                ["Mon", "Recov."],
                ["Tue", "Glutes"]
              ].map(([day, label], index) => (
                <div key={day} className={`workout-day-tile ${index === 3 ? "active" : ""}`}>
                  <div className="body-md" style={{ fontWeight: 700 }}>
                    {day}
                  </div>
                  <div className="caption">{label}</div>
                </div>
              ))}
            </div>
            <div className="workout-divider" />
            <div className="row">
              <div>
                <div className="headline-md">{session.workoutType}</div>
                <div className="caption" style={{ color: "#b6ff00", marginTop: 6 }}>
                  Tuesday, 19:00
                </div>
              </div>
              <span className="icon" aria-hidden="true">
                directions_run
              </span>
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="workout-reorg-logic">
            <div className="row">
              <span className="icon" aria-hidden="true">
                restaurant
              </span>
              <div className="body-lg" style={{ color: "var(--text-secondary)" }}>
                Nutrition updated: Tuesday training day target
              </div>
            </div>
          </Card>
        </section>

        <div className="sticky-action stack">
          <Link className="button-primary focus-ring" href={`/workout/${session.id}`}>
            Done
          </Link>
          <Link className="workout-secondary-button focus-ring" href="/calendar">
            View Calendar
          </Link>
        </div>
      </main>
    </Screen>
  );
}
