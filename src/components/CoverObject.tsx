"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { CoverImage } from "@/components/brand/CoverImage";
import type { FormatId } from "@/config/retailers";
import { useReduced } from "@/components/motion/useReduced";

/**
 * The book as an OBJECT. Format changes its physical cues:
 *  - kindle: flat, screen-lit
 *  - paperback: soft page edge
 *  - hardcover: cloth board + spine ridge
 * Pointer tilt is capped at ±5° and disabled for reduced motion / touch.
 */
export function CoverObject({ format }: { format: FormatId }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduced();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="[perspective:1200px]">
      <motion.div
        style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
        className="relative mx-auto w-[min(46vw,26svh)] will-change-transform md:w-[min(24rem,30vw)]"
      >
        <motion.div
          key={format}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <CoverImage
            kind="hela"
            sizes="(min-width: 768px) 30vw, 72vw"
            className={
              format === "hardcover"
                ? "shadow-[-10px_0_0_-2px_#1b1a19,0_50px_90px_-20px_rgba(0,0,0,0.9)]"
                : format === "paperback"
                  ? "shadow-[-3px_0_0_-1px_rgba(236,230,218,0.35),0_40px_80px_-20px_rgba(0,0,0,0.9)]"
                  : "shadow-[0_0_0_1px_rgba(236,230,218,0.25),0_0_80px_-10px_rgba(236,230,218,0.18)]"
            }
          />
          {format === "hardcover" && (
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[3.5%] w-px bg-black/60 shadow-[1px_0_0_rgba(255,255,255,0.14)]" />
          )}
          {format === "paperback" && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-[6%]"
              style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.35), transparent)" }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
