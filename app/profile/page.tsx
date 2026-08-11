"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/screen";
import { Card } from "@/components/ui";
import { useAuthStore } from "@/components/auth-provider";
import { RemoteAvatar } from "@/components/remote-avatar";
import { useTranslator } from "@/components/locale-provider";
import { useProfileSettingsStore } from "@/components/profile-settings-provider";
import { useProgramStore } from "@/components/program-provider";

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuthStore();
  const { saved, pendingReview } = useProfileSettingsStore();
  const { program } = useProgramStore();
  const { t } = useTranslator();

  return (
    <Screen
      activeTab="profile"
      shellClassName="screen-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            {t("profile.hubTitle")}
          </div>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <div className="row start">
            <div>
              <h1 className="headline-lg">{saved.profile.name}</h1>
              <p className="caption" style={{ marginTop: 8 }}>
                {t("profile.provisionalHub")}
              </p>
              {auth.user?.email ? (
                <p className="caption" style={{ marginTop: 4 }}>
                  {t("profile.signedInAs")} {auth.user.email}
                </p>
              ) : null}
            </div>
            <RemoteAvatar name={saved.profile.name} avatarPath={saved.profile.avatarPath ?? null} size={52} className="profile-avatar" />
          </div>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="row">
              <div>
                <div className="eyebrow">{t("profile.currentPlan")}</div>
                <h2 className="headline-md" style={{ marginTop: 6 }}>
                  {saved.goals.mainGoal}
                </h2>
              </div>
              <span className="pill">{program?.status === "active" ? t("profile.active") : t("profile.proposed")}</span>
            </div>
            <div className="grid-3" style={{ marginTop: 16 }}>
              <div>
                <div className="headline-md">{saved.trainingPreferences.daysPerWeek}</div>
                <div className="eyebrow" style={{ marginTop: 4 }}>
                  {t("profile.daysPerWeek")}
                </div>
              </div>
              <div>
                <div className="headline-md">{saved.trainingPreferences.duration}</div>
                <div className="eyebrow" style={{ marginTop: 4 }}>
                  {t("profile.duration")}
                </div>
              </div>
              <div>
                <div className="headline-md">{saved.trainingPreferences.location}</div>
                <div className="eyebrow" style={{ marginTop: 4 }}>
                  {t("profile.location")}
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="section stack">
          <Link href="/profile/preferences" className="focus-ring">
            <Card className="p-16">
              <div className="row start">
                <div>
                  <div className="eyebrow">Profile editing</div>
                  <div className="body-md" style={{ marginTop: 6, fontWeight: 700 }}>
                    {t("profile.profileEditing")}
                  </div>
                </div>
                <span className="icon" aria-hidden="true">
                  chevron_right
                </span>
              </div>
            </Card>
          </Link>

          <Link href="/profile/notifications" className="focus-ring">
            <Card className="p-16">
              <div className="row start">
                <div>
                  <div className="eyebrow">Notifications</div>
                  <div className="body-md" style={{ marginTop: 6, fontWeight: 700 }}>
                    {t("profile.notifications")}
                  </div>
                </div>
                <span className="icon" aria-hidden="true">
                  chevron_right
                </span>
              </div>
            </Card>
          </Link>

          <Link href="/program" className="focus-ring">
            <Card className="p-16">
              <div className="row start">
                <div>
                  <div className="eyebrow">Program overview</div>
                  <div className="body-md" style={{ marginTop: 6, fontWeight: 700 }}>
                    {t("profile.programOverview")}
                  </div>
                </div>
                <span className="icon" aria-hidden="true">
                  chevron_right
                </span>
              </div>
            </Card>
          </Link>
        </section>

        <section className="section">
          <Card className="elevated p-16">
            <div className="row start">
              <div>
                <div className="eyebrow">Athlete settings</div>
                <p className="body-md" style={{ marginTop: 6, color: "var(--text-secondary)" }}>
                  This app is ready to connect to your athlete data without changing the experience.
                </p>
                {pendingReview ? (
                  <p className="caption" style={{ marginTop: 10 }}>
                    Pending review: {pendingReview.title}
                  </p>
                ) : null}
              </div>
            </div>
          </Card>
        </section>

        <div className="stack">
          <Link href="/profile/preferences" className="button-secondary focus-ring" style={{ width: "100%" }}>
            Open Settings
          </Link>
          <Link href="/profile/security" className="button-secondary focus-ring" style={{ width: "100%" }}>
            Account / Security
          </Link>
          {auth.isConfigured ? (
            <button
              className="button-secondary focus-ring"
              type="button"
              onClick={async () => {
                await auth.signOut();
                router.push("/entry");
              }}
              style={{ width: "100%" }}
            >
              Sign out
            </button>
          ) : null}
        </div>
      </main>
    </Screen>
  );
}
