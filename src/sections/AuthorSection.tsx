"use client";

import { useRef } from "react";
import { motion, useInView, useTransform } from "motion/react";
import { useSceneProgress } from "@/components/motion/useSceneProgress";
import { useCopy } from "@/components/Providers";
import { PortraitImage } from "@/components/brand/PortraitImage";
import { SocialLink } from "@/components/SocialLink";
import { Reveal } from "@/components/motion/Reveal";
import { sections, numbered } from "@/config/site";
import { useReduced } from "@/components/motion/useReduced";
import { Dashed } from "@/components/ui/Dashed";

/**
 * Late in the page, on purpose: HELA is the protagonist, then the person behind it.
 * The portrait is developed like a print (clip reveal + slow counter-scale).
 */
export function AuthorSection() {
  const c = useCopy().author;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const scrollYProgress = useSceneProgress(ref, ["start end", "end start"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const nameX = useTransform(scrollYProgress, [0.1, 0.9], ["2vw", "-3vw"]);
  const portraitRef = useRef<HTMLDivElement>(null);
  const portraitIn = useInView(portraitRef, { once: true, amount: 0.15 });

  return (
    <section
      id={sections.author}
      ref={ref}
      aria-labelledby="autor-titulo"
      className="on-paper relative overflow-hidden bg-bone py-[16svh] text-ink"
    >
      <p className="mono mb-[7svh] px-gutter text-ink/60"><Dashed text={numbered("author", c.label)} paper /></p>

      <div className="relative grid grid-cols-1 gap-y-12 px-gutter md:grid-cols-12 md:gap-x-10">
        {/* observed wrapper is NOT clipped, so the IntersectionObserver always sees it */}
        <div ref={portraitRef} className="md:col-span-6 md:row-span-2">
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: reduce || portraitIn ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0 : 1.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div style={reduce ? undefined : { scale: imgScale }}>
              <PortraitImage className="aspect-[4/5] w-full" />
            </motion.div>
          </motion.div>
        </div>

        <div className="md:col-span-5 md:col-start-8 md:self-start md:pt-[6svh]">
          <p className="mono text-ink/70">
            {c.role} · {c.place}
          </p>
          <div className="mt-8 space-y-6 text-[1.2rem] leading-[1.6] text-ink/85">
            {c.paragraphs.map((t) => (
              <Reveal key={t.slice(0, 24)} as="p">
                {t}
              </Reveal>
            ))}
          </div>

          <dl className="mt-12 border-t border-ink/25">
            {c.facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-ink/25 py-3">
                <dt className="mono text-ink/70">{k}</dt>
                <dd className="text-[1.05rem]">{v}</dd>
              </div>
            ))}
          </dl>

          <ul className="mono mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {(["tiktok", "instagram", "goodreads", "facebook"] as const).map((id) => (
              <li key={id}>
                <SocialLink id={id} className="border-b border-ink/40 pb-1 transition-colors hover:border-ink" />
              </li>
            ))}
          </ul>
        </div>

        {/* the name, too large for its column, crosses the portrait */}
        <motion.h2
          id="autor-titulo"
          style={reduce ? undefined : { x: nameX }}
          aria-label={c.name}
          className="display pointer-events-none relative z-10 text-[clamp(2.7rem,11.4vw,12.5rem)] !leading-[0.88] md:col-span-12 md:-mt-[10vw]"
        >
          <span aria-hidden className="block">{c.name.split(" ").slice(0, 2).join(" ")}</span>
          <span aria-hidden className="block md:pl-[18vw]">{c.name.split(" ").slice(2).join(" ")}</span>
        </motion.h2>
      </div>
    </section>
  );
}
