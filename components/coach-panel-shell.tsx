"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { Screen } from "@/components/screen";

const tabs = [
  { href: "/coach", label: "Dashboard", key: "dashboard" },
  { href: "/coach/athletes", label: "Athletes", key: "athletes" },
  { href: "/coach/reviews", label: "Reviews", key: "reviews" },
  { href: "/coach/profile", label: "Profile", key: "profile" }
] as const;

export function CoachPanelShell({
  activeTab,
  children,
  topLabel = "Coach Panel"
}: {
  activeTab: (typeof tabs)[number]["key"];
  children: ReactNode;
  topLabel?: string;
}) {
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
        <nav className="coach-tabs" aria-label="Coach navigation">
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

