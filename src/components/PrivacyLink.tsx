"use client";

import { openPrivacy } from "@/lib/privacy";
import { cn } from "@/lib/cn";

/** Inline text button that opens the privacy dialog. */
export function PrivacyLink({ children, location, className }: { children: React.ReactNode; location: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => openPrivacy(location)}
      className={cn("[text-transform:inherit] underline decoration-current/40 underline-offset-4 transition-colors hover:decoration-current", className)}
    >
      {children}
    </button>
  );
}
