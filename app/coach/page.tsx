import Link from "next/link";
import { CoachPanelShell } from "@/components/coach-panel-shell";
import { Card, PrimaryButton, Section, StatTile } from "@/components/ui";
import { loadCoachDashboard } from "@/lib/coach/coach-dashboard-service";
import { loadCoachSessionContext } from "@/lib/coach/coach-auth-service";

function AccessDenied() {
  return (
    <CoachPanelShell activeTab="dashboard">
      <section className="section">
        <Card className="p-16">
          <div className="eyebrow">Access denied</div>
          <h1 className="headline-lg" style={{ marginTop: 8 }}>
            Coach access required
          </h1>
          <p className="caption" style={{ marginTop: 10, lineHeight: 1.6 }}>
            This account is not configured as a coach or the coach tables are not available yet.
          </p>
          <div style={{ marginTop: 16 }}>
            <PrimaryButton href="/entry">Go to entry</PrimaryButton>
          </div>
        </Card>
      </section>
    </CoachPanelShell>
  );
}

export default async function CoachDashboardPage() {
  const session = await loadCoachSessionContext();
  if (!session?.isCoach) {
    return <AccessDenied />;
  }

  const dashboard = await loadCoachDashboard(session.client, session.userId).catch(() => null);
  if (!dashboard) {
    return (
      <CoachPanelShell activeTab="dashboard">
        <section className="section">
          <Card className="p-16">
            <div className="eyebrow">Coach panel</div>
            <h1 className="headline-lg" style={{ marginTop: 8 }}>
              Coach data is not ready yet
            </h1>
            <p className="caption" style={{ marginTop: 10, lineHeight: 1.6 }}>
              The coach tables or assignment data are unavailable in this environment.
            </p>
          </Card>
        </section>
      </CoachPanelShell>
    );
  }

  return (
    <CoachPanelShell activeTab="dashboard">
      <section className="section">
        <div className="eyebrow">Coach dashboard</div>
        <h1 className="headline-lg" style={{ marginTop: 8 }}>
          {dashboard.coachName}
        </h1>
        <p className="caption" style={{ marginTop: 10, lineHeight: 1.6 }}>
          Assigned athletes only. Review the athletes that need attention first.
        </p>
      </section>

      <Section title="Queue" meta={`${dashboard.attentionQueue.length} needing attention`}>
        <div className="grid-3">
          <Card className="p-16">
            <StatTile label="Athletes" value={String(dashboard.athletes.length)} meta="Assigned" />
          </Card>
          <Card className="p-16">
            <StatTile label="Reviews" value={String(dashboard.pendingReviews.length)} meta="Awaiting review" />
          </Card>
          <Card className="p-16">
            <StatTile label="Actions" value={String(dashboard.pendingRecommendations.length + dashboard.pendingProposals.length)} meta="Pending decisions" />
          </Card>
        </div>
      </Section>

      <Section title="Needs attention" meta="Deterministic triage">
        <div className="stack">
          {dashboard.attentionQueue.length > 0 ? (
            dashboard.attentionQueue.map((athlete) => (
              <Card key={athlete.athleteId} className="p-16">
                <div className="row start">
                  <div>
                    <div className="headline-md">{athlete.displayName}</div>
                    <p className="caption" style={{ marginTop: 6 }}>
                      {athlete.phaseLabel} · {athlete.goal}
                    </p>
                  </div>
                  <Link className="button-secondary focus-ring" href={`/coach/athletes/${athlete.athleteId}`}>
                    REVIEW
                  </Link>
                </div>
                <div className="stack" style={{ gap: 8, marginTop: 12 }}>
                  {athlete.attentionReasons.slice(0, 3).map((reason) => (
                    <span key={reason} className="progress-chip">
                      {reason}
                    </span>
                  ))}
                </div>
                <p className="caption" style={{ marginTop: 10 }}>
                  Last activity: {athlete.lastActivityAt ?? "No recent activity"}
                </p>
              </Card>
            ))
          ) : (
            <Card className="p-16">
              <p className="caption">No athletes need attention right now.</p>
            </Card>
          )}
        </div>
      </Section>

      <Section title="Quick links">
        <div className="stack">
          <Link className="list-card focus-ring" href="/coach/athletes">
            <div>
              <div className="body-md" style={{ fontWeight: 700 }}>
                Athletes
              </div>
              <div className="caption">Open the full assigned athlete list.</div>
            </div>
          </Link>
          <Link className="list-card focus-ring" href="/coach/reviews">
            <div>
              <div className="body-md" style={{ fontWeight: 700 }}>
                Reviews
              </div>
              <div className="caption">Check-ins, recommendations, and proposals.</div>
            </div>
          </Link>
          <Link className="list-card focus-ring" href="/coach/profile">
            <div>
              <div className="body-md" style={{ fontWeight: 700 }}>
                Profile
              </div>
              <div className="caption">Coach profile and access details.</div>
            </div>
          </Link>
        </div>
      </Section>
    </CoachPanelShell>
  );
}

