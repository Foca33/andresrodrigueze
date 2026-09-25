"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 768px)";

/** Hydration-safe media query (server snapshot = false, i.e. mobile-first). */
export function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
