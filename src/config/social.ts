import { placeholderUrl } from "./site";

export const tiktok = {
  handle: "@andres_crimetoks",
  /** Canonical profile URL derived from the handle. Verify before launch. */
  url: "https://www.tiktok.com/@andres_crimetoks",
};

/**
 * Baseline from the HELA dossier. Update numbers here only — the UI is data-driven.
 * (Values are approximate, as stated in the dossier.)
 */
export const tiktokStats = {
  followers: 70_000,
  totalViews: 20_000_000,
  totalLikes: 1_200_000,
  videos: 40,
  topVideoViews: 3_000_000,
  asOf: null as string | null, // [STATS_DATE]
};

/** Other platforms, from the HELA dossier. Approximate. */
export const audience = {
  instagram: 30_000,
  facebook: 20_000,
  total: 120_000, // "más de 120.000 personas en tres plataformas"
};

export interface CrimeVideo {
  id: string;
  title: string;
  /** Poster image path (public/) — null renders a dummy thumbnail. */
  thumbnail: string | null;
  /** TikTok video URL — null for dummy tiles. */
  url: string | null;
  views: number | null;
}

/**
 * Real TikTok videos for the strip in the CrimeToks section (thumbnail in public/, url from TikTok).
 * While this list is empty the strip is simply not rendered: no dummy tiles on a live page.
 *   { id: "v1", title: "Título del video", thumbnail: "/assets/tiktok/v1.jpg", url: "https://www.tiktok.com/@andres_crimetoks/video/…", views: 1_200_000 }
 */
export const crimeVideos: CrimeVideo[] = [];

export type SocialId = "tiktok" | "instagram" | "goodreads" | "facebook" | "email";

export const socialLinks: Record<SocialId, { label: string; url: string }> = {
  tiktok: { label: "TikTok", url: tiktok.url },
  instagram: { label: "Instagram", url: placeholderUrl("INSTAGRAM_URL") },
  goodreads: { label: "Goodreads", url: placeholderUrl("GOODREADS_URL") },
  facebook: { label: "Facebook", url: placeholderUrl("FACEBOOK_URL") },
  email: { label: "Contacto", url: "mailto:[CONTACT_EMAIL]" },
};

export const newsletter = {
  /** [NEWSLETTER_ENDPOINT] — POST { email, firstName, source, attribution, consent, consentAt }. Empty = simulated success. */
  endpoint: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT ?? "",
};
