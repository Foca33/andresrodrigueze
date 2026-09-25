"use client";

import { useRef, type ElementType } from "react";
import { motion, useInView } from "motion/react";
import { useReduced } from "./useReduced";

/**
 * Word-level mask reveal (text rises out of a clipped line).
 * The container keeps the full string in aria-label; words are aria-hidden
 * so screen readers read one clean sentence.
 */
export function MaskText({
  text,
  as = "span",
  id,
  className,
  delay = 0,
  stagger = 0.06,
  duration = 1.05,
  amount = 0.6,
  immediate = false,
  redStop = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  id?: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  amount?: number;
  /** animate on mount instead of on scroll-into-view */
  immediate?: boolean;
  /** paint a trailing full stop red (brand device on big headings). "deep" = for paper backgrounds */
  redStop?: boolean | "deep";
}) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount });
  const reduce = useReduced();
  const show = reduce || immediate || seen;
  const Tag = as as ElementType;
  const words = text.split(" ");

  return (
    <Tag ref={ref} id={id} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom [padding-block:0.16em] [margin-block:-0.16em] [padding-inline:0.06em] [margin-inline:-0.06em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "115%" }}
            animate={{ y: show ? "0%" : "115%" }}
            transition={{ duration: reduce ? 0 : duration, ease: [0.76, 0, 0.24, 1], delay: delay + i * stagger }}
          >
            {redStop && i === words.length - 1 && w.endsWith(".") ? (
              <>
                {w.slice(0, -1)}
                <span className={(redStop === "deep" ? "text-blood-deep" : "text-ember") + " font-bold"}>.</span>
              </>
            ) : (
              w
            )}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
