import Link from "next/link";
import type { BottomTab } from "@/lib/coachx-data";

const tabs: Array<{ href: string; label: string; icon: string; id: BottomTab }> = [
  { href: "/", label: "Today", icon: "today", id: "today" },
  { href: "/calendar", label: "Calendar", icon: "calendar_today", id: "calendar" },
  { href: "/progress", label: "Progress", icon: "insights", id: "progress" },
  { href: "/profile", label: "Profile", icon: "person", id: "profile" }
];

interface BottomNavProps {
  active: BottomTab;
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {tabs.map((tab) => (
        <Link key={tab.id} href={tab.href} className={`nav-item ${tab.id === active ? "active" : ""}`}>
          <span className={`icon ${tab.id === active ? "filled" : ""}`} aria-hidden="true">
            {tab.icon}
          </span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
