import { newsletter } from "@/config/social";
import { getAttribution } from "@/lib/analytics";

export interface SubscribePayload {
  email: string;
  firstName?: string;
  /** e.g. "first-chapter" | "newsletter" | "eric" */
  source: string;
  /** honeypot: only a bot fills this. Forwarded as-is; the server drops the request silently when set. */
  hp?: string;
}

export interface SubscribeResult {
  ok: boolean;
  /** true when no endpoint is configured yet (placeholder behaviour) */
  simulated: boolean;
}

/**
 * Placeholder integration point for the email platform
 * (Mailchimp / ConvertKit / Beehiiv / Brevo / own API route).
 */
export async function subscribe(payload: SubscribePayload): Promise<SubscribeResult> {
  if (!newsletter.endpoint) {
    await new Promise((r) => setTimeout(r, 450));
    return { ok: true, simulated: true };
  }
  try {
    const res = await fetch(newsletter.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, attribution: getAttribution(), consent: true, consentAt: new Date().toISOString() }),
    });
    return { ok: res.ok, simulated: false };
  } catch {
    return { ok: false, simulated: false };
  }
}

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
