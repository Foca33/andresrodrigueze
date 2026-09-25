"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Hydration-safe reduced-motion flag.
 * Server and first client render both return `false`; React then re-renders
 * with the real value, so SSR markup never mismatches (Motion's own hook
 * reads the media query synchronously on the client's first render).
 */
export function useReduced(): boolean {
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
