"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useSceneProgress } from "@/components/motion/useSceneProgress";
import { useCopy } from "@/components/Providers";
import { useIsDesktop } from "@/components/motion/useIsDesktop";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { SocialStats } from "@/components/SocialStats";
import { SocialLink } from "@/components/SocialLink";
import { LinkButton } from "@/components/ui/Button";
import { audience, crimeVideos, tiktok, type CrimeVideo } from "@/config/social";
import { sections, numbered } from "@/config/site";
import { track } from "@/lib/analytics";
import { formatCompact, formatInt } from "@/lib/format";
import { useReduced } from "@/components/motion/useReduced";
import { Dashed } from "@/components/ui/Dashed";

const DRIFT = [70, -30, 110, -70, 50, -100]; // px: each tile moves at its own speed (desktop)

function Tile({ v, i, p, reduce }: { v: CrimeVideo; i: number; p: MotionValue<number>; reduce: boolean | null }) {
  const c = useCopy().crime;
  const y = useTransform(p, [0, 1], [DRIFT[i % DRIFT.length], -DRIFT[i % DRIFT.length]]);
  const inner = (
    <div className="group relative aspect-[9/16] w-full overflow-hidden bg-coal ring-1 ring-white/10">
      {v.thumbnail ? (
        <Image
          src={v.thumbnail}
          alt={v.title}
          fill
          sizes="(min-width: 768px) 16vw, 60vw"
          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      ) : (
        <div
          data-placeholder="tiktok-thumbnail"
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          style={{
            backgroundImage: `radial-gradient(90% 46% at ${30 + ((i * 17) % 40)}% 22%, rgba(236,230,218,${0.1 + (i % 3) * 0.04}), transparent 70%), linear-gradient(180deg, #171615, #070707)`,
          }}
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      <div className="mono absolute inset-x-3 top-3 flex justify-between !text-[0.72rem] text-bone/70">
        <span>{v.title}</span>
        {v.views != null && <span>{formatCompact(v.views)}</span>}
      </div>
      <svg aria-hidden viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-bone/70">
        <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path d="M10 8l6 4-6 4z" fill="currentColor" />
      </svg>
      {!v.url && <p className="mono absolute inset-x-3 bottom-3 !text-[0.72rem] text-ember">{c.dummy}</p>}
    </div>
  );

  return (
    <motion.li
      style={reduce ? undefined : { y }}
      className="w-[58vw] shrink-0 snap-center sm:w-[36vw] md:w-auto md:shrink"
    >
      {v.url ? (
        <a
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("tiktok_click", { video: v.id })}
          aria-label={`${v.title} — TikTok`}
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </motion.li>
  );
}

export function CrimeToks() {
  const c = useCopy().crime;
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReduced();
  const desktop = useIsDesktop();
  // vertical drift only where the strip is a grid (a scroll-snap strip would clip it)
  const reduce = reducedMotion || !desktop;
  const scrollYProgress = useSceneProgress(ref, ["start end", "end start"]);

  return (
    <section id={sections.crimetoks} ref={ref} aria-labelledby="crime-titulo" className="relative overflow-hidden bg-ink py-[16svh]">
      <div className="px-gutter">
        <p className="mono mb-[7svh] text-smoke"><Dashed text={numbered("crimetoks", c.label)} /></p>
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-10">
          <MaskText
            as="h2" redStop
            id="crime-titulo"
            text={c.title}
            className="display text-[clamp(3.2rem,10.4vw,11rem)] !leading-[0.86] md:col-span-8"
            stagger={0.09}
          />
          <Reveal className="self-end md:col-span-4">
            <p className="text-[1.15rem] leading-[1.6] text-smoke">{c.body}</p>
          </Reveal>
        </div>

        <div className="mt-[10svh]">
          <SocialStats />
        </div>
      </div>

      {/* vertical video strip: scroll-snap on mobile, staggered columns on desktop */}
      {crimeVideos.length > 0 ? (
      <div
        role="region"
        aria-label={`Videos de ${tiktok.handle}`}
        tabIndex={0}
        className="mt-[10svh] flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-16 [scrollbar-width:none] md:grid md:grid-cols-6 md:gap-5 md:overflow-visible md:pb-28 md:pt-16 [&::-webkit-scrollbar]:hidden"
      >
        <ul className="contents">
          {crimeVideos.map((v, i) => (
            <Tile key={v.id} v={v} i={i} p={scrollYProgress} reduce={reduce} />
          ))}
        </ul>
      </div>
      ) : (
        <div className="h-[9svh]" aria-hidden />
      )}

      <div className="flex flex-col items-start gap-6 px-gutter md:flex-row md:items-center md:justify-between">
        <LinkButton
          href={tiktok.url}
          external
          className="w-full md:w-auto md:min-w-[22rem]"
          onClick={() => track("tiktok_click", { location: "crimetoks_cta" })}
        >
          {c.cta}
        </LinkButton>
        <p className="mono text-fog">
          {c.alsoOn}{" "}
          <SocialLink id="instagram" className="underline underline-offset-4 hover:text-bone">
            Instagram
          </SocialLink>{" "}
          ({formatInt(audience.instagram)}) ·{" "}
          <SocialLink id="facebook" className="underline underline-offset-4 hover:text-bone">
            Facebook
          </SocialLink>{" "}
          ({formatInt(audience.facebook)})
        </p>
      </div>
    </section>
  );
}
