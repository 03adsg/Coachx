"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui";
import { Screen } from "@/components/screen";
import { useProgramStore } from "@/components/program-provider";
import { useTranslator } from "@/components/locale-provider";

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

function SkeletonBlock({ width, height = 12 }: { width: string; height?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius: 999,
        background: "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))"
      }}
    />
  );
}

function ProgramPageSkeleton() {
  return (
    <Screen
      activeTab={undefined}
      shellClassName="screen-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            RESUMEN DEL PROGRAMA
          </div>
        </header>
      }
    >
      <main className="content tight" aria-busy="true">
        <section className="section">
          <div className="eyebrow">MI PROGRAMA</div>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            <SkeletonBlock width="42%" height={18} />
            <SkeletonBlock width="28%" height={14} />
          </div>
        </section>

        <section className="section stack">
          <Card className="program-hero-card p-16">
            <div className="stack" style={{ gap: 12 }}>
              <SkeletonBlock width="34%" height={22} />
              <SkeletonBlock width="52%" height={30} />
              <SkeletonBlock width="88%" height={14} />
              <SkeletonBlock width="76%" height={14} />
            </div>
          </Card>
        </section>

        <section className="section stack">
          <SectionCard title="ESTRUCTURA SEMANAL">
            <div style={{ display: "grid", gap: 10 }}>
              <SkeletonBlock width="96%" />
              <SkeletonBlock width="82%" />
            </div>
          </SectionCard>
          <SectionCard title="PLANTILLAS DE ENTRENAMIENTO">
            <div style={{ display: "grid", gap: 10 }}>
              <SkeletonBlock width="72%" />
              <SkeletonBlock width="64%" />
            </div>
          </SectionCard>
          <SectionCard title="MOVIMIENTOS CLAVE">
            <div style={{ display: "grid", gap: 10 }}>
              <SkeletonBlock width="84%" />
              <SkeletonBlock width="58%" />
            </div>
          </SectionCard>
        </section>

        <section className="section stack">
          <Card className="program-section-card">
            <div className="eyebrow">PROGRESIÓN</div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <SkeletonBlock width="92%" />
              <SkeletonBlock width="66%" />
            </div>
          </Card>
          <Card className="program-section-card">
            <div className="eyebrow">NUTRICIÓN</div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <SkeletonBlock width="54%" />
              <SkeletonBlock width="68%" />
            </div>
          </Card>
          <Card className="program-section-card">
            <div className="eyebrow">CARDIO</div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <SkeletonBlock width="38%" />
              <SkeletonBlock width="60%" />
            </div>
          </Card>
          <Card className="program-section-card">
            <div className="eyebrow">RECUPERACIÓN</div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <SkeletonBlock width="76%" />
              <SkeletonBlock width="62%" />
            </div>
          </Card>
          <Card className="program-section-card">
            <div className="eyebrow">HÁBITOS</div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <SkeletonBlock width="84%" />
              <SkeletonBlock width="70%" />
            </div>
          </Card>
          <Card className="program-section-card">
            <div className="eyebrow">CHECK-IN</div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <SkeletonBlock width="58%" />
              <SkeletonBlock width="72%" />
            </div>
          </Card>
          <Card className="program-section-card">
            <div className="eyebrow">CALENDARIO DE REVISIÓN</div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <SkeletonBlock width="90%" />
              <SkeletonBlock width="64%" />
            </div>
          </Card>
        </section>

        <section className="section stack">
          <Card className="program-section-card">
            <div className="eyebrow">AJUSTES RECIENTES</div>
            <div className="stack" style={{ marginTop: 12 }}>
              <SkeletonBlock width="74%" />
            </div>
          </Card>
        </section>
      </main>
    </Screen>
  );
}

export default function ProgramPage() {
  const { program, loading, ready } = useProgramStore();
  const { t } = useTranslator();

  if (loading || !ready || !program) {
    return <ProgramPageSkeleton />;
  }

  return (
    <Screen
      activeTab={undefined}
      shellClassName="screen-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            {t("program.overview")}
          </div>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <div className="eyebrow">{t("program.myProgram")}</div>
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
          <SectionCard title={t("program.weeklyStructure")}>{program.weeklyStructure.join(" · ")}</SectionCard>
          <SectionCard title={t("program.workoutTemplates")}>{program.workoutTemplates.join(" · ")}</SectionCard>
          <SectionCard title={t("program.keyMovements")}>{program.keyMovements.join(" · ")}</SectionCard>
        </section>

        <section className="section stack">
          <SectionCard title={t("program.progression")}>{program.progressionSystem}</SectionCard>
          <SectionCard title={t("program.nutrition")}>{program.nutrition}</SectionCard>
          <SectionCard title={t("program.cardio")}>{program.cardio}</SectionCard>
          <SectionCard title={t("program.recovery")}>{program.recovery}</SectionCard>
          <SectionCard title={t("program.habits")}>{program.habits}</SectionCard>
          <SectionCard title={t("program.checkIn")}>{program.checkIn}</SectionCard>
          <SectionCard title={t("program.reviewTimeline")}>{program.baselineTimeline.join(" · ")}</SectionCard>
        </section>

        <section className="section stack">
          <Card className="program-section-card">
            <div className="eyebrow">{t("program.recentAdjustments")}</div>
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
