"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useSceneProgress } from "./useSceneProgress";
import { useReduced } from "./useReduced";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
      {" "}
    </motion.span>
  );
}

/**
 * Reading paced by the scroll: each word lights up as the block crosses the
 * viewport. Purposeful — it makes the reader move at the speed of the prose.
 */
export function ScrollWords({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: "p" | "h2" | "h3" | "div" }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const scrollYProgress = useSceneProgress(ref, ["start 0.88", "end 0.5"]);
  const words = text.split(" ");

  if (reduce) return <Tag className={className}>{text}</Tag>;

  const El = Tag as React.ElementType;
  return (
    <El ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const start = (i / words.length) * 0.82;
        return <Word key={i} word={w} progress={scrollYProgress} range={[start, start + 0.18]} />;
      })}
    </El>
  );
}
