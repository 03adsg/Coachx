"use client";

import Link from "next/link";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { AnatomyPreview } from "@/components/anatomy-preview";
import { useTranslator } from "@/components/locale-provider";
import { useWorkoutStore } from "@/components/workout-provider";
import { coachxDemoState } from "@/lib/coachx-data";
import { getExerciseDefinition } from "@/lib/workout-data";

export default function WorkoutSummaryPage() {
  const { session } = useWorkoutStore();
  const { locale } = useTranslator();
  const focusExercise = getExerciseDefinition(session.exercises[0].performedExerciseId);

  const copy = {
    en: {
      complete: "Workout Complete",
      duration: "Duration",
      exercises: "Exercises",
      workingSets: "Working Sets",
      totalVolume: "Total Volume",
      insight: "AthlexForce Insight",
      todayFocus: "Today&apos;s Focus",
      todayPerformance: "Today&apos;s Performance",
      newBest: "New best",
      nextTime: "Next Time",
      feel: "How did that session feel?",
      thisWeek: "This Week",
      phaseWeek: "Phase 1 · Week 1 of 8",
      summaryItems: ["Hip Thrust — 80 → 85 kg (+5 kg)", "Romanian Deadlift — 30 kg | Target completed", "Bulgarian Split Squat — +2 reps vs last session"],
      done: "Done",
      viewProgress: "View Progress"
    },
    es: {
      complete: "Entrenamiento completado",
      duration: "Duración",
      exercises: "Ejercicios",
      workingSets: "Series efectivas",
      totalVolume: "Volumen total",
      insight: "Insight de AthlexForce",
      todayFocus: "Enfoque de hoy",
      todayPerformance: "Rendimiento de hoy",
      newBest: "Nuevo mejor",
      nextTime: "Próxima vez",
      feel: "¿Cómo te sentiste en esa sesión?",
      thisWeek: "Esta semana",
      phaseWeek: "Fase 1 · Semana 1 de 8",
      summaryItems: ["Hip Thrust — 80 → 85 kg (+5 kg)", "Peso muerto rumano — 30 kg | Objetivo completado", "Sentadilla búlgara — +2 repeticiones vs la última sesión"],
      done: "Listo",
      viewProgress: "Ver progreso"
    },
    ca: {
      complete: "Entrenament completat",
      duration: "Durada",
      exercises: "Exercicis",
      workingSets: "Sèries de treball",
      totalVolume: "Volum total",
      insight: "Insight d'AthlexForce",
      todayFocus: "Focus d'avui",
      todayPerformance: "Rendiment d'avui",
      newBest: "Nou millor",
      nextTime: "La propera vegada",
      feel: "Com t'has sentit en aquesta sessió?",
      thisWeek: "Aquesta setmana",
      phaseWeek: "Fase 1 · Setmana 1 de 8",
      summaryItems: ["Hip Thrust — 80 → 85 kg (+5 kg)", "Romanian Deadlift — 30 kg | Objectiu completat", "Bulgarian Split Squat — +2 repeticions respecte a l'última sessió"],
      done: "Fet",
      viewProgress: "Veure progrés"
    },
    de: {
      complete: "Training abgeschlossen",
      duration: "Dauer",
      exercises: "Übungen",
      workingSets: "Arbeitssätze",
      totalVolume: "Gesamtvolumen",
      insight: "AthlexForce-Einblick",
      todayFocus: "Heutiger Fokus",
      todayPerformance: "Heutige Leistung",
      newBest: "Neue Bestleistung",
      nextTime: "Nächstes Mal",
      feel: "Wie hat sich die Einheit angefühlt?",
      thisWeek: "Diese Woche",
      phaseWeek: "Phase 1 · Woche 1 von 8",
      summaryItems: ["Hip Thrust — 80 → 85 kg (+5 kg)", "Rumänisches Kreuzheben — 30 kg | Ziel erreicht", "Bulgarian Split Squat — +2 Wiederholungen vs. letzte Einheit"],
      done: "Fertig",
      viewProgress: "Fortschritt ansehen"
    }
  }[locale as "en" | "es" | "ca" | "de"] ?? {
    complete: "Workout Complete",
    duration: "Duration",
    exercises: "Exercises",
    workingSets: "Working Sets",
    totalVolume: "Total Volume",
    insight: "AthlexForce Insight",
    todayFocus: "Today's Focus",
    todayPerformance: "Today's Performance",
    newBest: "New best",
    nextTime: "Next Time",
    feel: "How did that session feel?",
    thisWeek: "This Week",
    phaseWeek: "Phase 1 · Week 1 of 8",
    summaryItems: ["Hip Thrust — 80 → 85 kg (+5 kg)", "Romanian Deadlift — 30 kg | Target completed", "Bulgarian Split Squat — +2 reps vs last session"],
    done: "Done",
    viewProgress: "View Progress"
  };

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="workout-summary-topbar">
          <span className="eyebrow" style={{ margin: 0 }}>
            AthlexForce
          </span>
        </header>
      }
    >
      <main className="content tight">
        <section className="section workout-summary-hero">
          <div className="workout-summary-hero__icon">
            <span className="icon filled" aria-hidden="true">
              check_circle
            </span>
          </div>
          <h1 className="headline-lg" style={{ textTransform: "uppercase" }}>
            {copy.complete}
          </h1>
          <p className="body-lg" style={{ color: "var(--text-secondary)" }}>
            {session.workoutLabel} · {session.phaseLabel}
          </p>
          <p className="caption" style={{ marginTop: 8 }}>
            {session.dateLabel} · {session.totalExercises} / {session.totalExercises} {copy.exercises.toLowerCase()}
          </p>
        </section>

        <section className="grid-2 section">
          {[
            [copy.duration, session.summary.duration],
            [copy.exercises, session.summary.exercisesCompleted],
            [copy.workingSets, session.summary.setsCompleted],
            [copy.totalVolume, session.summary.totalVolume]
          ].map(([label, value]) => (
            <Card key={label} className="workout-summary-tile">
              <div className="eyebrow" style={{ margin: 0 }}>
                {label}
              </div>
              <div className="headline-md" style={{ marginTop: 8 }}>
                {value}
              </div>
            </Card>
          ))}
        </section>

        <section className="section">
          <Card className="workout-insight-card elevated">
            <div className="row start">
              <span className="icon accent filled" aria-hidden="true">
                tips_and_updates
              </span>
              <div>
                <div className="eyebrow" style={{ color: "#b6ff00" }}>
                  {copy.insight}
                </div>
                <p className="body-md" style={{ color: "var(--text-primary)", marginTop: 6 }}>
                  {session.summary.insight}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {copy.todayFocus}
          </div>
          <Card className="workout-focus-card">
            <AnatomyPreview focus={coachxDemoState.day.muscleFocus} />
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {copy.todayPerformance}
          </div>
          <Card className="workout-performance-card">
            <div className="row">
              <div>
                <div className="workout-status-pill workout-status-pill--match">{copy.newBest}</div>
                <div className="headline-md" style={{ marginTop: 10 }}>
                  {focusExercise.name}
                </div>
              </div>
              <div className="headline-md" style={{ textAlign: "right" }}>
                85 kg × 10
              </div>
            </div>
            <div className="workout-divider" />
            <div className="stack">
              {copy.summaryItems.map((item) => (
                <div key={item} className="caption" style={{ color: "var(--text-primary)" }}>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="workout-next-card">
            <div className="eyebrow">{copy.nextTime}</div>
            <div className="stack" style={{ marginTop: 12 }}>
              {session.summary.nextTime.map((item: { label: string; detail: string }) => (
                <div key={item.label} className="workout-next-card__item">
                  <div className="body-md" style={{ fontWeight: 700 }}>
                    {item.label}
                  </div>
                  <div className="caption">{item.detail}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {copy.feel}
          </div>
          <div className="workout-chip-row">
            {session.summary.feedback.map((item: "Too Easy" | "Good" | "Challenging") => (
              <button key={item} className={`workout-filter-chip ${item === "Good" ? "active" : ""}`} type="button">
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <Card className="workout-week-card">
            <div className="row">
              <div>
                <div className="eyebrow">{copy.thisWeek}</div>
                <div className="body-md" style={{ marginTop: 6 }}>
                  {copy.phaseWeek}
                </div>
              </div>
              <div className="headline-md">3 / 4</div>
            </div>
            <div className="progress-track" style={{ marginTop: 16 }}>
              <div className="progress-fill" style={{ width: "75%" }} />
            </div>
          </Card>
        </section>

        <div className="stack">
          <Link className="button-primary focus-ring" href="/">
            {copy.done}
          </Link>
          <Link className="workout-secondary-button focus-ring" href="/progress">
            {copy.viewProgress}
          </Link>
        </div>
      </main>
    </Screen>
  );
}
