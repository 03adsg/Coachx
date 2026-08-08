import Link from "next/link";
import { Screen } from "@/components/screen";
import { AnatomyPreview } from "@/components/anatomy-preview";
import { Card, PrimaryButton, Section } from "@/components/ui";
import { coachxDemoState, coachxToday } from "@/lib/coachx-data";

export default function DayDetailPage() {
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
                {coachxDemoState.athlete.name}
              </div>
              <h1 className="headline-lg">{coachxToday.dateLabel}</h1>
              <p className="caption" style={{ marginTop: 8 }}>
                {coachxToday.phase} · {coachxToday.workoutTitle}
              </p>
            </div>
            <span className="pill">{coachxToday.duration}</span>
          </div>
        </section>

        <section className="section">
          <Card className="p-16 elevated" style={{ background: "var(--background-charcoal)" }}>
            <div className="row" style={{ marginBottom: 14 }}>
              <div>
                <div className="eyebrow">Workout focus</div>
                <div className="headline-md" style={{ marginTop: 6 }}>
                  {coachxToday.workoutTitle}
                </div>
              </div>
              <span className="accent" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {coachxToday.workoutType}
              </span>
            </div>

            <AnatomyPreview focus={coachxToday.muscleFocus} />

            <div className="grid-3" style={{ marginTop: 16 }}>
              <div>
                <div className="headline-md">{coachxToday.workoutCount}</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  Session volume
                </div>
              </div>
              <div>
                <div className="headline-md">{coachxToday.duration}</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  Total time
                </div>
              </div>
              <div>
                <div className="headline-md">{coachxToday.cardio}</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  Cardio block
                </div>
              </div>
            </div>
          </Card>
        </section>

        <Section title="Workout" meta={coachxToday.primaryTarget}>
          <div className="stack">
            {coachxToday.movements.map((movement) => (
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

        <Section title="Nutrition" meta={coachxToday.calendarLabel}>
          <Card className="p-16">
            <div className="row start">
              <div>
                <div className="eyebrow">Calories</div>
                <div className="headline-md" style={{ marginTop: 6 }}>
                  {coachxToday.nutritionCalories}
                </div>
                <div className="caption" style={{ marginTop: 4 }}>
                  {coachxToday.macros}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="eyebrow">Habits</div>
                <div className="headline-md" style={{ marginTop: 6 }}>
                  {coachxToday.habits}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Link href={`/day/${coachxToday.dateKey}/nutrition`} className="workout-secondary-button focus-ring">
                Open Nutrition
              </Link>
            </div>
          </Card>
        </Section>

        <Section title="Coach insight" meta="Session cues">
          <Card className="p-16">
            <p className="body-md" style={{ color: "var(--text-secondary)" }}>
              {coachxToday.coachInsight}
            </p>
          </Card>
        </Section>

        <div className="stack">
          <PrimaryButton href={`/workout/${coachxDemoState.workoutSession.id}`} className="focus-ring">
            Start Workout
          </PrimaryButton>
          <Link href="/calendar" className="workout-secondary-button focus-ring">
            Back to Calendar
          </Link>
        </div>
      </main>
    </Screen>
  );
}
