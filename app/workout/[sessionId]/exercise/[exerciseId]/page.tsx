"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useTranslator } from "@/components/locale-provider";
import { useWorkoutStore } from "@/components/workout-provider";
import { getExerciseDefinition, getWorkoutExercise } from "@/lib/workout-data";

function muscleLabel(locale: string, muscle: string) {
  const copy = {
    en: { glutes: "Glutes", back: "Back", chest: "Chest", hamstrings: "Hamstrings" },
    es: { glutes: "Glúteos", back: "Espalda", chest: "Pecho", hamstrings: "Isquiotibiales" },
    ca: { glutes: "Glutis", back: "Esquena", chest: "Pit", hamstrings: "Isquiotibials" },
    de: { glutes: "Gesäß", back: "Rücken", chest: "Brust", hamstrings: "Hamstrings" }
  }[locale as "en" | "es" | "ca" | "de"] ?? { glutes: "Glutes", back: "Back", chest: "Chest", hamstrings: "Hamstrings" };

  return copy[muscle as keyof typeof copy] ?? muscle;
}

export default function ActiveExercisePage() {
  const params = useParams<{ sessionId: string; exerciseId: string }>();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { locale } = useTranslator();
  const exerciseId = params?.exerciseId ?? "hip-thrust";
  const { session, updateSetDraft, completeSet, skipRestTimer, addThirtySeconds, finishWorkout } = useWorkoutStore();
  const exercise = getWorkoutExercise(session, exerciseId);
  const definition = getExerciseDefinition(exercise.performedExerciseId);
  const currentSet = exercise.sets.find((set) => !set.completed) ?? exercise.sets[exercise.sets.length - 1];
  const completedCount = exercise.completedSets.length;
  const progressLabel = `${exercise.order} / ${session.totalExercises}`;
  const isFinalSet = currentSet.setNumber >= exercise.totalSets;

  const copy = {
    en: {
      closeWorkout: "Close workout",
      moreOptions: "More options",
      exercise: "Exercise",
      primary: "Primary",
      secondary: "Secondary",
      previewExercise: "Preview exercise",
      sets: "Sets",
      reps: "Reps",
      sec: "Sec",
      lastSession: "Last Session",
      logSets: "Log Sets",
      kg: "Kg",
      restTimer: "Rest timer",
      nextSet: "Next set",
      addThirtySeconds: "+30 SEC",
      skip: "Skip",
      alternatives: "Alternatives",
      pain: "Pain / Discomfort",
      saving: "Saving...",
      finishWorkout: "Finish Workout",
      completeSet: "Complete Set"
    },
    es: {
      closeWorkout: "Cerrar entrenamiento",
      moreOptions: "Más opciones",
      exercise: "Ejercicio",
      primary: "Primario",
      secondary: "Secundario",
      previewExercise: "Vista previa del ejercicio",
      sets: "Series",
      reps: "Reps",
      sec: "Seg",
      lastSession: "Sesión anterior",
      logSets: "Registrar series",
      kg: "Kg",
      restTimer: "Descanso",
      nextSet: "Siguiente serie",
      addThirtySeconds: "+30 SEG",
      skip: "Saltar",
      alternatives: "Alternativas",
      pain: "Dolor / Molestia",
      saving: "Guardando...",
      finishWorkout: "Finalizar entrenamiento",
      completeSet: "Completar serie"
    },
    ca: {
      closeWorkout: "Tanca l'entrenament",
      moreOptions: "Més opcions",
      exercise: "Exercici",
      primary: "Primari",
      secondary: "Secundari",
      previewExercise: "Previsualitza l'exercici",
      sets: "Sèries",
      reps: "Reps",
      sec: "Seg",
      lastSession: "Sessió anterior",
      logSets: "Registrar sèries",
      kg: "Kg",
      restTimer: "Descans",
      nextSet: "Sèrie següent",
      addThirtySeconds: "+30 SEG",
      skip: "Omet",
      alternatives: "Alternatives",
      pain: "Dolor / molèstia",
      saving: "Desant...",
      finishWorkout: "Finalitza l'entrenament",
      completeSet: "Completa la sèrie"
    },
    de: {
      closeWorkout: "Training schließen",
      moreOptions: "Weitere Optionen",
      exercise: "Übung",
      primary: "Primär",
      secondary: "Sekundär",
      previewExercise: "Übung ansehen",
      sets: "Sätze",
      reps: "Wdh.",
      sec: "Sek",
      lastSession: "Letzte Einheit",
      logSets: "Sätze protokollieren",
      kg: "Kg",
      restTimer: "Pause",
      nextSet: "Nächster Satz",
      addThirtySeconds: "+30 SEK",
      skip: "Überspringen",
      alternatives: "Alternativen",
      pain: "Schmerz / Unbehagen",
      saving: "Speichern...",
      finishWorkout: "Training beenden",
      completeSet: "Satz abschließen"
    }
  }[locale as "en" | "es" | "ca" | "de"] ?? {
    closeWorkout: "Close workout",
    moreOptions: "More options",
    exercise: "Exercise",
    primary: "Primary",
    secondary: "Secondary",
    previewExercise: "Preview exercise",
    sets: "Sets",
    reps: "Reps",
    sec: "Sec",
    lastSession: "Last Session",
    logSets: "Log Sets",
    kg: "Kg",
    restTimer: "Rest timer",
    nextSet: "Next set",
    addThirtySeconds: "+30 SEC",
    skip: "Skip",
    alternatives: "Alternatives",
    pain: "Pain / Discomfort",
    saving: "Saving...",
    finishWorkout: "Finish Workout",
    completeSet: "Complete Set"
  };

  const primaryMuscle = muscleLabel(locale, definition.primaryMuscles[0] ?? "");
  const secondaryMuscle = muscleLabel(locale, definition.secondaryMuscles[0] ?? "");

  const handleComplete = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await completeSet(exercise.id, currentSet.setNumber, {
        kilograms: currentSet.kilograms,
        reps: currentSet.reps,
        rir: currentSet.rir
      });

      if (isFinalSet || completedCount + 1 >= exercise.totalSets) {
        await finishWorkout();
        router.push(`/workout/${session.id}/summary`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="workout-active-topbar">
          <button aria-label={copy.closeWorkout} className="tap-target focus-ring" type="button" onClick={() => router.push(`/workout/${session.id}`)}>
            <span className="icon" aria-hidden="true">
              close
            </span>
          </button>
          <div className="workout-active-topbar__title">
            {copy.exercise} {progressLabel}
          </div>
          <Link aria-label={copy.moreOptions} className="tap-target focus-ring" href={`/workout/${session.id}/adjust`}>
            <span className="icon" aria-hidden="true">
              more_vert
            </span>
          </Link>
        </header>
      }
    >
      <main className="content tight">
        <div className="workout-progress-bar">
          <div className="workout-progress-bar__fill" style={{ width: `${(exercise.order / session.totalExercises) * 100}%` }} />
        </div>

        <section className="section">
          <Card className="workout-hero-card">
            <div className="row start">
              <div>
                <div className="eyebrow" style={{ color: "#c6c6c7", marginBottom: 8 }}>
                  {definition.label}
                </div>
                <h1 className="headline-lg" style={{ textTransform: "uppercase" }}>
                  {definition.name}
                </h1>
                <p className="body-md muted" style={{ marginTop: 8 }}>
                  {copy.primary}: {primaryMuscle} · {copy.secondary}: {secondaryMuscle}
                </p>
              </div>
              <Link aria-label={copy.previewExercise} className="workout-play-button focus-ring" href={`/exercises/${definition.id}`}>
                <span className="icon" aria-hidden="true">
                  play_arrow
                </span>
              </Link>
            </div>
          </Card>
        </section>

        <section className="grid-3 section">
          <Card className="workout-stat-card">
            <div className="headline-md">{definition.programSets}</div>
            <div className="eyebrow" style={{ marginTop: 4 }}>
              {copy.sets}
            </div>
          </Card>
          <Card className="workout-stat-card">
            <div className="headline-md">{definition.programReps}</div>
            <div className="eyebrow" style={{ marginTop: 4 }}>
              {copy.reps}
            </div>
          </Card>
          <Card className="workout-stat-card">
            <div className="headline-md">{definition.restSeconds}</div>
            <div className="eyebrow" style={{ marginTop: 4 }}>
              {copy.sec}
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="workout-cue-card">
            <span className="icon accent filled" aria-hidden="true" style={{ fontSize: 22 }}>
              tips_and_updates
            </span>
            <p className="body-md">{definition.coachCues[0]}</p>
          </Card>
        </section>

        <section className="section">
          <Card className="workout-last-session-card">
            <div className="row" style={{ marginBottom: 12 }}>
              <span className="eyebrow" style={{ margin: 0 }}>
                {copy.lastSession} · July 31
              </span>
              <span className="pill" style={{ minHeight: 24, padding: "0 10px", background: "rgba(182,255,0,0.12)" }}>
                {definition.lastPerformance.split(" | ")[0]}
              </span>
            </div>
            <div className="headline-md" style={{ fontSize: 20 }}>
              {definition.lastPerformance.split(" | ")[1]} <span className="caption">{copy.reps.toLowerCase()}</span>
            </div>
            <div className="caption" style={{ marginTop: 12, borderTop: "1px solid #252525", paddingTop: 12, fontStyle: "italic", color: "#8c9479" }}>
              {exercise.suggestedTarget}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {copy.logSets}
          </div>
          <div className="stack">
            {exercise.sets.map((set) => {
              const active = !set.completed && set.setNumber === currentSet.setNumber;
              return (
                <Card key={set.setNumber} className={`workout-set-row ${active ? "active" : ""} ${set.completed ? "completed" : ""}`.trim()}>
                  <div className="workout-set-row__meta">
                    <div className="headline-md" style={{ fontSize: 20 }}>
                      {set.setNumber}
                    </div>
                    <div className="caption">{set.previous}</div>
                  </div>
                  <div className="workout-set-row__inputs">
                    <label>
                      <span className="eyebrow" style={{ marginBottom: 4 }}>
                        {copy.kg}
                      </span>
                      <input
                        className="workout-input"
                        inputMode="numeric"
                        type="number"
                        value={set.kilograms}
                        onChange={(event) => updateSetDraft(exercise.id, set.setNumber, { kilograms: event.target.value })}
                      />
                    </label>
                    <label>
                      <span className="eyebrow" style={{ marginBottom: 4 }}>
                        {copy.reps}
                      </span>
                      <input
                        className="workout-input"
                        inputMode="numeric"
                        type="number"
                        value={set.reps}
                        onChange={(event) => updateSetDraft(exercise.id, set.setNumber, { reps: event.target.value })}
                      />
                    </label>
                  </div>
                  <button
                    aria-label={`${copy.completeSet} ${set.setNumber}`}
                    className={`workout-set-button ${set.completed ? "done" : ""}`}
                    type="button"
                    onClick={() => void completeSet(exercise.id, set.setNumber, { kilograms: set.kilograms, reps: set.reps, rir: set.rir })}
                  >
                    <span className="icon filled" aria-hidden="true">
                      check
                    </span>
                  </button>
                </Card>
              );
            })}
          </div>
        </section>

        {session.restTimer?.active ? (
          <section className="section">
            <Card className="workout-rest-card elevated">
              <div className="row" style={{ marginBottom: 12 }}>
                <div>
                  <div className="eyebrow">{copy.restTimer}</div>
                  <div className="headline-md" style={{ marginTop: 6 }}>
                    {session.restTimer.secondsRemaining}s
                  </div>
                </div>
                <div className="pill">{copy.nextSet}</div>
              </div>
              <div className="row">
                <button className="workout-secondary-button focus-ring" type="button" onClick={() => addThirtySeconds()}>
                  {copy.addThirtySeconds}
                </button>
                <button className="workout-secondary-button focus-ring" type="button" onClick={() => skipRestTimer()}>
                  {copy.skip}
                </button>
              </div>
            </Card>
          </section>
        ) : null}

        <div className="stack">
          <Link className="workout-secondary-button focus-ring" href={`/workout/${session.id}/exercise/${exercise.id}/alternatives`}>
            <span className="icon" aria-hidden="true">
              swap_horiz
            </span>
            {copy.alternatives}
          </Link>
          <Link className="workout-secondary-button focus-ring" href={`/workout/${session.id}/exercise/${exercise.id}/safety`}>
            <span className="icon" aria-hidden="true">
              report
            </span>
            {copy.pain}
          </Link>
        </div>

        <div className="sticky-action">
          <button className="button-primary focus-ring" disabled={submitting} type="button" onClick={handleComplete}>
            {submitting ? copy.saving : isFinalSet || completedCount >= exercise.totalSets ? copy.finishWorkout : copy.completeSet}
          </button>
        </div>
      </main>
    </Screen>
  );
}
