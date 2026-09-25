/**
 * Central site configuration.
 * Everything marked [PLACEHOLDER] must be replaced before launch.
 */

/** [DOMAIN] — set NEXT_PUBLIC_SITE_URL in Vercel. */
import { testimonials } from "./testimonials";

/** True once at least one REAL reader/press quote exists (config/testimonials.ts). */
export const hasReviews = testimonials.length > 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com";

export const siteConfig = {
  name: "HELA",
  series: "Lago de Fuego",
  url: SITE_URL,
  locale: "es" as const,
  /**
   * Keep false until real domain + real purchase links are live,
   * otherwise search engines would index placeholder content.
   * Set NEXT_PUBLIC_INDEXABLE=true at launch.
   */
  indexable: process.env.NEXT_PUBLIC_INDEXABLE === "true",
  /** Shows small mono notes ("enlace provisional") next to placeholder URLs. Set NEXT_PUBLIC_SHOW_PLACEHOLDERS=false at launch. */
  showPlaceholderNotices: process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS !== "false",
  /**
   * The four titles start with H · E · L · L. Rendered as a quiet reveal in the
   * LAGO DE FUEGO section. Flip to false if the author wants to keep it hidden.
   */
  revealInitials: true,
  author: {
    name: "Andrés Rodríguez Escobar",
    shortName: "Andrés Rodríguez E.",
    location: "Bogotá, Colombia",
    email: "[CONTACT_EMAIL]",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Placeholder URL mechanism                                            */
/* ------------------------------------------------------------------ */

const PLACEHOLDER_PREFIX = "https://example.com/?placeholder=";

/** Temporary URL that is obviously fake (opens example.com in a new tab). */
export const placeholderUrl = (token: string) => `${PLACEHOLDER_PREFIX}${token}`;
export const isPlaceholderUrl = (url: string) => url.startsWith(PLACEHOLDER_PREFIX);

/** In-page anchors used by nav + CTAs */
export const sections = {
  hela: "hela",
  book: "libro",
  editions: "ediciones",
  chapter: "primer-capitulo",
  lake: "lago-de-fuego",
  eric: "eric",
  crimetoks: "crimetoks",
  reviews: "lectores",
  author: "autor",
  strip: "comprar",
  faq: "preguntas",
  newsletter: "entrar",
} as const;

/**
 * Editorial order of the numbered sections ("01 — El libro"). Numbers are computed, not typed:
 * a section that does not render (e.g. reader quotes while there are none) never leaves a gap.
 */
const flow = ["book", "stats", "editions", "chapter", "lake", "eric", "crimetoks", "reviews", "author", "faq", "newsletter"] as const;
export type FlowId = (typeof flow)[number];

export function numbered(id: FlowId, label: string): string {
  const visible = flow.filter((f) => f !== "reviews" || hasReviews);
  const i = visible.indexOf(id);
  return `${String(i + 1).padStart(2, "0")} — ${label}`;
}
