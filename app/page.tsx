"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnatomyPreview } from "@/components/anatomy-preview";
import { BrandLogo } from "@/components/brand-logo";
import { AppMenu } from "@/components/app-menu";
import { RemoteAvatar } from "@/components/remote-avatar";
import { useTranslator } from "@/components/locale-provider";
import { useProfileSettingsStore } from "@/components/profile-settings-provider";
import { useProgramStore } from "@/components/program-provider";
import { Screen } from "@/components/screen";
import { Card, IconButton, PrimaryButton, Section, StatTile } from "@/components/ui";
import { useCurrentLocalDateKey } from "@/components/use-current-local-date-key";
import type { ProgramDaySummary } from "@/lib/program-service";

function RestDayHero({ athleteName, day, nextWorkout }: { athleteName: string; day: ProgramDaySummary; nextWorkout: ProgramDaySummary | null }) {
  const { t } = useTranslator();

  return (
    <>
      <section className="section">
        <div className="eyebrow" style={{ color: "#b6ff00" }}>
          {t("today.restDay")}
        </div>
        <h1 className="headline-xl">{t("today.recoveryDay")}</h1>
        <p className="body-lg muted" style={{ marginTop: 12 }}>
          {athleteName} · {day.dateLabel}
        </p>
      </section>

      {nextWorkout ? <Section title={t("today.nextWorkout")} meta={nextWorkout.phase}>
        <Card className="p-16 elevated" style={{ background: "var(--background-charcoal)" }}>
          <div className="row start" style={{ marginBottom: 16 }}>
            <div>
              <span className="pill">{t("today.readyTomorrow")}</span>
              <h2 className="headline-md" style={{ marginTop: 14 }}>
                {nextWorkout.workoutTitle}
              </h2>
              <p className="caption" style={{ marginTop: 6 }}>
                {nextWorkout.templateCode === "WORKOUT_A"
                  ? t("today.posteriorChainEmphasis")
                  : nextWorkout.workoutType}
              </p>
            </div>
            <Link
              aria-label={t("common.startWorkout")}
              className="tap-target focus-ring"
              href={`/workout/${nextWorkout.scheduledWorkoutId}`}
              style={{ background: "var(--accent-primary)", borderRadius: 9999 }}
            >
              <span className="icon filled" style={{ color: "var(--background-deep)" }} aria-hidden="true">
                play_arrow
              </span>
            </Link>
          </div>
          <div className="grid-3">
            <StatTile label={t("today.duration")} value={nextWorkout.duration} />
            <StatTile label={t("today.calories")} value={nextWorkout.nutritionCalories} />
            <StatTile label={t("today.cardio")} value={nextWorkout.cardio} />
          </div>
        </Card>
      </Section> : null}
    </>
  );
}

function TodayContent() {
  const searchParams = useSearchParams();
  const { saved } = useProfileSettingsStore();
  const { getDaySummary, scheduledWorkouts } = useProgramStore();
  const { t } = useTranslator();
  const [menuOpen, setMenuOpen] = useState(false);
  const athleteName = saved.profile.name;
  const activeDateKey = useCurrentLocalDateKey();
  const day = activeDateKey ? getDaySummary(activeDateKey) : null;

  if (!activeDateKey || !day) {
    return null;
  }

  const isRestDay = day.isRestDay || searchParams.get("state") === "rest-day";
  const nextWorkoutDateKey = scheduledWorkouts
    .filter((workout) => workout.scheduled_date > activeDateKey && workout.status !== "cancelled" && workout.status !== "skipped")
    .map((workout) => workout.scheduled_date)
    .sort()[0];
  const nextWorkout = nextWorkoutDateKey ? getDaySummary(nextWorkoutDateKey) : null;

  return (
    <>
      <Screen
        activeTab="today"
        topbar={
          <header className="topbar">
            <IconButton icon="menu" label="Open menu" onClick={() => setMenuOpen(true)} />
            <BrandLogo variant="horizontal" width={128} alt="AthlexForce" />
            <Link href="/profile" aria-label={t("common.profile")} className="focus-ring">
              <RemoteAvatar name={saved.profile.name} avatarPath={saved.profile.avatarPath ?? null} size={44} className="profile-avatar" />
            </Link>
          </header>
        }
      >
        <main className="content">
        {isRestDay ? (
          <RestDayHero athleteName={athleteName} day={day} nextWorkout={nextWorkout} />
        ) : (
          <>
            <section className="section">
              <h1 className="headline-xl">{day.workoutTitle}</h1>
              <p className="body-lg muted" style={{ marginTop: 12 }}>
                {athleteName} · {day.dateLabel}
              </p>
            </section>

            <Section title="" meta="">
              <Card className="p-16">
                <div className="row start" style={{ marginBottom: 16 }}>
                  <div>
                    <span className="pill">{day.phase}</span>
                    <h2 className="headline-md" style={{ marginTop: 14 }}>
                      {day.workoutTitle}
                    </h2>
                    <p className="caption" style={{ marginTop: 6 }}>
                      {day.templateCode === "WORKOUT_A"
                        ? t("today.posteriorChainEmphasis")
                        : day.workoutType}
                    </p>
                  </div>
                  <Link
                    aria-label={t("common.startWorkout")}
                    className="tap-target focus-ring"
                    href={`/workout/${day.scheduledWorkoutId}`}
                    style={{ background: "var(--accent-primary)", borderRadius: 9999 }}
                  >
                    <span className="icon filled" style={{ color: "var(--background-deep)" }} aria-hidden="true">
                      play_arrow
                    </span>
                  </Link>
                </div>

                <div className="grid-3">
                  <StatTile label={t("today.duration")} value={day.duration} />
                  <StatTile label={t("today.volume")} value={day.volume} />
                  <StatTile label={t("today.sets")} value={day.sets} />
                </div>
              </Card>
            </Section>

            <Section title={t("today.targetZones")}>
              <Card className="p-16 elevated" style={{ background: "var(--background-charcoal)" }}>
                <AnatomyPreview focus={day.muscleFocus} />
                <div className="grid-2" style={{ marginTop: 16 }}>
                  <div>
                    <div className="eyebrow">{t("today.primary")}</div>
                    <div className="body-lg" style={{ marginTop: 4 }}>
                      {day.primaryTarget}
                    </div>
                  </div>
                  <div>
                    <div className="eyebrow">{t("today.secondary")}</div>
                    <div className="body-lg" style={{ marginTop: 4 }}>
                      {day.secondaryTarget}
                    </div>
                  </div>
                </div>
              </Card>
            </Section>

            <Section title={t("today.movements")} meta={day.workoutCount}>
              <div className="stack">
                {day.movements.map((movement) => (
                  <Link key={movement.name} href={`/day/${day.dateKey}`} className="list-card focus-ring">
                    {movement.thumbnail ? (
                      <img className="exercise-thumb" src={movement.thumbnail} alt={movement.name} width={48} height={48} />
                    ) : (
                      <div className="exercise-thumb" style={{ display: "grid", placeItems: "center", background: "#1f1f1f" }}>
                        <span className="icon muted" aria-hidden="true" style={{ fontSize: 20 }}>
                          {movement.icon}
                        </span>
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div className="body-md" style={{ fontWeight: 700 }}>
                        {movement.name}
                      </div>
                      <div className="caption">{movement.prescription}</div>
                    </div>
                    <span className="icon muted" aria-hidden="true">
                      chevron_right
                    </span>
                  </Link>
                ))}
              </div>
            </Section>
          </>
        )}

        <div className="page-cta">
          <PrimaryButton href={isRestDay ? `/calendar?date=${day.dateKey}&month=${day.dateKey.slice(0, 7)}-01` : `/workout/${day.scheduledWorkoutId}`} className="focus-ring">
            {isRestDay ? t("common.calendar") : t("common.startWorkout")}
          </PrimaryButton>
        </div>
        </main>
      </Screen>
      <AppMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default function TodayPage() {
  return (
    <Suspense fallback={null}>
      <TodayContent />
    </Suspense>
  );
}
