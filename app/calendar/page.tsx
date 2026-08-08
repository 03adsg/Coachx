import Link from "next/link";
import { coachxCalendarDays } from "@/lib/coachx-data";
import { Screen } from "@/components/screen";
import { Card, IconButton, PrimaryButton, Section } from "@/components/ui";

export default function CalendarPage() {
  return (
    <Screen
      activeTab="calendar"
      shellClassName="screen-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            Calendar
          </div>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <div className="row" style={{ marginBottom: 8 }}>
            <IconButton icon="chevron_left" label="Previous month" />
            <h1 className="headline-md" style={{ textTransform: "uppercase", letterSpacing: "0.03em" }}>
              August 2026
            </h1>
            <IconButton icon="chevron_right" label="Next month" />
          </div>

          <div className="calendar-grid" style={{ marginTop: 24 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="calendar-label" style={{ textAlign: "center" }}>
                {day}
              </div>
            ))}
            {coachxCalendarDays.map((day) => (
              <div
                key={`${day.weekday}-${day.day}`}
                className={`day-cell ${day.isSelected ? "selected" : ""} ${day.isDimmed ? "dimmed" : ""}`.trim()}
              >
                <span className="body-md" style={{ color: day.isToday ? "var(--text-primary)" : "inherit" }}>
                  {day.day}
                </span>
                {day.hasActivity ? <span className="day-dot" aria-hidden="true" /> : null}
                {day.completed ? (
                  <span className="icon filled" aria-hidden="true" style={{ position: "absolute", bottom: 4, fontSize: 12, color: "var(--accent-primary)" }}>
                    check
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <Section title="" meta="">
          <Card className="p-16">
            <div className="row" style={{ marginBottom: 16 }}>
              <div>
                <div className="headline-md" style={{ fontSize: 14, lineHeight: "20px", textTransform: "uppercase" }}>
                  Saturday August 8
                </div>
              </div>
              <span className="accent" style={{ fontSize: 12, lineHeight: "16px", fontWeight: 700, textTransform: "uppercase" }}>
                Training Day
              </span>
            </div>

            <div className="row start" style={{ gap: 16 }}>
              <div
                style={{
                  width: 72,
                  height: 120,
                  borderRadius: 12,
                  border: "1px solid var(--border-quiet)",
                  background: "linear-gradient(180deg, #242424 0%, #111 100%)",
                  overflow: "hidden",
                  display: "grid",
                  placeItems: "center",
                  position: "relative",
                  flexShrink: 0
                }}
              >
                <span className="icon muted" style={{ fontSize: 36, opacity: 0.3 }} aria-hidden="true">
                  accessibility_new
                </span>
                <div
                  style={{
                    position: "absolute",
                    inset: "auto 0 20px",
                    height: 40,
                    background: "rgba(182,255,0,0.22)",
                    filter: "blur(8px)"
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div className="headline-md" style={{ marginBottom: 4 }}>
                  Glutes + Hamstrings
                </div>
                <div className="body-md muted">Workout A</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  6 exercises | 68 min
                </div>
              </div>
            </div>

            <div className="fade-line" style={{ margin: "16px 0" }} />

            <div className="grid-2">
              <div>
                <div className="row" style={{ justifyContent: "flex-start", gap: 6, marginBottom: 8 }}>
                  <span className="icon muted" style={{ fontSize: 18 }}>restaurant</span>
                  <span className="body-md">Nutrition</span>
                </div>
                <div className="body-md" style={{ fontWeight: 700 }}>
                  2,050 kcal
                </div>
                <div className="caption" style={{ marginTop: 4 }}>
                  140P · 220C · 60F
                </div>
              </div>
              <div>
                <div className="row" style={{ justifyContent: "flex-start", gap: 6, marginBottom: 8 }}>
                  <span className="icon muted" style={{ fontSize: 18 }}>favorite</span>
                  <span className="body-md">Cardio &amp; Habits</span>
                </div>
                <div className="body-md">Zone 2 | 20 min</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  Daily habits 0/5
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <div className="sticky-action">
          <PrimaryButton href="/day/2026-08-08">View Day</PrimaryButton>
        </div>
      </main>
    </Screen>
  );
}
