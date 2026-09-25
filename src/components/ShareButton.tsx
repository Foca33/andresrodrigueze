"use client";

import { useEffect, useState } from "react";
import { useCopy } from "@/components/Providers";
import { track } from "@/lib/analytics";
import { Arrow } from "@/components/ui/Arrow";
import { cn } from "@/lib/cn";

/**
 * Word of mouth: native share sheet on phones (WhatsApp, Telegram, Instagram…),
 * a WhatsApp link everywhere else. Shares the canonical URL, never a tracked one.
 */
export function ShareButton({ location, className, label }: { location: string; className?: string; label?: string }) {
  const c = useCopy().share;
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(window.location.origin + window.location.pathname), []);

  const href = `https://wa.me/?text=${encodeURIComponent(url ? `${c.text} ${url}` : c.text)}`;

  async function onClick(e: React.MouseEvent) {
    track("share_click", { location });
    if (typeof navigator !== "undefined" && "share" in navigator) {
      e.preventDefault();
      try {
        await navigator.share({ title: "HELA", text: c.text, url });
      } catch {
        /* the reader dismissed the sheet */
      }
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        "mono group inline-flex items-center gap-4 border-b border-bone/30 py-3 text-bone/80 transition-colors hover:border-bone hover:text-bone",
        className,
      )}
    >
      <span>{label ?? c.cta}</span>
      <Arrow />
    </a>
  );
}
