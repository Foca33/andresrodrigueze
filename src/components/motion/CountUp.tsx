"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { formatInt } from "@/lib/format";
import { useReduced } from "./useReduced";

/** Counts up once when scrolled into view. SSR renders the final value (works without JS). */
export function CountUp({ to, suffix = "", duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReduced();
  const armed = useRef(false);

  useEffect(() => {
    if (reduce || !ref.current) return;
    ref.current.textContent = `0${suffix}`;
    armed.current = true;
  }, [reduce, suffix]);

  useEffect(() => {
    if (reduce || !inView || !armed.current || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${formatInt(Math.round(v))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, suffix, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatInt(to)}
      {suffix}
    </span>
  );
}
