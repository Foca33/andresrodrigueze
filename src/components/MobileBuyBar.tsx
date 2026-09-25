"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCopy } from "@/components/Providers";
import { useSectionInView } from "@/components/motion/useSectionInView";
import { primaryPurchaseAnchor } from "@/config/retailers";
import { sections } from "@/config/site";
import { track } from "@/lib/analytics";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Mobile-only persistent conversion bar (TikTok traffic is mostly mobile).
 * Appears after the hero, hides while the editions or the newsletter are on screen.
 */
export function MobileBuyBar() {
  const copy = useCopy();
  const { scrollY } = useScroll();
  const [past, setPast] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > window.innerHeight * 1.6;
    setPast((p) => (p === next ? p : next));
  });
  // quiet zones: where a buy CTA is redundant (editions, strip, FAQ) or competes with the scene / a form
  const quiet = [
    useSectionInView(sections.editions),
    useSectionInView(sections.strip),
    useSectionInView(sections.chapter),
    useSectionInView(sections.lake),
    useSectionInView(sections.eric),
    useSectionInView(sections.faq),
    useSectionInView(sections.newsletter),
  ].some(Boolean);
  const visible = past && !quiet;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={primaryPurchaseAnchor}
          onClick={() => track("buy_bar_click")}
          className="cta mono fixed inset-x-3 bottom-3 z-40 flex items-center justify-between bg-bone px-5 py-4 font-medium text-ink shadow-[0_10px_40px_rgba(0,0,0,0.6)] md:hidden"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>{copy.nav.mobileBuy}</span>
          <Arrow />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
