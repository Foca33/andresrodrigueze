"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useSceneProgress } from "@/components/motion/useSceneProgress";
import { useCopy } from "@/components/Providers";
import { BookUniverse } from "@/components/BookUniverse";
import { Sigil } from "@/components/brand/Sigil";
import { siteConfig } from "@/config/site";

/** One line of the sequence: fades/rises in, holds, lifts out. Ranges are scroll progress 0..1. */
function Stage({
  p,
  range,
  hold,
  children,
  className = "",
}: {
  p: MotionValue<number>;
  range: [number, number, number, number];
  /** "start": already visible at p=0 · "end": stays visible until the end */
  hold?: "start" | "end";
  children: React.ReactNode;
  className?: string;
}) {
  // ranges must stay inside 0..1 (scroll-linked animations reject out-of-range offsets)
  const opacity = useTransform(p, range, hold === "start" ? [1, 1, 1, 0] : hold === "end" ? [0, 1, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(p, range, hold === "start" ? [0, 0, 0, -46] : hold === "end" ? [46, 0, 0, 0] : [46, 0, 0, -46]);
  return (
    <motion.div style={{ opacity, y }} className={`absolute inset-x-0 top-0 md:top-1/2 md:-translate-y-1/2 ${className}`}>
      {children}
    </motion.div>
  );
}

const stageTitle =
  "display text-[clamp(2.7rem,8.6vw,8.6rem)] !leading-[0.88] md:text-[clamp(3rem,6.4vw,7.2rem)]";
const stageNote = "mt-5 max-w-[26rem] text-[clamp(1.02rem,1.3vw,1.2rem)] leading-[1.5] text-smoke";

/**
 * LAGO DE FUEGO — the intellectual property revealed in four beats,
 * scrubbed by scroll: CUATRO HISTORIAS → UN SOLO UNIVERSO → CUATRO HEREJÍAS → TODO ESTÁ CONECTADO.
 */
export function CardinalHeresySection() {
  const c = useCopy().lake;
  const ref = useRef<HTMLDivElement>(null);
  const p = useSceneProgress(ref, ["start start", "end end"]);

  const sigilOpacity = useTransform(p, [0.84, 0.9, 0.95, 0.99], [0, 1, 1, 0]);
  const noteOpacity = useTransform(p, [0.86, 0.92], [0, 1]);

  return (
    <div ref={ref} className="relative h-[380vh] md:h-[440vh]">
      <div className="grain sticky top-0 flex h-svh flex-col justify-start gap-4 overflow-hidden bg-ink px-gutter pt-[13svh] md:flex-row md:items-center md:justify-between md:gap-10 md:pt-0">
        <div className="relative h-[27svh] md:h-[62svh] md:w-[34%] md:shrink-0">
          <Stage p={p} range={[0, 0.02, 0.19, 0.25]} hold="start">
            <p aria-hidden className={stageTitle}>{c.stages[0].text}</p>
          </Stage>
          <Stage p={p} range={[0.24, 0.3, 0.45, 0.5]}>
            <p aria-hidden className={stageTitle}>{c.stages[1].text}</p>
            <p aria-hidden className={stageNote}>{c.stageNotes.two}</p>
          </Stage>
          <Stage p={p} range={[0.5, 0.55, 0.7, 0.75]}>
            <p aria-hidden className={stageTitle}>{c.stages[2].text}</p>
            <p aria-hidden className={stageNote}>{c.stageNotes.three}</p>
          </Stage>
          <Stage p={p} range={[0.76, 0.82, 0.99, 1]} hold="end">
            <p aria-hidden className={stageTitle}>{c.stages[3].text}</p>
            <p aria-hidden className={stageNote}>{c.stageNotes.four}</p>
            {siteConfig.revealInitials && (
              <motion.p aria-hidden style={{ opacity: noteOpacity }} className="mono mt-6 flex items-center gap-3 text-ember">
                <span className="h-px w-8 bg-ember" />
                {c.revealNote}
              </motion.p>
            )}
          </Stage>
        </div>

        <div className="relative md:mr-[1vw]">
          <BookUniverse p={p} />
        </div>

        <motion.div
          aria-hidden
          style={{ opacity: sigilOpacity }}
          className="pointer-events-none absolute bottom-[8svh] right-gutter hidden text-bone/70 md:block"
        >
          <Sigil className="h-14 w-14" />
        </motion.div>
      </div>
    </div>
  );
}
