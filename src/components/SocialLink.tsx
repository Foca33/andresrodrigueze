"use client";

import { socialLinks, type SocialId } from "@/config/social";
import { isPlaceholderUrl } from "@/config/site";
import { track, type AnalyticsEvent } from "@/lib/analytics";

const EVENTS: Partial<Record<SocialId, AnalyticsEvent>> = {
  tiktok: "tiktok_click",
  instagram: "instagram_click",
  goodreads: "goodreads_click",
};

/** External link that tracks its click and opens in a new tab. Placeholder URLs are flagged. */
export function SocialLink({ id, className, children }: { id: SocialId; className?: string; children?: React.ReactNode }) {
  const link = socialLinks[id];
  const mail = link.url.startsWith("mailto:");
  const placeholder = isPlaceholderUrl(link.url) || link.url.includes("[");
  return (
    <a
      href={link.url}
      {...(mail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      data-placeholder={placeholder || undefined}
      title={placeholder ? "Enlace provisional" : undefined}
      className={className}
      onClick={() => {
        const ev = EVENTS[id];
        if (ev) track(ev, { placeholder });
      }}
    >
      {children ?? link.label}
    </a>
  );
}
