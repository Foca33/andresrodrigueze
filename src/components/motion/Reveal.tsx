"use client";

import { useRef, type ElementType } from "react";
import { motion, useInView } from "motion/react";
import { useReduced } from "./useReduced";

/** Fade + short rise. The default entrance for blocks of copy. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  amount = 0.3,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  as?: "div" | "p" | "li" | "section" | "figure" | "blockquote";
}) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount });
  const reduce = useReduced();
  const Tag = motion[as] as ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={reduce || seen ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: reduce ? 0 : 1.1, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </Tag>
  );
}
