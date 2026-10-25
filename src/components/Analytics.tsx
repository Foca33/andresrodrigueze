"use client";

import { useEffect } from "react";
import { captureAttribution, posthogEnabled, setPosthog, track } from "@/lib/analytics";

/**
 * Captura la atribución al llegar (utm, TikTok…), mide el scroll (25 / 50 / 75 / 100 %) y los segundos
 * de lectura activa (30 y 60 s con la pestaña visible), y carga PostHog (visitas, tiempo en página).
 * Sin interfaz. PostHog solo se carga si NEXT_PUBLIC_POSTHOG_KEY existe.
 */
export function Analytics() {
  useEffect(() => {
    captureAttribution();

    // PostHog: sin cookies (almacenamiento local), sin captura automática de clics y respetando "No rastrear".
    // Se carga cuando el navegador está libre para no frenar la primera pantalla.
    let cancelled = false;
    // No cuenta el panel privado ni los dispositivos marcados como "mis visitas" (botón al pie de /panel).
    let skip = window.location.pathname.startsWith("/panel");
    try {
      if (window.localStorage.getItem("hela.notrack") === "1") skip = true;
    } catch {
      /* sin almacenamiento: se cuenta normal */
    }
    if (posthogEnabled && !skip) {
      const load = () => {
        import("posthog-js").then(({ default: posthog }) => {
          if (cancelled) return;
          posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
            autocapture: false,
            capture_pageview: true,
            capture_pageleave: true,
            persistence: "localStorage",
            person_profiles: "identified_only",
            disable_session_recording: true,
            respect_dnt: true,
          });
          setPosthog(posthog);
        });
      };
      if ("requestIdleCallback" in window) window.requestIdleCallback(load, { timeout: 3000 });
      else setTimeout(load, 1500);
    }

    // Lectura activa: cuenta solo los segundos con la pestaña visible.
    let visibleSeconds = 0;
    const ticker = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      visibleSeconds += 1;
      if (visibleSeconds === 30) track("engaged_30s");
      if (visibleSeconds === 60) {
        track("engaged_60s");
        window.clearInterval(ticker);
      }
    }, 1000);

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
    return () => {
      cancelled = true;
      window.clearInterval(ticker);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}
