"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useWorkoutStore } from "@/components/workout-provider";
import { getExerciseDefinition, getWorkoutExercise } from "@/lib/workout-data";

const locations = ["Neck", "Shoulder", "Upper Back", "Lower Back", "Elbow", "Hip", "Glute", "Knee"] as const;

export default function SafetyLocationPage() {
  const params = useParams<{ exerciseId: string }>();
  const router = useRouter();
  const { session, updateSafety } = useWorkoutStore();
  const exercise = getWorkoutExercise(session, params?.exerciseId ?? session.exercises[0].id);
  const definition = getExerciseDefinition(exercise.performedExerciseId);

  return (
    <Screen
      shellClassName="screen-shell workout-shell"
      topbar={
        <header className="workout-section-topbar">
          <button aria-label="Back" className="tap-target focus-ring" type="button" onClick={() => router.back()}>
            <span className="icon" aria-hidden="true">
              arrow_back
            </span>
          </button>
          <div className="headline-md" style={{ fontSize: 20, textTransform: "uppercase" }}>
            Adjust Session
          </div>
          <span className="tap-target" />
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <Card className="workout-safety-exercise-card">
            <div className="eyebrow" style={{ color: "#b6ff00" }}>
              Step 02
            </div>
            <div className="headline-lg" style={{ marginTop: 8 }}>
              Where do you feel it?
            </div>
            <div className="caption" style={{ marginTop: 6 }}>
              {definition.name}
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="workout-safety-map">
            <div className="workout-safety-map__figure">
              <span className="workout-safety-map__body" aria-hidden="true" />
              <span className="workout-safety-map__marker" aria-hidden="true" />
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="workout-chip-row">
            {locations.map((location) => (
              <button
                key={location}
                className={`workout-filter-chip ${session.safety.location === location.toLowerCase() ? "active" : ""}`}
                type="button"
                onClick={() => updateSafety({ location: location.toLowerCase() })}
              >
                {location.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <Card className="workout-detail-card">
            <div className="eyebrow">Step 03</div>
            <div className="headline-md" style={{ marginTop: 6 }}>
              How intense is it?
            </div>
            <div className="caption" style={{ marginTop: 6 }}>
              Current rating: {session.safety.intensity} / 10
            </div>
          </Card>
        </section>

        <div className="sticky-action">
          <Link className="button-primary focus-ring" href={`/workout/${session.id}/exercise/${exercise.id}/safety/resolution`}>
            Continue
          </Link>
        </div>
      </main>
    </Screen>
  );
}
