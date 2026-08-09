"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AnatomyPreview } from "@/components/anatomy-preview";
import { useProfileSettingsStore } from "@/components/profile-settings-provider";
import { useProgramStore } from "@/components/program-provider";
import { Screen } from "@/components/screen";
import { Card, PrimaryButton, Section } from "@/components/ui";

function resolveDateKey(param: string | string[] | undefined, fallback: string) {
  if (Array.isArray(param)) {
    return param[0] ?? fallback;
  }

  return param ?? fallback;
}

export default function DayDetailPage() {
  const params = useParams<{ date?: string | string[] }>();
  const { saved } = useProfileSettingsStore();
  const { getDaySummary, selectedDateKey } = useProgramStore();
  const dateKey = resolveDateKey(params.date, selectedDateKey ?? "2026-08-08");
  const day = getDaySummary(dateKey);

  if (!day) {
    return null;
  }

  return (
    <Screen
      activeTab="today"
      shellClassName="screen-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            Day Detail
          </div>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <div className="row start">
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>
                {saved.profile.name}
              </div>
              <h1 className="headline-lg">{day.dateLabel}</h1>
              <p className="caption" style={{ marginTop: 8 }}>
                {day.phase} · {day.workoutTitle}
              </p>
            </div>
            <span className="pill">{day.duration}</span>
          </div>
        </section>

        <section className="section">
          <Card className="p-16 elevated" style={{ background: "var(--background-charcoal)" }}>
            <div className="row" style={{ marginBottom: 14 }}>
              <div>
                <div className="eyebrow">Workout focus</div>
                <div className="headline-md" style={{ marginTop: 6 }}>
                  {day.workoutTitle}
                </div>
              </div>
              <span className="accent" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {day.workoutType}
              </span>
            </div>

            <AnatomyPreview focus={day.muscleFocus} />

            <div className="grid-3" style={{ marginTop: 16 }}>
              <div>
                <div className="headline-md">{day.workoutCount}</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  Session volume
                </div>
              </div>
              <div>
                <div className="headline-md">{day.duration}</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  Total time
                </div>
              </div>
              <div>
                <div className="headline-md">{day.cardio}</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  Cardio block
                </div>
              </div>
            </div>
          </Card>
        </section>

        <Section title="Workout" meta={day.primaryTarget}>
          <div className="stack">
            {day.movements.map((movement) => (
              <Card key={movement.name} className="list-card">
                <span className="icon accent filled" aria-hidden="true">
                  {movement.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div className="body-md" style={{ fontWeight: 700 }}>
                    {movement.name}
                  </div>
                  <div className="caption" style={{ marginTop: 4 }}>
                    {movement.prescription}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Nutrition" meta={day.calendarLabel}>
          <Card className="p-16">
            <div className="row start">
              <div>
                <div className="eyebrow">Calories</div>
                <div className="headline-md" style={{ marginTop: 6 }}>
                  {day.nutritionCalories}
                </div>
                <div className="caption" style={{ marginTop: 4 }}>
                  {day.macros}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="eyebrow">Habits</div>
                <div className="headline-md" style={{ marginTop: 6 }}>
                  {day.habits}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Link href={`/day/${day.dateKey}/nutrition`} className="workout-secondary-button focus-ring">
                Open Nutrition
              </Link>
            </div>
          </Card>
        </Section>

        <Section title="Coach insight" meta="Session cues">
          <Card className="p-16">
            <p className="body-md" style={{ color: "var(--text-secondary)" }}>
              {day.coachInsight}
            </p>
          </Card>
        </Section>

        <div className="stack">
          {day.isRestDay ? (
            <PrimaryButton href="/calendar" className="focus-ring">
              Back to Calendar
            </PrimaryButton>
          ) : (
            <PrimaryButton href={`/workout/${day.scheduledWorkoutId}`} className="focus-ring">
              Start Workout
            </PrimaryButton>
          )}
          <Link href="/calendar" className="workout-secondary-button focus-ring">
            Back to Calendar
          </Link>
        </div>
      </main>
    </Screen>
  );
}
