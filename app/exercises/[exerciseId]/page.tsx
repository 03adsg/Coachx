"use client";

import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useLocale } from "@/components/locale-provider";
import { useWorkoutStore } from "@/components/workout-provider";
import { getExerciseDefinition } from "@/lib/workout-data";

function copyFor(locale: string) {
  return (
    {
      en: {
        back: "Back",
        bookmark: "Bookmark",
        exercise: "Exercise",
        musclesWorked: "Muscles Worked",
        howToDoIt: "How To Do It",
        setup: "Setup",
        coachCues: "Coach Cues",
        avoid: "Avoid",
        yourProgram: "Your Program",
        setsReps: "Sets × Reps",
        rir: "RIR",
        rest: "Rest",
        lastSession: "Last session:",
        progressionTarget: "Progression Target",
        alternatives: "Alternatives",
        backToWorkout: "Back to Workout",
        backToLibrary: "Back to Library"
      },
      es: {
        back: "Atrás",
        bookmark: "Marcar",
        exercise: "Ejercicio",
        musclesWorked: "Músculos trabajados",
        howToDoIt: "Cómo hacerlo",
        setup: "Preparación",
        coachCues: "Claves del coach",
        avoid: "Evitar",
        yourProgram: "Tu programa",
        setsReps: "Series × repeticiones",
        rir: "RIR",
        rest: "Descanso",
        lastSession: "Última sesión:",
        progressionTarget: "Objetivo de progresión",
        alternatives: "Alternativas",
        backToWorkout: "Volver al entrenamiento",
        backToLibrary: "Volver a la biblioteca"
      },
      ca: {
        back: "Enrere",
        bookmark: "Marcar",
        exercise: "Exercici",
        musclesWorked: "Músculs treballats",
        howToDoIt: "Com fer-ho",
        setup: "Preparació",
        coachCues: "Claus del coach",
        avoid: "Evita",
        yourProgram: "El teu programa",
        setsReps: "Sèries × repeticions",
        rir: "RIR",
        rest: "Descans",
        lastSession: "Darrera sessió:",
        progressionTarget: "Objectiu de progressió",
        alternatives: "Alternatives",
        backToWorkout: "Torna a l'entrenament",
        backToLibrary: "Torna a la biblioteca"
      },
      de: {
        back: "Zurück",
        bookmark: "Merken",
        exercise: "Übung",
        musclesWorked: "Beanspruchte Muskeln",
        howToDoIt: "So geht's",
        setup: "Setup",
        coachCues: "Coach-Hinweise",
        avoid: "Vermeiden",
        yourProgram: "Dein Programm",
        setsReps: "Sätze × Wdh.",
        rir: "RIR",
        rest: "Pause",
        lastSession: "Letzte Einheit:",
        progressionTarget: "Progressionsziel",
        alternatives: "Alternativen",
        backToWorkout: "Zurück zum Training",
        backToLibrary: "Zurück zur Bibliothek"
      }
    }[locale as "en" | "es" | "ca" | "de"] ?? {
      back: "Back",
      bookmark: "Bookmark",
      exercise: "Exercise",
      musclesWorked: "Muscles Worked",
      howToDoIt: "How To Do It",
      setup: "Setup",
      coachCues: "Coach Cues",
      avoid: "Avoid",
      yourProgram: "Your Program",
      setsReps: "Sets × Reps",
      rir: "RIR",
      rest: "Rest",
      lastSession: "Last session:",
      progressionTarget: "Progression Target",
      alternatives: "Alternatives",
      backToWorkout: "Back to Workout",
      backToLibrary: "Back to Library"
    }
  );
}

function capitalizeWords(value: string) {
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ExerciseDetailPage() {
  const params = useParams<{ exerciseId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useLocale();
  const copy = copyFor(locale);
  const exerciseId = params?.exerciseId ?? "barbell-hip-thrust";
  const definition = getExerciseDefinition(exerciseId);
  const { session } = useWorkoutStore();
  const fromWorkout = searchParams.get("from") === "workout";

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="exercise-detail-topbar">
          <button aria-label={copy.back} className="tap-target focus-ring" type="button" onClick={() => router.back()}>
            <span className="icon" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <div className="eyebrow" style={{ margin: 0 }}>
            {copy.exercise}
          </div>
          <button aria-label={copy.bookmark} className="tap-target focus-ring" type="button">
            <span className="icon" aria-hidden="true">
              bookmark
            </span>
          </button>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <Card className="exercise-detail-hero">
            <img className="exercise-detail-hero__image" src={definition.heroImage ?? definition.thumbnail ?? "/exercise-placeholder.svg"} alt={definition.name} />
            <div className="exercise-detail-hero__fade" />
            <div className="exercise-detail-hero__content">
              <div className="pill" style={{ minHeight: 24, padding: "0 10px", background: "rgba(37,37,37,0.92)" }}>
                {definition.equipment.toUpperCase()}
              </div>
              <h1 className="headline-lg" style={{ marginTop: 10, textTransform: "uppercase" }}>
                {definition.name}
              </h1>
              <div className="body-md" style={{ marginTop: 8, color: "#b6ff00" }}>
                {definition.primaryMuscles.map((muscle) => capitalizeWords(muscle)).join(" + ")}
                <span style={{ color: "#999" }}> · </span>
                {definition.secondaryMuscles.map((muscle) => capitalizeWords(muscle)).join(" + ")}
              </div>
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {copy.musclesWorked}
          </div>
          <Card className="workout-library-subcard">
            <div className="caption" style={{ marginBottom: 12 }}>
              AthlexForce keeps the muscle map semantic. This exercise targets glute extension with hamstring support.
            </div>
            <div className="stack">
              {[capitalizeWords(definition.primaryMuscles.join(" + ")), capitalizeWords(definition.secondaryMuscles.join(" + ")), "Adductors"].map((muscle, index) => (
                <div key={muscle} className="row" style={{ justifyContent: "flex-start", gap: 10, color: index === 0 ? "#b6ff00" : "#e4e2e1" }}>
                  <span className={`icon ${index === 0 ? "filled" : ""}`} aria-hidden="true" style={{ fontSize: 14 }}>
                    fiber_manual_record
                  </span>
                  <span>{muscle}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {copy.howToDoIt}
          </div>
          <Card className="workout-library-subcard">
            <div className="eyebrow" style={{ marginBottom: 10, color: "#b6ff00" }}>
              {copy.setup}
            </div>
            <ul className="workout-list">
              {definition.setup.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="workout-divider" />
            <ol className="workout-steps">
              {definition.howToDo.map((step, index) => (
                <li key={step}>
                  <span className="workout-step-number">{String(index + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </section>

        <section className="grid-2 section">
          <Card className="workout-cue-card">
            <div className="eyebrow" style={{ color: "#b6ff00" }}>
              {copy.coachCues}
            </div>
            <div className="stack" style={{ marginTop: 12 }}>
              {definition.coachCues.map((cue) => (
                <div key={cue} className="body-md">
                  • {cue}
                </div>
              ))}
            </div>
          </Card>
          <Card className="workout-cue-card" style={{ borderColor: "#543232" }}>
            <div className="eyebrow" style={{ color: "#ffb4ab" }}>
              {copy.avoid}
            </div>
            <div className="stack" style={{ marginTop: 12 }}>
              {definition.commonMistakes.map((mistake) => (
                <div key={mistake} className="body-md">
                  • {mistake}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {copy.yourProgram}
          </div>
          <Card className="workout-program-card">
            <div className="grid-3">
              <div>
                <div className="eyebrow">{copy.setsReps}</div>
                <div className="headline-md" style={{ marginTop: 8 }}>
                  {definition.programSets} × {definition.programReps}
                </div>
              </div>
              <div>
                <div className="eyebrow">{copy.rir}</div>
                <div className="headline-md" style={{ marginTop: 8 }}>
                  {definition.programRir}
                </div>
              </div>
              <div>
                <div className="eyebrow">{copy.rest}</div>
                <div className="headline-md" style={{ marginTop: 8 }}>
                  {Math.round(definition.restSeconds / 60)}:{String(definition.restSeconds % 60).padStart(2, "0")}
                </div>
              </div>
            </div>
            <div className="workout-mini-panel" style={{ marginTop: 14 }}>
              <div className="caption">{copy.lastSession}</div>
              <div className="body-md" style={{ marginTop: 6 }}>
                {definition.lastPerformance}
              </div>
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {copy.progressionTarget}
          </div>
          <Card className="workout-library-subcard">
            <div className="body-md">{definition.progressionTarget}</div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {copy.alternatives}
          </div>
          <div className="stack">
            {definition.alternatives.map((alternativeId) => {
              const alternative = getExerciseDefinition(alternativeId);
              return (
                <Card key={alternative.id} className="library-item library-item--compact">
                  <div className="library-item__thumb">
                    <img src={alternative.thumbnail ?? alternative.heroImage ?? "/exercise-placeholder.svg"} alt={alternative.name} />
                  </div>
                  <div className="library-item__body">
                    <div className="body-md" style={{ fontWeight: 700 }}>
                      {alternative.name}
                    </div>
                    <div className="caption" style={{ marginTop: 6, color: "#b6ff00" }}>
                      {alternative.equipment.toUpperCase()}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="sticky-action">
          <Link className="button-primary focus-ring" href={fromWorkout ? `/workout/${session.id}/exercise/${session.exercises[0].id}` : "/exercises"}>
            {fromWorkout ? copy.backToWorkout : copy.backToLibrary}
          </Link>
        </div>
      </main>
    </Screen>
  );
}
