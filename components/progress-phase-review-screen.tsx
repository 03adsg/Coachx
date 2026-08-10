"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Screen } from "@/components/screen";
import { Card, PrimaryButton, SecondaryButton } from "@/components/ui";
import { useProgramStore } from "@/components/program-provider";
import { useProgressStore } from "@/components/progress-provider";
import { ProgramChangeProposalPanel } from "@/components/program-change-proposal-panel";
import type { AthleteFeedback } from "@/lib/progress-data";

const feedbackOptions: AthleteFeedback[] = ["Very Good", "Good", "Mixed", "Too Hard", "Too Easy", "Not Sure"];

function PhaseTopbar() {
  return (
    <header className="progress-review-topbar">
      <Link href="/progress" className="progress-review-topbar__button focus-ring" aria-label="Close screen">
        <span className="icon" aria-hidden="true">
          close
        </span>
      </Link>
      <BrandLogo variant="mark" width={34} alt="AthlexForce" />
      <span className="progress-review-topbar__label">PHASE REVIEW</span>
    </header>
  );
}

function ChoiceChip({
  active,
  children,
  onClick
}: {
  active?: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button className={`progress-choice-chip ${active ? "active" : ""}`.trim()} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function PhotoCompareCard({ image, label, accent = false }: { image: string; label: string; accent?: boolean }) {
  return (
    <div className={`progress-review-photo ${accent ? "accent" : ""}`.trim()}>
      <img alt={label} className="progress-review-photo__image" src={image} />
      <span className="progress-review-photo__label">{label}</span>
    </div>
  );
}

function CoachRecommendationPanel({ contextKey }: { contextKey: string }) {
  return <ProgramChangeProposalPanel contextKey={contextKey} contextType="phase_review" />;
}

export function ProgressPhaseReviewScreen() {
  const { state, setAthleteFeedback, setGoalDecision, setPriorityDecision } = useProgressStore();
  const { activeProgram } = useProgramStore();
  const review = state.phaseReview;
  const baselineFront = state.photos.checkpoints[0]?.photos.front.image ?? "/progress-photo-front.svg";
  const currentFront = state.photos.checkpoints[1]?.photos.front.image ?? "/progress-photo-front.svg";
  const recommendationContextKey = activeProgram?.id ?? "phase-review";

  return (
    <Screen shellClassName="progress-flow-shell" topbar={<PhaseTopbar />}>
      <main className="content tight">
        <section className="section progress-hero">
          <h1 className="headline-lg" style={{ textTransform: "uppercase" }}>
            {review.label}
          </h1>
          <div className="progress-phase-timeline progress-phase-timeline--review">
            <span>W1 Base</span>
            <span>W4 Mid</span>
            <span className="accent">W8 Now</span>
          </div>
        </section>

        <section className="section">
          <Card className="progress-review-outcome p-16">
            <div className="row start">
              <div className="eyebrow" style={{ margin: 0 }}>
                OUTCOME
              </div>
              <span className="progress-chip progress-chip--accent">{review.outcome}</span>
            </div>
            <p className="body-md" style={{ marginTop: 12, lineHeight: 1.6 }}>
              {review.summary}
            </p>
          </Card>
        </section>

        <section className="section">
          <h2 className="headline-md" style={{ marginBottom: 12 }}>
            Start → Now
          </h2>
          <div className="progress-review-grid">
            {review.startMeasurements.map((item) => (
              <Card key={item.label} className="progress-review-metric p-16">
                <div className="caption">{item.label.toUpperCase()}</div>
                <div className="headline-md" style={{ marginTop: 8 }}>
                  {item.value}
                </div>
                <div className="caption" style={{ marginTop: 8, color: "var(--accent-primary)" }}>
                  {item.delta}
                </div>
              </Card>
            ))}
          </div>
          <Card className="progress-review-adherence p-16" style={{ marginTop: 16 }}>
            <div className="row start" style={{ marginBottom: 10 }}>
              <div className="eyebrow" style={{ margin: 0 }}>
                TRAINING ADHERENCE
              </div>
              <div className="headline-md" style={{ color: "var(--accent-primary)" }}>
                90%
              </div>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: "90%" }} />
            </div>
          </Card>
        </section>

        <section className="section">
          <h2 className="headline-md" style={{ marginBottom: 12 }}>
            Visual Progress
          </h2>
          <div className="progress-review-photos">
            <PhotoCompareCard accent image={baselineFront} label="WEEK 1" />
            <PhotoCompareCard accent image={currentFront} label="WEEK 8" />
          </div>
          <Link className="progress-mini-action progress-mini-action--block focus-ring" href="/progress/photos/compare" style={{ marginTop: 12 }}>
            COMPARE PHOTOS
          </Link>
        </section>

        <section className="section">
          <h2 className="headline-md" style={{ marginBottom: 12 }}>
            Strength Gains
          </h2>
          <div className="stack">
            {[
              { label: "Hip Thrust", value: "95 kg", delta: "+18.7%" },
              { label: "RDL", value: "80 kg", delta: "+25.0%" }
            ].map((item) => (
              <Card key={item.label} className="progress-review-strength p-16">
                <div className="row start">
                  <div className="row start" style={{ gap: 12 }}>
                    <div className="progress-strength-card__icon" aria-hidden="true">
                      <span className="icon">fitness_center</span>
                    </div>
                    <div className="body-md" style={{ fontWeight: 700 }}>
                      {item.label}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="body-lg">
                      {item.value.split(" ")[0]} <span className="caption">{item.value.split(" ")[1]}</span>
                    </div>
                    <div className="caption" style={{ color: "var(--accent-primary)" }}>
                      {item.delta}
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
                smart_toy
              </span>
              <h3 className="eyebrow" style={{ margin: 0, color: "var(--accent-primary)" }}>
                ATHLEXFORCE INSIGHTS
              </h3>
            </div>
            <p className="body-md" style={{ fontStyle: "italic", lineHeight: 1.6 }}>
              “Your current training structure is working well... Recovery, especially sleep, is the clearest opportunity for improvement moving into Phase 2.”
            </p>
          </Card>
        </section>

        <section className="section">
          <div className="stack">
            <Card className="progress-review-list p-16">
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                WHAT WORKED
              </div>
              <ul className="progress-dialog-list">
                {review.whatWorked.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card className="progress-review-list p-16">
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                WHAT HELD YOU BACK
              </div>
              <ul className="progress-dialog-list">
                {review.whatHeldBack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <section className="section">
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            ATHLETE FEEDBACK
          </div>
          <div className="progress-choice-row">
            {feedbackOptions.map((feedback) => (
              <ChoiceChip
                key={feedback}
                active={review.athleteFeedback[0].value === feedback}
                onClick={() => setAthleteFeedback(feedback)}
              >
                {feedback}
              </ChoiceChip>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="stack">
            <Card className="progress-review-list p-16">
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                GOAL / PRIORITY CONFIRMATION
              </div>
              <div className="progress-choice-row">
                <ChoiceChip active={review.mainGoalDecision.current === "KEEP"} onClick={() => setGoalDecision("KEEP")}>
                  KEEP MAIN GOAL
                </ChoiceChip>
                <ChoiceChip active={review.mainGoalDecision.current === "ADJUST"} onClick={() => setGoalDecision("ADJUST")}>
                  ADJUST GOAL
                </ChoiceChip>
              </div>
              <div className="progress-choice-row" style={{ marginTop: 10 }}>
                <ChoiceChip active={review.priorityDecision.current === "KEEP"} onClick={() => setPriorityDecision("KEEP")}>
                  KEEP PRIORITIES
                </ChoiceChip>
                <ChoiceChip active={review.priorityDecision.current === "ADJUST"} onClick={() => setPriorityDecision("ADJUST")}>
                  EDIT
                </ChoiceChip>
              </div>
            </Card>
            <Card className="progress-review-list p-16">
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                RECOMMENDED NEXT PHASE
              </div>
              <div className="headline-md" style={{ textTransform: "uppercase" }}>
                {review.recommendation.title} — {review.recommendation.duration}
              </div>
              <p className="body-md" style={{ marginTop: 8 }}>
                {review.recommendation.summary}
              </p>
              <ul className="progress-dialog-list" style={{ marginTop: 12 }}>
                {review.recommendation.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <section className="section">
          <CoachRecommendationPanel contextKey={recommendationContextKey} />
        </section>
      </main>

      <div className="progress-fixed-actions">
        <PrimaryButton href="/progress" className="focus-ring">
          BUILD PHASE 2
        </PrimaryButton>
        <SecondaryButton className="focus-ring" onClick={() => window.history.back()}>
          BACK
        </SecondaryButton>
      </div>
    </Screen>
  );
}

