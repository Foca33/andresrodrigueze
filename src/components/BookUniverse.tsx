"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { books } from "@/config/books";
import { siteConfig } from "@/config/site";
import { useCopy } from "@/components/Providers";
import { cn } from "@/lib/cn";

const ROW_IN = (r: number) => 0.02 + r * 0.05;

function Letter({ ch, r, c, p }: { ch: string; r: number; c: number; p: MotionValue<number> }) {
  const spread = (c - 1.5) * 9;
  const x = useTransform(p, [0, 0.32], [`${spread}vw`, "0vw"]);
  const appear = useTransform(p, [ROW_IN(r), ROW_IN(r) + 0.06], [0, 1], { clamp: true });
  const recede = useTransform(p, [0.5, 0.56, 0.72, 0.78], [1, 0.14, 0.14, 1]);
  const focus = useTransform(p, [0.8, 0.88], [1, siteConfig.revealInitials && c > 0 ? 0.12 : 1]);
  const opacity = useTransform([appear, recede, focus], ([a, b, f]: number[]) => a * b * f);
  return (
    <motion.span
      style={{ x, opacity }}
      className="flex h-[0.86em] w-[0.78em] items-center justify-center will-change-transform"
    >
      {ch}
    </motion.span>
  );
}

/**
 * The four titles as a 4×4 letter matrix. Scroll assembles it:
 * scattered rows → locked grid → labelled by heresy → first column lit.
 * Text stays real (aria summary lives in the parent); this is a visual object.
 */
export function BookUniverse({ p }: { p: MotionValue<number> }) {
  const copy = useCopy().lake;

  const gridLine = useTransform(p, [0.3, 0.42], [0, 1], { clamp: true });
  const gridFade = useTransform(p, [0.5, 0.56, 0.72, 0.78, 0.8, 0.88], [1, 0.2, 0.2, 1, 1, 0]);
  const spine = useTransform(p, [0.8, 0.9], [0, 1], { clamp: true });
  const labelsOut = useTransform(p, [0.72, 0.78], [1, 0]);
  // desktop: the matrix slides left to make room for the labels, then returns
  const shift = useTransform(p, [0.5, 0.58, 0.72, 0.78], [0, 1, 1, 0]);
  const shiftT = useTransform(shift, (v) => `translateX(calc(var(--lake-dx, 0px) * ${v}))`);

  return (
    <motion.div
      aria-hidden
      style={{ transform: shiftT }}
      className="relative text-bone [--lake-dx:0px] [font-size:min(24vw,12.5svh)] md:[--lake-dx:-24vw] md:[font-size:min(10.4vw,13.5svh)]"
    >
      <div className="display grid grid-cols-4 leading-none">
        {books.map((b, r) =>
          b.title.split("").map((ch, c) => <Letter key={`${b.id}-${c}`} ch={ch} r={r} c={c} p={p} />),
        )}
      </div>

      {/* hairlines: the grid locks (universe) */}
      <motion.div style={{ opacity: gridFade }} className="pointer-events-none absolute inset-0">
        {[1, 2, 3].map((i) => (
          <motion.span
            key={`v${i}`}
            style={{ scaleY: gridLine, left: `${(i / 4) * 100}%` }}
            className="absolute inset-y-0 w-px origin-top bg-bone/25"
          />
        ))}
        {[1, 2, 3].map((i) => (
          <motion.span
            key={`h${i}`}
            style={{ scaleX: gridLine, top: `${(i / 4) * 100}%` }}
            className="absolute inset-x-0 h-px origin-left bg-bone/25"
          />
        ))}
      </motion.div>

      {/* the first column: H · E · L · L */}
      {siteConfig.revealInitials && (
        <motion.span
          style={{ scaleY: spine }}
          className="pointer-events-none absolute -left-[0.08em] top-0 h-full w-px origin-top bg-ember"
        />
      )}

      {/* labels: one heresy per book */}
      <motion.div
        style={{ opacity: labelsOut }}
        className="absolute left-0 top-0 grid h-full w-[calc(100vw-2.5rem)] grid-rows-4 md:left-full md:ml-10 md:w-[19rem]"
      >
        {books.map((b, r) => (
          <Label key={b.id} r={r} p={p}>
            <p className="mono flex flex-wrap items-center gap-x-3 text-bone">
              <span>{b.title}</span>
              <span className="text-smoke">
                {copy.volume} {b.volume}
              </span>
              {b.status === "upcoming" && <span className="text-ember">· {copy.statusUpcoming}</span>}
            </p>
            <p className={cn("mt-1 text-[clamp(0.98rem,1.2vw,1.15rem)] leading-[1.3] normal-case tracking-normal", b.heresy ? "text-bone/90" : "italic text-smoke")}>
              {b.heresy ?? copy.undisclosed}
            </p>
          </Label>
        ))}
      </motion.div>
    </motion.div>
  );
}

function Label({ r, p, children }: { r: number; p: MotionValue<number>; children: React.ReactNode }) {
  const s = 0.5 + r * 0.028;
  const opacity = useTransform(p, [s, s + 0.05], [0, 1], { clamp: true });
  const y = useTransform(p, [s, s + 0.05], [16, 0], { clamp: true });
  return (
    <motion.div style={{ opacity, y }} className="flex flex-col justify-center font-serif text-[1rem] not-italic [font-size:1rem] [letter-spacing:0]">
      {children}
    </motion.div>
  );
}
