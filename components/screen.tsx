"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { BottomNav } from "@/components/bottom-nav";
import type { BottomTab } from "@/lib/coachx-data";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { screenEnter, cardStagger } from "@/motion/transitions";
import type { ReactNode } from "react";

interface ScreenProps {
  children: ReactNode;
  activeTab?: BottomTab;
  shellClassName?: string;
  topbar?: ReactNode;
}

export function Screen({ children, activeTab, shellClassName, topbar }: ScreenProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const context = gsap.context(() => {
      const motionTargets = root.querySelectorAll(".topbar, .card, .list-card, .day-cell");
      if (reducedMotion) {
        gsap.set(motionTargets, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(root, screenEnter.from, screenEnter.to);
      if (motionTargets.length > 0) {
        gsap.fromTo(motionTargets, cardStagger.from, {
          ...cardStagger.to,
          stagger: motionTargets.length > 12 ? 0.02 : cardStagger.stagger
        });
      }
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div className="app-frame">
      <div ref={rootRef} className={`screen ${activeTab ? "with-bottom-nav" : ""} ${shellClassName ?? ""}`.trim()}>
        {topbar}
        {children}
      </div>
      {activeTab ? <BottomNav active={activeTab} /> : null}
    </div>
  );
}
