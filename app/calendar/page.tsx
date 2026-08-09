"use client";

import { Card, IconButton, PrimaryButton, Section } from "@/components/ui";
import { Screen } from "@/components/screen";
import { useProgramStore } from "@/components/program-provider";

export default function CalendarPage() {
  const { getCalendarDays, getDaySummary, monthLabel, selectedDateKey, weekdays } = useProgramStore();
  const activeDateKey = selectedDateKey ?? "2026-08-08";
  const days = getCalendarDays(activeDateKey, activeDateKey);
  const day = getDaySummary(activeDateKey);

  if (!day) {
    return null;
  }

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
              {monthLabel ?? "August 2026"}
            </h1>
            <IconButton icon="chevron_right" label="Next month" />
          </div>

          <div className="calendar-weekdays">
            {weekdays.map((weekday) => (
              <div key={weekday} className="calendar-label" style={{ textAlign: "center" }}>
                {weekday}
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="calendar-grid">
            {days.map((dayCell) => (
              <div
                key={dayCell.key}
                className={`day-cell ${dayCell.isSelected ? "selected" : ""} ${dayCell.isDimmed ? "dimmed" : ""}`.trim()}
              >
                <span className="body-md" style={{ color: dayCell.isToday ? "var(--text-primary)" : "inherit" }}>
                  {dayCell.day}
                </span>
                {dayCell.hasActivity ? <span className="day-dot" aria-hidden="true" /> : null}
                {dayCell.completed ? (
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
                  {day.calendarLabel}
                </div>
              </div>
              <span className="accent" style={{ fontSize: 12, lineHeight: "16px", fontWeight: 700, textTransform: "uppercase" }}>
                {day.phase}
              </span>
            </div>

            <div className="row start" style={{ gap: 16 }}>
              <div className="card" style={{ width: 72, height: 120, borderRadius: 12, background: "var(--surface-default)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="headline-md" style={{ marginBottom: 4 }}>
                  {day.workoutTitle}
                </div>
                <div className="body-md muted">{day.workoutType}</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  {day.workoutCount} · {day.duration}
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
                  {day.nutritionCalories}
                </div>
                <div className="caption" style={{ marginTop: 4 }}>
                  {day.macros}
                </div>
              </div>
              <div>
                <div className="row" style={{ justifyContent: "flex-start", gap: 6, marginBottom: 8 }}>
                  <span className="icon muted" style={{ fontSize: 18 }}>
                    favorite
                  </span>
                  <span className="body-md">Cardio &amp; Habits</span>
                </div>
                <div className="body-md">{day.cardio}</div>
                <div className="caption" style={{ marginTop: 4 }}>
                  {day.habits}
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <div className="sticky-action">
          <PrimaryButton href={`/day/${day.dateKey}`}>View Day</PrimaryButton>
        </div>
      </main>
    </Screen>
  );
}
