import { Screen } from "@/components/screen";
import { Card, SecondaryButton } from "@/components/ui";
import { coachxDemoState, coachxProfile } from "@/lib/coachx-data";

export default function ProfilePage() {
  return (
    <Screen
      activeTab="profile"
      shellClassName="screen-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            Profile
          </div>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <div className="row start">
              <div>
              <h1 className="headline-lg">{coachxDemoState.athlete.name}</h1>
              <p className="caption" style={{ marginTop: 8 }}>
                Athlete profile and foundation settings
              </p>
            </div>
            <img
              className="profile-avatar"
              src="/coachx-avatar.svg"
              alt="Athlete profile"
              width={52}
              height={52}
            />
          </div>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="row">
              <div>
                <div className="eyebrow">Current plan</div>
                <h2 className="headline-md" style={{ marginTop: 6 }}>
                  {coachxDemoState.athlete.goal}
                </h2>
              </div>
              <span className="pill">Active</span>
            </div>
            <div className="grid-3" style={{ marginTop: 16 }}>
              <div>
                <div className="headline-md">4</div>
                <div className="eyebrow" style={{ marginTop: 4 }}>
                  Days / week
                </div>
              </div>
              <div>
                <div className="headline-md">60-75</div>
                <div className="eyebrow" style={{ marginTop: 4 }}>
                  Minutes
                </div>
              </div>
              <div>
                <div className="headline-md">Full</div>
                <div className="eyebrow" style={{ marginTop: 4 }}>
                  Gym access
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="stack">
            {coachxProfile.map((section) => (
              <Card key={section.label} className="p-16">
                <div className="row start">
                  <div>
                    <div className="eyebrow">{section.label}</div>
                    <div className="body-md" style={{ marginTop: 6 }}>
                      {section.value}
                    </div>
                  </div>
                  <button className="accent focus-ring" type="button" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                    Edit
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="section">
          <Card className="elevated p-16">
            <div className="row start">
              <div>
                <div className="eyebrow">Development mode</div>
                <p className="body-md" style={{ marginTop: 6, color: "var(--text-secondary)" }}>
                  This build uses local fixture data and can later switch to Supabase without changing the UI.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <div className="stack">
          <SecondaryButton className="focus-ring" style={{ width: "100%" }}>
            Open Settings
          </SecondaryButton>
        </div>
      </main>
    </Screen>
  );
}
