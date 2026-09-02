import { useEffect, useState } from "react";
import { useTranslator } from "@/components/locale-provider";
import Link from "next/link";
import type { BottomTab } from "@/lib/coachx-data";

interface BottomNavProps {
  active: BottomTab;
}

export function BottomNav({ active }: BottomNavProps) {
  const { t } = useTranslator();
  const [optimisticNutritionActive, setOptimisticNutritionActive] = useState(false);

  useEffect(() => {
    if (active === "nutrition") {
      setOptimisticNutritionActive(false);
    }
  }, [active]);

  const tabs: Array<{ href: string; label: string; icon: string; id: BottomTab }> = [
    { href: "/", label: t("nav.today"), icon: "today", id: "today" },
    { href: "/calendar", label: t("nav.calendar"), icon: "calendar_today", id: "calendar" },
    { href: "/nutrition", label: t("nav.nutrition"), icon: "restaurant", id: "nutrition" },
    { href: "/progress", label: t("nav.progress"), icon: "insights", id: "progress" },
    { href: "/profile", label: t("nav.profile"), icon: "person", id: "profile" }
  ];

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={`nav-item ${tab.id === active || (tab.id === "nutrition" && optimisticNutritionActive) ? "active" : ""}`}
          aria-current={tab.id === active ? "page" : undefined}
          onClick={() => {
            if (tab.id === "nutrition" && active !== "nutrition") {
              setOptimisticNutritionActive(true);
            }
          }}
        >
          <span className={`icon ${tab.id === active || (tab.id === "nutrition" && optimisticNutritionActive) ? "filled" : ""}`} aria-hidden="true">
            {tab.icon}
          </span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
