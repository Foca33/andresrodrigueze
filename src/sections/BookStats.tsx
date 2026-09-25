"use client";

import { useCopy } from "@/components/Providers";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { books, recognition } from "@/config/books";
import { numbered } from "@/config/site";
import { Dashed } from "@/components/ui/Dashed";

const hela = books[0];

/** Real numbers from the dossier, set like a film's opening credits — not a dashboard. */
export function BookStats() {
  const c = useCopy().stats;

  return (
    <section aria-labelledby="numeros-titulo" className="relative overflow-hidden bg-ink py-[14svh]">
      <h2 id="numeros-titulo" className="sr-only">
        HELA en cifras
      </h2>
      <div className="px-gutter">
        <p className="mono mb-[10svh] text-smoke"><Dashed text={numbered("stats", c.label)} /></p>

        {/* 448 */}
        <div className="grid grid-cols-12 items-end gap-x-4">
          <Reveal className="display col-span-12 text-[38vw] leading-[0.78] md:col-span-8 md:text-[24vw]">
            <CountUp to={hela.pages!} />
          </Reveal>
          <Reveal delay={0.15} className="mono col-span-12 pb-[1.2vw] text-smoke md:col-span-4">
            {c.pages}
          </Reveal>
        </div>
        <div className="rule my-[5svh]" />

        {/* 37 */}
        <div className="grid grid-cols-12 items-end gap-x-4">
          <Reveal delay={0.15} className="mono order-2 col-span-12 pb-[1.2vw] text-smoke md:order-1 md:col-span-4 md:col-start-3 md:text-right">
            {c.chapters}
          </Reveal>
          <Reveal className="display order-1 col-span-12 text-[38vw] leading-[0.78] md:order-2 md:col-span-6 md:text-[24vw]">
            <CountUp to={hela.chapters!} />
          </Reveal>
        </div>
        <div className="rule my-[5svh]" />

        {/* TOP 5 · 2.000+ */}
        <div className="grid grid-cols-12 items-end gap-x-4 gap-y-10">
          <div className="col-span-12 md:col-span-7">
            <Reveal className="display text-[26vw] leading-[0.78] md:text-[15vw]">
              {recognition.rank.replace(/5$/, "")}
              <span className="text-ember">5</span>
            </Reveal>
            <Reveal delay={0.15} className="mono mt-4 text-smoke">
              {c.rank}
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-5">
            <Reveal className="display outline-text text-[24vw] leading-[0.78] md:text-[10vw]">
              <CountUp to={recognition.entrants} suffix="+" />
            </Reveal>
            <Reveal delay={0.15} className="mono mt-4 text-smoke">
              {c.entrants}
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-[8svh] max-w-md text-[1.15rem] italic text-smoke">{c.note}</Reveal>
      </div>
    </section>
  );
}
