import { coachxCalendarDays, coachxCalendarWeekdays, coachxDemoState, coachxToday } from "@/lib/coachx-data";
import { Screen } from "@/components/screen";
import { Card, IconButton, PrimaryButton, Section } from "@/components/ui";

export default function CalendarPage() {
  return (
    <Screen
      activeTab="calendar"
      shellClassName="screen-shell calendar-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            Calendar
          </div>
        </header>
      }
    >
      <main className="content tight">
        <section className="calendar-toolbar">
          <div className="calendar-month-row">
            <IconButton icon="chevron_left" label="Previous month" />
            <h1 className="headline-md" style={{ textTransform: "uppercase", letterSpacing: "0.03em", textAlign: "center" }}>
              {coachxDemoState.calendar.monthLabel}
            </h1>
            <IconButton icon="chevron_right" label="Next month" />
          </div>

          <div className="calendar-weekdays">
            {coachxCalendarWeekdays.map((day) => (
              <div key={day} className="calendar-label" style={{ textAlign: "center" }}>
                {day}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="calendar-grid">
            {coachxCalendarDays.map((day) => (
              <div
                key={`${day.weekday}-${day.day}-${day.monthOffset}`}
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
          <Card className="p-16 elevated" style={{ background: "var(--background-charcoal)" }}>
            <div className="row" style={{ marginBottom: 16 }}>
              <div>
                <div className="headline-md" style={{ fontSize: 14, lineHeight: "20px", textTransform: "uppercase" }}>
                  {coachxToday.calendarLabel}
                </div>
              </div>
              <span className="accent" style={{ fontSize: 12, lineHeight: "16px", fontWeight: 700, textTransform: "uppercase" }}>
                {coachxToday.phase}
              </span>
            </div>

            <div className="row start" style={{ gap: 16 }}>
              <div className="card" style={{ width: 72, height: 120, borderRadius: 12, background: "var(--surface-default)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="headline-md" style={{ marginBottom: 4 }}>
                  {coachxToday.workoutTitle}
                </div>
                <div className="body-md muted">{coachxToday.workoutType}</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  {coachxToday.workoutCount} · {coachxToday.duration}
                </div>
              </div>
            </div>

            <div className="fade-line" style={{ margin: "16px 0" }} />

            <div className="grid-2">
              <div>
                <div className="row" style={{ justifyContent: "flex-start", gap: 6, marginBottom: 8 }}>
                  <span className="icon muted" style={{ fontSize: 18 }}>
                    restaurant
                  </span>
                  <span className="body-md">Nutrition</span>
                </div>
                <div className="body-md" style={{ fontWeight: 700 }}>
                  {coachxToday.nutritionCalories}
                </div>
                <div className="caption" style={{ marginTop: 4 }}>
                  {coachxToday.macros}
                </div>
              </div>
              <div>
                <div className="row" style={{ justifyContent: "flex-start", gap: 6, marginBottom: 8 }}>
                  <span className="icon muted" style={{ fontSize: 18 }}>
                    favorite
                  </span>
                  <span className="body-md">Cardio &amp; Habits</span>
                </div>
                <div className="body-md">{coachxToday.cardio}</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  {coachxToday.habits}
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
