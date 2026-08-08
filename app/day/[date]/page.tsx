import Link from "next/link";
import { coachxToday } from "@/lib/coachx-data";
import { Card, IconButton, PrimaryButton, SecondaryButton } from "@/components/ui";
import { Screen } from "@/components/screen";

export default async function DayDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  return (
    <Screen
      shellClassName="screen-shell"
      topbar={
        <header className="topbar">
          <Link href="/" className="tap-target focus-ring" aria-label="Back to today">
            <span className="icon" aria-hidden="true">
              arrow_back
            </span>
          </Link>
          <div className="eyebrow" style={{ margin: 0 }}>
            Saturday August 8
          </div>
          <IconButton icon="more_horiz" label="More options" />
        </header>
      }
    >
      <main className="content tight">
        <section className="section" style={{ textAlign: "center" }}>
          <span className="pill">{coachxToday.phase}</span>
          <h1 className="headline-xl" style={{ marginTop: 14, textTransform: "uppercase" }}>
            Glutes + Hamstrings
          </h1>
          <div
            className="card"
            style={{
              marginTop: 16,
              padding: 20,
              borderRadius: 24,
              background: "#080808",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <img
              src={coachxToday.image}
              alt={`Anatomical training illustration for ${date}`}
              width={320}
              height={320}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="eyebrow">Today's Workout</div>
            <h2 className="headline-md" style={{ marginTop: 4 }}>
              Workout A
            </h2>
            <p className="caption" style={{ marginTop: 6 }}>
              6 exercises | 68 min | Hypertrophy
            </p>

            <div className="stack" style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border-quiet)" }}>
              {[
                ["01", "Hip Thrust", "4 x 8-10"],
                ["02", "Romanian Deadlift", "3 x 8-10"],
                ["03", "Bulgarian Split Squat", "3 x 10-12"]
              ].map(([index, name, prescription]) => (
                <div key={name} className="row" style={{ alignItems: "center" }}>
                  <span className="muted" style={{ width: 32, fontSize: 14, fontWeight: 700 }}>
                    {index}
                  </span>
                  <span className="body-md" style={{ flex: 1 }}>
                    {name}
                  </span>
                  <span className="muted">{prescription}</span>
                </div>
              ))}
              <div className="body-md muted" style={{ paddingTop: 4 }}>
                +3 exercises
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <PrimaryButton href="/" className="focus-ring">
                Start Workout
              </PrimaryButton>
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="eyebrow">Today's Nutrition</div>
            <div className="row start" style={{ marginTop: 8, alignItems: "baseline" }}>
              <div className="hero-number">2,050</div>
              <div className="eyebrow" style={{ margin: 0 }}>
                kcal
              </div>
            </div>

            <div className="grid-3" style={{ marginTop: 16 }}>
              {[
                ["140g", "Protein"],
                ["220g", "Carbs"],
                ["60g", "Fat"]
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="headline-md" style={{ fontSize: 20 }}>
                    {value}
                  </div>
                  <div className="eyebrow" style={{ marginTop: 4 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="row" style={{ justifyContent: "flex-start", gap: 16, marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-quiet)" }}>
              <span className="accent" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span className="icon filled" style={{ fontSize: 16 }} aria-hidden="true">
                  check_circle
                </span>
                Breakfast
              </span>
              <span className="accent" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span className="icon filled" style={{ fontSize: 16 }} aria-hidden="true">
                  check_circle
                </span>
                Lunch
              </span>
              <span className="muted" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span className="icon" style={{ fontSize: 16 }} aria-hidden="true">
                  radio_button_unchecked
                </span>
                Snack
              </span>
              <span className="muted" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span className="icon" style={{ fontSize: 16 }} aria-hidden="true">
                  radio_button_unchecked
                </span>
                Dinner
              </span>
            </div>

            <div style={{ marginTop: 16, width: "100%" }}>
              <SecondaryButton className="focus-ring" style={{ width: "100%" }}>
                View Nutrition
              </SecondaryButton>
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="row">
              <div>
                <div className="eyebrow">Cardio</div>
                <div className="headline-md" style={{ marginTop: 8 }}>
                  Zone 2
                  <span className="body-md muted" style={{ marginLeft: 8 }}>
                    20 min
                  </span>
                </div>
                <p className="caption" style={{ marginTop: 6 }}>
                  Target HR: 114-133 bpm
                </p>
                <p className="caption" style={{ marginTop: 4 }}>
                  Status: Not completed
                </p>
              </div>
              <SecondaryButton className="focus-ring">Start Cardio</SecondaryButton>
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="row" style={{ marginBottom: 16 }}>
              <div className="eyebrow" style={{ margin: 0 }}>
                Daily Habits
              </div>
              <div className="muted" style={{ fontSize: 14 }}>
                2/5 completed
              </div>
            </div>
            <div className="stack">
              {[
                ["Water", "1.7/2.5 L"],
                ["Steps", "8,400/10,000"],
                ["Creatine", "done"],
                ["Meditation", "pending"],
                ["Reading", "pending"]
              ].map(([label, value]) => (
                <div key={label} className="row">
                  <span className="body-md">{label}</span>
                  <span className={value === "done" ? "accent" : "muted"}>{value === "done" ? "check_circle" : value}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="elevated p-16">
            <div className="row start">
              <span className="icon accent" aria-hidden="true" style={{ fontSize: 20 }}>
                psychology
              </span>
              <p className="body-md muted" style={{ margin: 0, flex: 1 }}>
                {coachxToday.coachInsight}
              </p>
            </div>
          </Card>
        </section>
      </main>
    </Screen>
  );
}
