"use client";

import Link from "next/link";
import { Screen } from "@/components/screen";
import { Card, PrimaryButton, SecondaryButton } from "@/components/ui";
import { useProgressStore } from "@/components/progress-provider";

function TrendTopbar() {
  return (
    <header className="progress-trend-topbar">
      <Link href="/progress" className="progress-trend-topbar__back focus-ring" aria-label="Back">
        <span className="icon" aria-hidden="true">
          arrow_back
        </span>
      </Link>
      <div>
        <h1 className="headline-md">PROGRESS TRENDS</h1>
        <p className="caption" style={{ marginTop: 4 }}>
          Your progress beyond a single number.
        </p>
      </div>
    </header>
  );
}

function TrendToggle() {
  return (
    <div className="progress-segment-row">
      <button className="progress-segment active" type="button">
        4 WEEKS
      </button>
      <button className="progress-segment" type="button">
        8 WEEKS
      </button>
      <button className="progress-segment" type="button">
        12 WEEKS
      </button>
      <button className="progress-segment" type="button">
        ALL
      </button>
    </div>
  );
}

function TrendChart({ values, accentValues }: { values: number[]; accentValues: number[] }) {
  const maxValue = Math.max(...values, ...accentValues);
  const minValue = Math.min(...values, ...accentValues);
  const range = Math.max(1, maxValue - minValue);

  const buildPath = (series: number[]) =>
    series
      .map((value, index) => {
        const x = (index / Math.max(1, series.length - 1)) * 100;
        const y = 100 - ((value - minValue) / range) * 78 - 10;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

  return (
    <figure className="progress-chart">
      <div className="progress-chart__canvas">
        <svg className="progress-chart__svg" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
          <path d={buildPath(values)} fill="none" stroke="#ffffff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {values.map((value, index) => {
            const x = (index / Math.max(1, values.length - 1)) * 100;
            const y = 100 - ((value - minValue) / range) * 78 - 10;
            return <circle key={`weight-${index}`} cx={x} cy={y} r="2.4" fill="#ffffff" />;
          })}
          <path d={buildPath(accentValues)} fill="none" stroke="#B6FF00" strokeDasharray="4,4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {accentValues.map((value, index) => {
            const x = (index / Math.max(1, accentValues.length - 1)) * 100;
            const y = 100 - ((value - minValue) / range) * 78 - 10;
            return <circle key={`waist-${index}`} cx={x} cy={y} r="2.6" fill="#B6FF00" />;
          })}
        </svg>
      </div>
      <figcaption className="progress-chart__caption">
        <span>
          <span className="progress-chart__dot" style={{ background: "#fff" }} />
          Weight
        </span>
        <span>
          <span className="progress-chart__dot" style={{ background: "#B6FF00" }} />
          Waist
        </span>
      </figcaption>
      <div className="caption" style={{ marginTop: 12 }}>
        62.8 · 62.9 · 62.8 · 62.8
      </div>
    </figure>
  );
}

export function ProgressTrendsScreen() {
  const { state } = useProgressStore();

  return (
    <Screen shellClassName="progress-flow-shell" topbar={<TrendTopbar />}>
      <main className="content tight">
        <section className="section">
          <TrendToggle />
        </section>

        <section className="section">
          <Card className="progress-trend-hero p-16">
            <div className="row start" style={{ alignItems: "flex-start" }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>
                  CURRENT TREND
                </div>
                <h2 className="headline-md" style={{ textTransform: "uppercase" }}>
                  {state.trends.currentTrendLabel}
                </h2>
              </div>
              <span className="progress-chip progress-chip--accent">{state.trends.currentTrendStatus}</span>
            </div>
            <p className="body-md" style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-quiet)" }}>
              {state.trends.currentTrendSummary}
            </p>
          </Card>
        </section>

        <section className="section">
          <div className="progress-trend-grid">
            {state.trends.keyMetrics.map((metric) => (
              <Card key={metric.label} className={`progress-trend-tile p-16 ${metric.accent ? "accent" : ""}`.trim()}>
                <div className="caption">{metric.label.toUpperCase()}</div>
                <div className="headline-md" style={{ marginTop: 8 }}>
                  {metric.value}
                </div>
                <div className="caption" style={{ marginTop: 8, color: "var(--accent-primary)" }}>
                  {metric.delta}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="headline-md" style={{ marginBottom: 12 }}>
            Body Trends
          </h2>
          <Card className="progress-chart-card p-16">
            <div className="caption" style={{ marginBottom: 16 }}>
              WEIGHT VS WAIST (4W)
            </div>
            <TrendChart values={state.trends.bodyTrendSeries[0].points.map((point) => point.value)} accentValues={state.trends.bodyTrendSeries[0].points.map((point) => point.value - (point.value > 63 ? 1.2 : 1.0))} />
          </Card>
        </section>

        <section className="section">
          <h2 className="headline-md" style={{ marginBottom: 12 }}>
            Strength Progression
          </h2>
          <div className="stack">
            {state.trends.strengthTrends.map((trend) => (
              <Card key={trend.movement} className="progress-strength-card p-16">
                <div className="row start">
                  <div className="row start" style={{ gap: 12 }}>
                    <div className="progress-strength-card__icon" aria-hidden="true">
                      <span className="icon">fitness_center</span>
                    </div>
                    <div>
                      <div className="body-md" style={{ fontWeight: 700 }}>
                        {trend.movement}
                      </div>
                      <div className="caption">Estimated 1RM</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="body-lg">
                      {trend.current} <span className="caption">{trend.unit}</span>
                    </div>
                    <div className="caption" style={{ color: "var(--accent-primary)" }}>
                      +{trend.current - trend.previous}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="section">
          <Card className="progress-insight-card p-16">
            <div className="row start" style={{ marginBottom: 8 }}>
              <span className="icon filled accent" aria-hidden="true">
                psychology
              </span>
              <h3 className="eyebrow" style={{ margin: 0, color: "var(--accent-primary)" }}>
                ATHLEXFORCE INSIGHT
              </h3>
            </div>
            <p className="body-md" style={{ lineHeight: 1.6 }}>
              {state.trends.coachInsight}
            </p>
          </Card>
        </section>

        <section className="section">
          <div className="stack">
            <Card className="progress-link-card p-16">
              <div className="row start">
                <div>
                  <div className="body-md" style={{ fontWeight: 700 }}>
                    MEASUREMENTS
                  </div>
                  <p className="caption" style={{ marginTop: 4 }}>
                    Review the latest objective checkpoint.
                  </p>
                </div>
                <Link href="/progress/measurements" className="progress-mini-action focus-ring">
                  OPEN
                </Link>
              </div>
            </Card>
            <Card className="progress-link-card p-16">
              <div className="row start">
                <div>
                  <div className="body-md" style={{ fontWeight: 700 }}>
                    PROGRESS PHOTOS
                  </div>
                  <p className="caption" style={{ marginTop: 4 }}>
                    Compare the current checkpoint and baseline.
                  </p>
                </div>
                <Link href="/progress/photos" className="progress-mini-action focus-ring">
                  OPEN
                </Link>
              </div>
            </Card>
          </div>
        </section>

        <section className="section">
          <Card className="progress-support-card p-16">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              PROGRAM PHASE TIMELINE
            </div>
            <div className="progress-phase-timeline">
              <span>W1 Base</span>
              <span>W4 Mid</span>
              <span className="accent">W8 Now</span>
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="progress-support-card p-16">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              WEEKLY FEEDBACK
            </div>
            <div className="body-md" style={{ fontWeight: 700 }}>
              {state.trends.weeklyFeedback[0].value}
            </div>
            <p className="caption" style={{ marginTop: 6 }}>
              {state.trends.weeklyFeedback[0].note}
            </p>
          </Card>
        </section>

        <section className="section">
          <Card className="progress-support-card p-16">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              NEXT FOCUS
            </div>
            <p className="body-md">{state.trends.nextFocus}</p>
          </Card>
        </section>

        <div className="stack">
          <PrimaryButton href="/progress/phase-review" className="focus-ring">
            PHASE REVIEW
          </PrimaryButton>
          <SecondaryButton className="focus-ring" onClick={() => window.history.back()}>
            BACK
          </SecondaryButton>
        </div>
      </main>
    </Screen>
  );
}
