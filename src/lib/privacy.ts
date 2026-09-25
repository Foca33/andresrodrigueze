import { track } from "@/lib/analytics";

export const PRIVACY_EVENT = "hela:open-privacy";

/** Opens the privacy / legal dialog from anywhere (footer, form fine print). */
export function openPrivacy(location: string) {
  if (typeof window === "undefined") return;
  track("privacy_open", { location });
  window.dispatchEvent(new CustomEvent(PRIVACY_EVENT));
}
