"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnatomyPreview } from "@/components/anatomy-preview";
import { useProfileSettingsStore } from "@/components/profile-settings-provider";
import { useProgramStore } from "@/components/program-provider";
import { Screen } from "@/components/screen";
import { Card, IconButton, PrimaryButton, Section, StatTile } from "@/components/ui";
import type { ProgramDaySummary } from "@/lib/program-service";

function RestDayHero({ athleteName, day }: { athleteName: string; day: ProgramDaySummary }) {
  return (
    <>
      <section className="section">
        <div className="eyebrow" style={{ color: "#b6ff00" }}>
          Rest Day
        </div>
        <h1 className="headline-xl">Recovery Day</h1>
        <p className="body-lg muted" style={{ marginTop: 12 }}>
          {athleteName} · {day.dateLabel}
        </p>
      </section>

      <Section title="Next Workout" meta={day.phase}>
        <Card className="p-16 elevated" style={{ background: "var(--background-charcoal)" }}>
          <div className="row start" style={{ marginBottom: 16 }}>
            <div>
              <span className="pill">Ready tomorrow</span>
              <h2 className="headline-md" style={{ marginTop: 14 }}>
                {day.workoutTitle}
              </h2>
              <p className="caption" style={{ marginTop: 6 }}>
                {day.workoutType}
              </p>
            </div>
            <button aria-label="Open workout" className="tap-target focus-ring" type="button" style={{ background: "var(--accent-primary)", borderRadius: 9999 }}>
              <span className="icon filled" style={{ color: "var(--background-deep)" }} aria-hidden="true">
                play_arrow
              </span>
            </button>
          </div>
          <div className="grid-3">
            <StatTile label="Duration" value={day.duration} />
            <StatTile label="Calories" value={day.nutritionCalories} />
            <StatTile label="Cardio" value={day.cardio} />
          </div>
        </Card>
      </Section>
    </>
  );
}

function TodayContent() {
  const searchParams = useSearchParams();
  const { saved } = useProfileSettingsStore();
  const { getDaySummary, selectedDateKey } = useProgramStore();
  const isRestDay = searchParams.get("state") === "rest-day";
  const athleteName = saved.profile.name;
  const activeDateKey = selectedDateKey ?? "2026-08-08";
  const day = getDaySummary(activeDateKey) ?? getDaySummary("2026-08-08");

  if (!day) {
    return null;
  }

  return (
    <Screen
      activeTab="today"
      topbar={
        <header className="topbar">
          <IconButton icon="menu" label="Open menu" />
          <div className="brand">COACHX</div>
          <Link href="/profile" aria-label="Open profile" className="profile-avatar focus-ring">
            <img src="/coachx-avatar.svg" alt="Athlete profile" width={52} height={52} />
          </Link>
        </header>
      }
    >
      <main className="content">
        {isRestDay ? (
          <RestDayHero athleteName={athleteName} day={day} />
        ) : (
          <>
            <section className="section">
              <h1 className="headline-xl">{day.workoutTitle}</h1>
              <p className="body-lg muted" style={{ marginTop: 12 }}>
                {athleteName} · {day.dateLabel}
              </p>
            </section>

            <Section title="" meta="">
              <Card className="p-16">
                <div className="row start" style={{ marginBottom: 16 }}>
                  <div>
                    <span className="pill">{day.phase}</span>
                    <h2 className="headline-md" style={{ marginTop: 14 }}>
                      {day.workoutTitle}
                    </h2>
                    <p className="caption" style={{ marginTop: 6 }}>
                      {day.workoutType}
                    </p>
                  </div>
                  <button aria-label="Start workout" className="tap-target focus-ring" type="button" style={{ background: "var(--accent-primary)", borderRadius: 9999 }}>
                    <span className="icon filled" style={{ color: "var(--background-deep)" }} aria-hidden="true">
                      play_arrow
                    </span>
                  </button>
                </div>

                <div className="grid-3">
                  <StatTile label="Duration" value={day.duration} />
                  <StatTile label="Volume" value={day.volume} />
                  <StatTile label="Sets" value={day.sets} />
                </div>
              </Card>
            </Section>

            <Section title="Target Zones">
              <Card className="p-16 elevated" style={{ background: "var(--background-charcoal)" }}>
                <AnatomyPreview focus={day.muscleFocus} />
                <div className="grid-2" style={{ marginTop: 16 }}>
                  <div>
                    <div className="eyebrow">Primary</div>
                    <div className="body-lg" style={{ marginTop: 4 }}>
                      {day.primaryTarget}
                    </div>
                  </div>
                  <div>
                    <div className="eyebrow">Secondary</div>
                    <div className="body-lg" style={{ marginTop: 4 }}>
                      {day.secondaryTarget}
                    </div>
                  </div>
                </div>
              </Card>
            </Section>

            <Section title="Movements" meta={day.workoutCount}>
              <div className="stack">
                {day.movements.map((movement) => (
                  <Link key={movement.name} href={`/day/${day.dateKey}`} className="list-card focus-ring">
                    {movement.thumbnail ? (
                      <img className="exercise-thumb" src={movement.thumbnail} alt={movement.name} width={48} height={48} />
                    ) : (
                      <div className="exercise-thumb" style={{ display: "grid", placeItems: "center", background: "#1f1f1f" }}>
                        <span className="icon muted" aria-hidden="true" style={{ fontSize: 20 }}>
                          {movement.icon}
                        </span>
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div className="body-md" style={{ fontWeight: 700 }}>
                        {movement.name}
                      </div>
                      <div className="caption">{movement.prescription}</div>
                    </div>
                    <span className="icon muted" aria-hidden="true">
                      chevron_right
                    </span>
                  </Link>
                ))}
              </div>
            </Section>
          </>
        )}

        <div className="page-cta">
          <PrimaryButton href={`/workout/${day.scheduledWorkoutId}`} className="focus-ring">
            {isRestDay ? "View Workout" : "Start Workout"}
          </PrimaryButton>
        </div>
      </main>
    </Screen>
  );
}

export default function TodayPage() {
  return (
    <Suspense fallback={null}>
      <TodayContent />
    </Suspense>
  );
}
