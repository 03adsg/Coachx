import { Screen } from "@/components/screen";
import { Card, IconButton } from "@/components/ui";
import { coachxProgressMetrics } from "@/lib/coachx-data";

export default function ProgressPage() {
  return (
    <Screen
      activeTab="progress"
      shellClassName="screen-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            Progress
          </div>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <div className="row start">
            <div>
              <h1 className="headline-lg">Your Training Trend</h1>
              <p className="caption" style={{ marginTop: 8 }}>
                Weekly movement, bodyweight, and adherence tracked from the current phase.
              </p>
            </div>
            <IconButton icon="calendar_month" label="Choose range" />
          </div>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="row start" style={{ marginBottom: 16 }}>
              <div>
                <div className="eyebrow">Volume</div>
                <div className="headline-md" style={{ marginTop: 6 }}>
                  +8% this week
                </div>
              </div>
              <span className="pill">On track</span>
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: "78%" }} />
            </div>

            <div className="grid-3" style={{ marginTop: 16 }}>
              {coachxProgressMetrics.map((metric) => (
                <div key={metric.label}>
                  <div className="headline-md">{metric.value}</div>
                  <div className="eyebrow" style={{ marginTop: 8 }}>
                    {metric.label}
                  </div>
                  <div className="caption">{metric.delta}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="section">
          <div className="row" style={{ marginBottom: 12 }}>
            <h2 className="headline-md">Strength</h2>
            <span className="eyebrow" style={{ margin: 0 }}>
              Last 30 days
            </span>
          </div>
          <div className="stack">
            {[
              ["Hip Thrust", "82.5 kg", "+5 kg"],
              ["Romanian Deadlift", "32.5 kg", "+2.5 kg"],
              ["Bench Press", "52.5 kg", "+2.5 kg"]
            ].map(([label, value, delta]) => (
              <Card key={label} className="p-16">
                <div className="row">
                  <div>
                    <div className="body-md" style={{ fontWeight: 700 }}>
                      {label}
                    </div>
                    <div className="caption" style={{ marginTop: 4 }}>
                      Best working set
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="headline-md">{value}</div>
                    <div className="accent" style={{ fontSize: 12, lineHeight: "16px", marginTop: 4 }}>
                      {delta}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="row start">
              <div>
                <div className="eyebrow">Consistency</div>
                <p className="headline-md" style={{ marginTop: 6 }}>
                  5 training days completed
                </p>
              </div>
              <span className="icon accent filled" aria-hidden="true">
                check_circle
              </span>
            </div>
            <div className="stack" style={{ marginTop: 16 }}>
              <div>
                <div className="row" style={{ marginBottom: 8 }}>
                  <span className="caption">Training</span>
                  <span className="caption">5 / 7</span>
                </div>
                <div className="tiny-progress-track">
                  <div className="tiny-progress-fill" style={{ width: "71%" }} />
                </div>
              </div>
              <div>
                <div className="row" style={{ marginBottom: 8 }}>
                  <span className="caption">Nutrition</span>
                  <span className="caption">4 / 7</span>
                </div>
                <div className="tiny-progress-track">
                  <div className="tiny-progress-fill" style={{ width: "57%" }} />
                </div>
              </div>
              <div>
                <div className="row" style={{ marginBottom: 8 }}>
                  <span className="caption">Recovery</span>
                  <span className="caption">6 / 7</span>
                </div>
                <div className="tiny-progress-track">
                  <div className="tiny-progress-fill" style={{ width: "86%" }} />
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </Screen>
  );
}
