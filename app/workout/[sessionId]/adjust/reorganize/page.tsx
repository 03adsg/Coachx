"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useProgramStore } from "@/components/program-provider";
import { useWorkoutStore } from "@/components/workout-provider";

function getNextTuesday(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  const targetDay = 2;
  const currentDay = date.getUTCDay();
  let daysUntilTuesday = (targetDay - currentDay + 7) % 7;

  if (daysUntilTuesday === 0) {
    daysUntilTuesday = 7;
  }

  date.setUTCDate(date.getUTCDate() + daysUntilTuesday);
  return date.toISOString().slice(0, 10);
}

export default function ReorganizeWeekPage() {
  const router = useRouter();
  const { session } = useWorkoutStore();
  const { rescheduleWorkoutDay } = useProgramStore();
  const [saving, setSaving] = useState(false);
  const nextDate = getNextTuesday("2026-08-08");

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
          <h1 className="headline-lg" style={{ textTransform: "uppercase" }}>
            Reorganize My Week
          </h1>
          <p className="body-lg" style={{ marginTop: 10, color: "var(--text-secondary)" }}>
            AthlexForce will find the best way to preserve your training priorities and recovery.
          </p>
        </section>

        <section className="section">
          <Card className="workout-reorg-card">
            <div className="eyebrow">Before</div>
            <div className="workout-reorg-grid">
              {["Sat", "Sun", "Mon", "Tue"].map((day, index) => (
                <div key={day} className={`workout-day-tile ${index === 0 ? "active" : ""}`}>
                  <div className="body-md" style={{ fontWeight: 700 }}>
                    {day.toUpperCase()}
                  </div>
                  <div className="caption">{index === 0 ? "Glutes" : index % 2 === 0 ? "Upper" : "Recov."}</div>
                </div>
              ))}
            </div>
            <div className="workout-divider" />
            <div className="eyebrow">After</div>
            <div className="workout-reorg-grid">
              {["Sat", "Sun", "Mon", "Tue"].map((day, index) => (
                <div key={day} className={`workout-day-tile ${index === 3 ? "active" : ""}`}>
                  <div className="body-md" style={{ fontWeight: 700 }}>
                    {day.toUpperCase()}
                  </div>
                  <div className="caption">{index === 3 ? "Glutes" : index === 1 ? "Upper" : "Recov."}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="workout-reorg-logic">
            <div className="eyebrow" style={{ color: "#b6ff00" }}>
              AthlexForce Logic
            </div>
            <p className="body-md" style={{ marginTop: 10, color: "var(--text-secondary)" }}>
              Move this session to Tuesday to preserve 48+ hours between lower-body workouts.
            </p>
          </Card>
        </section>

        <section className="grid-2 section">
          <Card className="workout-stat-card">
            <div className="eyebrow">Moved</div>
            <div className="headline-md" style={{ marginTop: 8 }}>
              2 sessions
            </div>
          </Card>
          <Card className="workout-stat-card">
            <div className="eyebrow">Removed</div>
            <div className="headline-md" style={{ marginTop: 8 }}>
              0 sessions
            </div>
          </Card>
          <Card className="workout-stat-card">
            <div className="eyebrow">Weekly Freq.</div>
            <div className="headline-md" style={{ marginTop: 8 }}>
              4 workouts
            </div>
          </Card>
          <Card className="workout-stat-card">
            <div className="eyebrow">Recovery</div>
            <div className="headline-md" style={{ marginTop: 8 }}>
              Maintained
            </div>
          </Card>
        </section>

        <div className="sticky-action stack">
          <button
            className="button-primary focus-ring"
            disabled={saving}
            type="button"
            onClick={async () => {
              setSaving(true);
              try {
                await rescheduleWorkoutDay(session.id, nextDate);
                router.push(`/workout/${session.id}/adjust/updated`);
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving..." : "Use This Schedule ✓"}
          </button>
          <Link className="workout-secondary-button focus-ring" href={`/workout/${session.id}/adjust`}>
            Choose Another Day
          </Link>
        </div>
      </main>
    </Screen>
  );
}
