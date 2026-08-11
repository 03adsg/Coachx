"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/auth-provider";
import { RemoteAvatar } from "@/components/remote-avatar";
import { useProfileSettingsStore } from "@/components/profile-settings-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const primaryItems = [
  { href: "/", label: "Today", icon: "today" },
  { href: "/calendar", label: "Calendar", icon: "calendar_today" },
  { href: "/nutrition", label: "Nutrition", icon: "restaurant" },
  { href: "/progress", label: "Progress", icon: "insights" },
  { href: "/program", label: "Program", icon: "view_agenda" }
];

const secondaryItems = [
  { href: "/profile", label: "Profile", detail: "Identity and current plan" },
  { href: "/profile/preferences", label: "Settings", detail: "Name, goals, training, nutrition" },
  { href: "/profile/notifications", label: "Notifications", detail: "Reminders and quiet hours" },
  { href: "/profile/security", label: "Account / Security", detail: "Sign-in and password" }
];

export function AppMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const auth = useAuthStore();
  const { saved } = useProfileSettingsStore();
  const [isCoach, setIsCoach] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    sheetRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    let active = true;

    async function hydrateCoachState() {
      if (!open || !auth.user?.id) {
        setIsCoach(false);
        return;
      }

      const client = getSupabaseBrowserClient();
      if (!client) {
        setIsCoach(false);
        return;
      }

      const { data } = await client.from("coach_profiles").select("id").eq("user_id", auth.user.id).maybeSingle();
      if (!active) {
        return;
      }

      setIsCoach(Boolean(data));
    }

    void hydrateCoachState();

    return () => {
      active = false;
    };
  }, [auth.user?.id, open]);

  const coachItems = useMemo(
    () =>
      isCoach
        ? [
            { href: "/coach", label: "Coach Panel", detail: "Athletes, reviews, and actions" },
            { href: "/coach/profile", label: "Coach Profile", detail: "Coach identity and avatar" }
          ]
        : [],
    [isCoach]
  );

  if (!open) {
    return null;
  }

  return (
    <div className="app-menu" role="presentation">
      <button aria-label="Close menu" className="app-menu__backdrop" onClick={onClose} type="button" />
      <aside aria-labelledby="app-menu-title" aria-modal="true" className="app-menu__sheet" ref={sheetRef} role="dialog" tabIndex={-1}>
        <div className="app-menu__header">
          <div className="app-menu__brand">
            <div className="app-menu__title-row">
              <div className="eyebrow" id="app-menu-title" style={{ color: "#c6c6c7" }}>
                ATHLEXFORCE
              </div>
              <button className="tap-target focus-ring app-menu__close" onClick={onClose} type="button" aria-label="Close menu">
                <span className="icon" aria-hidden="true">
                  close
                </span>
              </button>
            </div>
            <div className="app-menu__profile">
              <RemoteAvatar name={saved.profile.name} avatarPath={saved.profile.avatarPath ?? null} size={48} className="profile-avatar" />
              <div style={{ minWidth: 0 }}>
                <div className="body-md" style={{ fontWeight: 700 }}>
                  {saved.profile.name}
                </div>
                <div className="caption" style={{ marginTop: 4 }}>
                  {auth.user?.email ?? "Signed in athlete"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="app-menu__body">
          <div className="app-menu__section">
            <div className="eyebrow">Primary</div>
            <div className="app-menu__list">
              {primaryItems.map((item) => (
                <Link key={item.href} className="app-menu__item focus-ring" href={item.href} onClick={onClose}>
                  <span className="icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="app-menu__section">
            <div className="eyebrow">Secondary</div>
            <div className="app-menu__list">
              {secondaryItems.map((item) => (
                <Link key={item.href} className="app-menu__item app-menu__item--stack focus-ring" href={item.href} onClick={onClose}>
                  <span className="body-md" style={{ fontWeight: 700 }}>
                    {item.label}
                  </span>
                  <span className="caption">{item.detail}</span>
                </Link>
              ))}
            </div>
          </div>

          {coachItems.length > 0 ? (
            <div className="app-menu__section">
              <div className="eyebrow">Coach</div>
              <div className="app-menu__list">
                {coachItems.map((item) => (
                  <Link key={item.href} className="app-menu__item app-menu__item--stack focus-ring" href={item.href} onClick={onClose}>
                    <span className="body-md" style={{ fontWeight: 700 }}>
                      {item.label}
                    </span>
                    <span className="caption">{item.detail}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="app-menu__footer">
          <button
            className="button-secondary focus-ring"
            type="button"
            onClick={async () => {
              await auth.signOut();
              onClose();
              router.push("/entry");
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
    </div>
  );
}
