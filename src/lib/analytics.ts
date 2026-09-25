/**
 * Analytics architecture — no credentials required yet.
 * Fires to whichever of these exist on window: dataLayer (GTM), gtag (GA4), plausible.
 * In development, events are logged to the console.
 *
 * Every event carries the visitor's ATTRIBUTION (utm_*, ttclid, fbclid, in-app browser), captured
 * once per session by <Analytics />. That is what tells you which TikTok video sells books.
 *
 * [GA_MEASUREMENT_ID] / [GTM_ID] → wire the actual script in app/layout.tsx when ready.
 */

export type AnalyticsEvent =
  | "purchase_click_amazon"
  | "purchase_click_buscalibre"
  | "purchase_click_kobo"
  | "purchase_click_apple"
  | "purchase_click_kindle"
  | "purchase_click_paperback"
  | "purchase_click_hardcover"
  | "hero_cta_click"
  | "hero_chapter_click"
  | "nav_buy_click"
  | "buy_bar_click"
  | "buy_strip_click"
  | "faq_buy_click"
  | "faq_open"
  | "first_chapter_click"
  | "newsletter_signup"
  | "share_click"
  | "privacy_open"
  | "scroll_depth"
  | "tiktok_click"
  | "instagram_click"
  | "goodreads_click"
  | "eric_interest";

type Params = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (name: string, opts?: { props?: Params }) => void;
  }
}

const KEY = "hela.attr";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ttclid", "fbclid", "src"] as const;

/** Attribution captured on landing: first touch wins for the session. */
export function getAttribution(): Params {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(window.location.search);
    const attr: Params = {};
    PARAMS.forEach((k) => {
      const v = q.get(k);
      if (v) attr[k] = v.slice(0, 80);
    });
    const ua = navigator.userAgent;
    if (/musical_ly|BytedanceWebview|TikTok|trill/i.test(ua)) attr.in_app = "tiktok";
    else if (/Instagram/i.test(ua)) attr.in_app = "instagram";
    else if (/FBAN|FBAV/i.test(ua)) attr.in_app = "facebook";
    if (!attr.utm_source && attr.in_app) attr.utm_source = String(attr.in_app);
    if (!attr.utm_source && document.referrer) {
      try {
        attr.referrer = new URL(document.referrer).hostname;
      } catch {
        /* ignore */
      }
    }
    window.sessionStorage.setItem(KEY, JSON.stringify(attr));
  } catch {
    /* private mode: attribution is a nice-to-have */
  }
}

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    const payload = { ...getAttribution(), ...params };
    window.dataLayer?.push({ event, ...payload });
    window.gtag?.("event", event, payload);
    window.plausible?.(event, { props: payload });
    if (process.env.NODE_ENV !== "production") {
      console.debug("[analytics]", event, payload);
    }
  } catch {
    /* analytics must never break the page */
  }
}
