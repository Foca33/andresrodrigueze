"use client";

import { useEffect } from "react";
import { captureAttribution, track } from "@/lib/analytics";

/** Captures attribution on landing and reports scroll depth (25 / 50 / 75 / 100 %). No UI. */
export function Analytics() {
  useEffect(() => {
    captureAttribution();
    const fired = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      [25, 50, 75, 100].forEach((t) => {
        if (pct >= t - 0.5 && !fired.has(t)) {
          fired.add(t);
          track("scroll_depth", { percent: t });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
