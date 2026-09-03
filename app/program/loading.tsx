"use client";

import type { ReactNode } from "react";
import { useTranslator } from "@/components/locale-provider";

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

function SkeletonCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section stack">
      <div className="program-section-card card p-16">
        <div className="eyebrow">{title}</div>
        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>{children}</div>
      </div>
    </section>
  );
}

export default function ProgramLoading() {
  const { t } = useTranslator();

  return (
    <div className="app-frame">
      <div className="screen screen-shell">
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            {t("program.overview")}
          </div>
        </header>

        <main className="content tight" aria-busy="true">
          <section className="section">
            <div className="eyebrow">{t("program.myProgram")}</div>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              <SkeletonBlock width="42%" height={18} />
              <SkeletonBlock width="28%" height={14} />
            </div>
          </section>

          <section className="section stack">
            <div className="program-hero-card card p-16">
              <div className="stack" style={{ gap: 12 }}>
                <SkeletonBlock width="34%" height={22} />
                <SkeletonBlock width="52%" height={30} />
                <SkeletonBlock width="88%" height={14} />
                <SkeletonBlock width="76%" height={14} />
              </div>
            </div>
          </section>

          <SkeletonCard title={t("program.weeklyStructure")}>
            <SkeletonBlock width="96%" />
            <SkeletonBlock width="82%" />
          </SkeletonCard>

          <SkeletonCard title={t("program.workoutTemplates")}>
            <SkeletonBlock width="72%" />
            <SkeletonBlock width="64%" />
          </SkeletonCard>

          <SkeletonCard title={t("program.keyMovements")}>
            <SkeletonBlock width="84%" />
            <SkeletonBlock width="58%" />
          </SkeletonCard>

          <section className="section stack">
            <div className="program-section-card card p-16">
              <div className="eyebrow">{t("program.progression")}</div>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                <SkeletonBlock width="92%" />
                <SkeletonBlock width="66%" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
