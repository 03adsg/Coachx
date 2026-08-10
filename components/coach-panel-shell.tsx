"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { Screen } from "@/components/screen";
import { useTranslator } from "@/components/locale-provider";

export function CoachPanelShell({
  activeTab,
  children,
  topLabel = "Coach Panel"
}: {
  activeTab: "dashboard" | "athletes" | "reviews" | "profile";
  children: ReactNode;
  topLabel?: string;
}) {
  const { t } = useTranslator();
  const tabs = [
    { href: "/coach", label: t("coach.dashboard"), key: "dashboard" as const },
    { href: "/coach/athletes", label: t("coach.athletes"), key: "athletes" as const },
    { href: "/coach/reviews", label: t("coach.reviews"), key: "reviews" as const },
    { href: "/coach/profile", label: t("coach.profile"), key: "profile" as const }
  ];

  return (
    <Screen
      shellClassName="coach-panel-shell"
      topbar={
        <header className="topbar coach-topbar">
          <BrandLogo variant="horizontal" width={124} alt="AthlexForce" />
          <span className="progress-chip progress-chip--accent">{topLabel.toUpperCase()}</span>
        </header>
      }
    >
      <main className="content coach-content">
        <nav className="coach-tabs" aria-label={t("common.coachPanel")}>
          {tabs.map((tab) => (
            <Link key={tab.key} href={tab.href} className={`coach-tab ${tab.key === activeTab ? "active" : ""}`.trim()}>
              {tab.label}
            </Link>
          ))}
        </nav>
        {children}
      </main>
    </Screen>
  );
}
