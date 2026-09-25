"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSceneProgress } from "@/components/motion/useSceneProgress";
import { useCopy } from "@/components/Providers";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { Reveal } from "@/components/motion/Reveal";
import { Sigil } from "@/components/brand/Sigil";
import { sections, numbered } from "@/config/site";
import { useReduced } from "@/components/motion/useReduced";
import { Dashed } from "@/components/ui/Dashed";

/** A word too large for the screen crosses it: the minute of the murder. */
function Interlude({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduced();
  const scrollYProgress = useSceneProgress(ref, ["start end", "end start"]);
  const x = useTransform(scrollYProgress, [0, 1], ["18vw", "-62vw"]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} aria-hidden className="relative h-[100svh] md:h-[125svh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <motion.div
          style={reduce ? undefined : { x, opacity }}
          className="display whitespace-nowrap text-[46vw] leading-none text-ember md:text-[36vw]"
        >
          {text}
        </motion.div>
      </div>
    </div>
  );
}

export function BookIntro() {
  const c = useCopy().book;

  return (
    <section id={sections.book} aria-labelledby="libro-titulo" className="relative bg-ink pb-[18svh]">
      <h2 id="libro-titulo" className="sr-only">
        El libro
      </h2>
      <Interlude text={c.interlude} />

      <div className="grid grid-cols-1 gap-y-[22svh] px-gutter md:grid-cols-12 md:gap-y-[28svh]">
        <p className="mono text-smoke md:col-span-12">
          <Dashed text={numbered("book", c.label)} />
        </p>

        <ScrollWords
          text={c.lines[0]}
          className="display-italic text-[clamp(2.05rem,5.6vw,5.8rem)] leading-[1.03] md:col-span-10 md:col-start-2"
        />

        <div className="md:col-span-4 md:col-start-8">
          <ScrollWords text={c.lines[1]} className="text-[clamp(1.3rem,1.9vw,1.75rem)] leading-[1.4] text-bone" />
        </div>

        <div className="md:col-span-5 md:col-start-2">
          <ScrollWords text={c.lines[2]} className="text-[clamp(1.3rem,1.9vw,1.75rem)] leading-[1.4] text-bone" />
        </div>

        <ScrollWords
          text={c.lines[3]}
          className="display-italic text-[clamp(1.9rem,4.6vw,4.7rem)] leading-[1.06] md:col-span-10 md:col-start-3"
        />

        <Reveal as="figure" className="md:col-span-6 md:col-start-4">
          <div className="rule" />
          <blockquote className="py-10 text-center text-[clamp(1.05rem,1.35vw,1.3rem)] italic leading-[1.7] text-smoke">
            “{c.epigraph.text}”
          </blockquote>
          <figcaption className="mono pb-10 text-center text-fog">{c.epigraph.source}</figcaption>
          <div className="rule" />
        </Reveal>

        <ScrollWords
          text={c.myth}
          className="display-italic text-[clamp(1.9rem,4.4vw,4.4rem)] leading-[1.08] md:col-span-9 md:col-start-2"
        />

        <Reveal className="flex items-end justify-between gap-8 md:col-span-6 md:col-start-7">
          <p className="max-w-[22rem] text-[1.15rem] leading-[1.5] text-smoke">{c.city}</p>
          <Sigil className="h-10 w-10 shrink-0 text-bone/80" />
        </Reveal>
      </div>
    </section>
  );
}
