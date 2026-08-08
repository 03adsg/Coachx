import Link from "next/link";
import { coachxDemoState, coachxToday } from "@/lib/coachx-data";
import { Screen } from "@/components/screen";
import { Card, IconButton, PrimaryButton, Section, StatTile } from "@/components/ui";
import { AnatomyPreview } from "@/components/anatomy-preview";

export default function TodayPage() {
  return (
    <Screen
      activeTab="today"
      topbar={
        <header className="topbar">
          <IconButton icon="menu" label="Open menu" />
          <div className="brand">COACHX</div>
          <Link href="/profile" aria-label="Open profile" className="profile-avatar focus-ring">
            <img
              src="/coachx-avatar.svg"
              alt="Athlete profile"
              width={52}
              height={52}
            />
          </Link>
        </header>
      }
    >
      <main className="content">
        <section className="section">
          <h1 className="headline-xl">{coachxToday.workoutTitle}</h1>
          <p className="body-lg muted" style={{ marginTop: 12 }}>
            {coachxDemoState.athlete.name} · {coachxToday.dateLabel}
          </p>
        </section>

        <Section title="" meta="">
          <Card className="p-16">
            <div className="row start" style={{ marginBottom: 16 }}>
              <div>
                <span className="pill">{coachxToday.phase}</span>
                <h2 className="headline-md" style={{ marginTop: 14 }}>
                  {coachxToday.workoutTitle}
                </h2>
                <p className="caption" style={{ marginTop: 6 }}>
                  {coachxToday.workoutType}
                </p>
              </div>
              <button aria-label="Start workout" className="tap-target focus-ring" type="button" style={{ background: "var(--accent-primary)", borderRadius: 9999 }}>
                <span className="icon filled" style={{ color: "var(--background-deep)" }} aria-hidden="true">
                  play_arrow
                </span>
              </button>
            </div>

            <div className="grid-3">
              <StatTile label="Duration" value={coachxToday.duration} />
              <StatTile label="Volume" value={coachxToday.volume} />
              <StatTile label="Sets" value={coachxToday.sets} />
            </div>
          </Card>
        </Section>

        <Section title="Target Zones">
          <Card className="p-16 elevated" style={{ background: "var(--background-charcoal)" }}>
            <AnatomyPreview focus={coachxToday.muscleFocus} />
            <div className="grid-2" style={{ marginTop: 16 }}>
              <div>
                <div className="eyebrow">Primary</div>
                <div className="body-lg" style={{ marginTop: 4 }}>
                  {coachxToday.primaryTarget}
                </div>
              </div>
              <div>
                <div className="eyebrow">Secondary</div>
                <div className="body-lg" style={{ marginTop: 4 }}>
                  {coachxToday.secondaryTarget}
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <Section title="Movements" meta="6 exercises">
          <div className="stack">
            {coachxToday.movements.map((movement) => (
              <Link key={movement.name} href="/day/2026-08-08" className="list-card focus-ring">
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

        <div className="sticky-action">
          <PrimaryButton href="/day/2026-08-08" className="focus-ring">
            Start Workout
          </PrimaryButton>
        </div>
      </main>
    </Screen>
  );
}
