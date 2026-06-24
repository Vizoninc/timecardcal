"use client";

/**
 * Ad slot PLACEHOLDER. No live ad network code ships here.
 *
 * Key behaviors for ad-safe UX + Core Web Vitals:
 *  - Reserves fixed dimensions so inserting an ad later causes no layout shift.
 *  - Below-the-fold slots lazy-mount via IntersectionObserver.
 *  - Hidden entirely in print (and visually marked "Advertisement").
 *  - Never rendered inside or adjacent to form controls/buttons.
 *
 * To go live, replace the inner placeholder with your ad tag, keeping the
 * outer reserved-size container intact.
 */

import { useEffect, useRef, useState } from "react";

type SlotSize = "leaderboard" | "inContent" | "rail";

interface AdSlotProps {
  id: string;
  size: SlotSize;
  /** Lazy-mount when scrolled near viewport. Use for below-the-fold slots. */
  lazy?: boolean;
  className?: string;
}

// Reserved boxes (min-heights) prevent cumulative layout shift.
const SIZES: Record<SlotSize, { className: string; label: string }> = {
  // ~728x90 desktop / responsive banner on mobile.
  leaderboard: {
    className: "h-[90px] w-full max-w-[728px]",
    label: "Leaderboard ad",
  },
  // Responsive in-content rectangle, reserves ~250px tall.
  inContent: {
    className: "h-[250px] w-full max-w-[336px]",
    label: "In-content ad",
  },
  // Desktop right rail.
  rail: {
    className: "h-[600px] w-[300px]",
    label: "Right-rail ad",
  },
};

export function AdSlot({ id, size, lazy = false, className = "" }: AdSlotProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(!lazy);

  useEffect(() => {
    if (!lazy || visible) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [lazy, visible]);

  const sz = SIZES[size];

  return (
    <div
      ref={ref}
      // The outer wrapper always reserves space, even before the ad mounts.
      className={`mx-auto flex ${sz.className} items-center justify-center ${className} print:hidden`}
      role="complementary"
      aria-label="Advertisement"
      data-ad-slot={id}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400">
        <span className="select-none">Advertisement</span>
        {visible ? (
          <span className="mt-1 normal-case text-slate-400">
            {sz.label} ({id})
          </span>
        ) : (
          <span className="sr-only">Ad will load when scrolled into view</span>
        )}
      </div>
    </div>
  );
}
