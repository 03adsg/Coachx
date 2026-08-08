import Link from "next/link";
import { Screen } from "@/components/screen";
import { coachxExerciseCatalog } from "@/lib/workout-data";

const libraryIds = ["barbell-hip-thrust", "romanian-deadlift", "bulgarian-split-squat", "lat-pulldown", "chest-press"];

export default function ExerciseLibraryPage() {
  const exercises = libraryIds.map((id) => coachxExerciseCatalog.find((exercise) => exercise.id === id) ?? coachxExerciseCatalog[0]);

  return (
    <Screen
      activeTab="progress"
      shellClassName="screen-shell library-shell"
      topbar={
        <header className="library-topbar">
          <div className="library-topbar__avatar">
            <img src="/coachx-avatar.svg" alt="Athlete profile" width={36} height={36} />
          </div>
          <div className="headline-md" style={{ textTransform: "uppercase", fontSize: 32, lineHeight: "38px" }}>
            Exercise Library
          </div>
          <button aria-label="Open profile" className="tap-target focus-ring" type="button" style={{ color: "#c6c6c7" }}>
            <span className="icon" aria-hidden="true">
              person
            </span>
          </button>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <div className="headline-md" style={{ color: "#c9cfb4", fontSize: 18, lineHeight: "26px", fontWeight: 500 }}>
            Your movement reference
          </div>
        </section>

        <section className="section">
          <div className="library-search">
            <span className="icon muted" aria-hidden="true">
              search
            </span>
            <span className="caption" style={{ fontSize: 18, color: "#999" }}>
              Search exercises...
            </span>
          </div>
        </section>

        <section className="section">
          <div className="row" style={{ marginBottom: 12 }}>
            <h2 className="headline-md">Browse by muscle</h2>
            <span className="accent" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
              View Map
            </span>
          </div>
          <div className="library-target-card">
            <div>
              <div className="headline-md" style={{ color: "#b6ff00" }}>
                Targeted
              </div>
              <p className="body-md" style={{ marginTop: 6, color: "var(--text-secondary)" }}>
                Select a zone to filter
              </p>
            </div>
          </div>
        </section>

        <section className="section workout-filter-scroll">
          {["All", "Glutes", "Hamstrings", "Quads", "Back"].map((chip, index) => (
            <button key={chip} className={`workout-filter-chip ${index === 0 ? "active" : ""}`} type="button">
              {chip.toUpperCase()}
            </button>
          ))}
        </section>

        <section className="stack-lg">
          {exercises.map((exercise) => (
            <Link key={exercise.id} href={`/exercises/${exercise.id}`} className="library-item focus-ring">
              <div className="library-item__thumb">
                <img src={exercise.thumbnail ?? "/exercise-placeholder.svg"} alt={exercise.name} />
              </div>
              <div className="library-item__body">
                <div className="headline-md" style={{ fontSize: 24, lineHeight: "28px" }}>
                  {exercise.name}
                </div>
                <div className="caption" style={{ marginTop: 6 }}>
                  <span className="accent">●</span> {exercise.primaryMuscles.map((muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1)).join(" + ")}
                </div>
                <div className="pill" style={{ minHeight: 24, marginTop: 10, padding: "0 10px", background: "rgba(37,37,37,0.95)" }}>
                  {exercise.equipment.toUpperCase()}
                </div>
              </div>
              <span className="icon muted" aria-hidden="true">
                chevron_right
              </span>
            </Link>
          ))}
        </section>
      </main>
    </Screen>
  );
}
