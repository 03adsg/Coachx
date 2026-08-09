"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui";
import { Screen } from "@/components/screen";
import { useProgramStore } from "@/components/program-provider";

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="program-section-card">
      <div className="eyebrow">{title}</div>
      <div className="body-md" style={{ marginTop: 8, fontWeight: 700 }}>
        {children}
      </div>
    </Card>
  );
}

export default function ProgramPage() {
  const { program, loading, ready } = useProgramStore();

  if (loading || !ready || !program) {
    return null;
  }

  return (
    <Screen
      activeTab={undefined}
      shellClassName="screen-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            Program Overview
          </div>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <div className="eyebrow">My Program</div>
          <h1 className="headline-lg" style={{ marginTop: 6 }}>
            {program.phaseLabel} · {program.status.toUpperCase()}
          </h1>
        </section>

        <section className="section stack">
          <Card className="program-hero-card p-16">
            <div className="stack" style={{ gap: 12 }}>
              <span className="program-template-chip">{program.goal}</span>
              <h2 className="headline-md">{program.duration}</h2>
              <p className="body-md muted">{program.whyItFits}</p>
            </div>
          </Card>
        </section>

        <section className="section stack">
          <SectionCard title="Weekly structure">{program.weeklyStructure.join(" · ")}</SectionCard>
          <SectionCard title="Workout templates">{program.workoutTemplates.join(" · ")}</SectionCard>
          <SectionCard title="Key movements">{program.keyMovements.join(" · ")}</SectionCard>
        </section>

        <section className="section stack">
          <SectionCard title="Progression">{program.progressionSystem}</SectionCard>
          <SectionCard title="Nutrition">{program.nutrition}</SectionCard>
          <SectionCard title="Cardio">{program.cardio}</SectionCard>
          <SectionCard title="Recovery">{program.recovery}</SectionCard>
          <SectionCard title="Habits">{program.habits}</SectionCard>
          <SectionCard title="Check-in">{program.checkIn}</SectionCard>
          <SectionCard title="Review timeline">{program.baselineTimeline.join(" · ")}</SectionCard>
        </section>

        <section className="section stack">
          <Card className="program-section-card">
            <div className="eyebrow">Recent adjustments</div>
            <div className="stack" style={{ marginTop: 12 }}>
              {program.recentAdjustments.map((item) => (
                <div key={item} className="row">
                  <div className="body-md" style={{ fontWeight: 700 }}>
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </Screen>
  );
}
