"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSceneProgress } from "@/components/motion/useSceneProgress";
import { useCopy } from "@/components/Providers";
import { CoverImage } from "@/components/brand/CoverImage";
import { MaskText } from "@/components/motion/MaskText";
import { LinkButton } from "@/components/ui/Button";
import { primaryPurchaseAnchor } from "@/config/retailers";
import { useReduced } from "@/components/motion/useReduced";
import { track } from "@/lib/analytics";
import { WordmarkGlyph, wordmarkLetters } from "@/components/brand/Wordmark";

const LETTERS = wordmarkLetters("hela");

/** Highlights the time of the crime (03:08) in red wherever it appears in a kicker line. */
function Kicker({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\d\d:\d\d)/).map((part, i) =>
        /^\d\d:\d\d$/.test(part) ? (
          <span key={i} className="text-ember">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * HERO — the opening shot.
 * Load: black → cover develops from the bottom → HELA rises out of the frame → line → CTAs.
 * Scroll: the cover does not disappear, it EXPANDS to full bleed while the letters of HELA
 * drift apart (typography fragmentation); the frame then cuts to black into chapter one.
 */
export function Hero() {
  const copy = useCopy().hero;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();

  const scrollYProgress = useSceneProgress(ref, ["start start", "end end"]);
  const k = useTransform(scrollYProgress, [0.03, 0.8], [0, 1], { clamp: true });

  // Cover: translate toward centre + scale to full-bleed. dx/scale come from CSS vars so
  // mobile (centered cover) and desktop (right-hand cover) get different choreography.
  // The cover is LAID OUT at its final (full-bleed) size and scaled DOWN to its resting size,
  // so it stays razor-sharp at every point of the expansion.
  const coverTransform = useTransform(
    k,
    (v) =>
      `translate(-50%, -50%) translate3d(calc(var(--hero-dx) * ${v}), calc(var(--hero-dy) * ${v}), 0) scale(calc(1 / var(--hero-scale) + (1 - 1 / var(--hero-scale)) * ${v}))`,
  );
  const coverShade = useTransform(k, [0, 0.35, 1], [0.0, 0.0, 0.2]);
  const sceneFade = useTransform(scrollYProgress, [0.8, 0.98], [0, 1]);

  const copyOpacity = useTransform(k, [0, 0.22], [1, 0]);
  const copyY = useTransform(k, [0, 0.22], ["0px", "-40px"]);
  const copyEvents = useTransform(k, (v) => (v > 0.2 ? "none" : "auto"));

  // Letters drift apart, each on its own trajectory.
  const lx = [
    useTransform(k, [0, 1], ["0vw", "-16vw"]),
    useTransform(k, [0, 1], ["0vw", "-6vw"]),
    useTransform(k, [0, 1], ["0vw", "7vw"]),
    useTransform(k, [0, 1], ["0vw", "18vw"]),
  ];
  const ly = [
    useTransform(k, [0, 1], ["0svh", "-10svh"]),
    useTransform(k, [0, 1], ["0svh", "6svh"]),
    useTransform(k, [0, 1], ["0svh", "-4svh"]),
    useTransform(k, [0, 1], ["0svh", "9svh"]),
  ];
  const lo = useTransform(k, [0.08, 0.5], [1, 0]);
  const metaOpacity = useTransform(k, [0, 0.18], [1, 0]);

  const scrub = !reduce;

  return (
    <section
      id="hela"
      ref={ref}
      aria-label="HELA"
      className={
        (scrub
          ? "h-[190vh] md:h-[240vh] [--hero-scale:2.4] md:[--hero-scale:3.3] "
          : "h-svh [--hero-scale:1] ") +
        // resting cover geometry (mobile: centered under the nav · desktop: right-hand, vertically centered)
        "relative [--cover-w:clamp(28vw,calc((100svh-610px)/1.59),50vw)] max-md:[@media(max-height:700px)]:[--cover-w:24vw] [--cover-cx:50vw] [--cover-cy:calc(8.75rem+var(--cover-w)*0.795)] [--hero-dx:0px] [--hero-dy:calc(46svh-var(--cover-cy))] " +
        "md:[--cover-w:min(33vw,50svh)] md:[--cover-cx:calc(100vw-8vw-var(--cover-w)/2)] md:[--cover-cy:50svh] md:[--hero-dx:calc(50vw-var(--cover-cx))] md:[--hero-dy:0px]"
      }
    >
      <div key={scrub ? "scrub" : "still"} className="grain sticky top-0 h-svh overflow-hidden bg-ink">
        {/* single source of light, like a lamp in a dark room */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(58% 52% at 70% 40%, rgba(236,230,218,0.09), transparent 70%)" }}
        />

        {/* COVER */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            style={{ transform: scrub ? coverTransform : "translate(-50%, -50%)" }}
            className="absolute [left:var(--cover-cx)] [top:var(--cover-cy)] [width:calc(var(--cover-w)*var(--hero-scale))] will-change-transform"
          >
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: reduce ? 0 : 2.2, ease: [0.76, 0, 0.24, 1], delay: reduce ? 0 : 0.15 }}
              className="relative shadow-[0_130px_400px_rgba(0,0,0,0.7)]"
            >
              <motion.div
                initial={{ scale: 1.25 }}
                animate={{ scale: 1 }}
                transition={{ duration: reduce ? 0 : 2.8, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.15 }}
              >
                <CoverImage kind="hela" priority sizes="(min-width: 768px) 100vw, 100vw" />
              </motion.div>
              <motion.div aria-hidden className="absolute inset-0 bg-ink" style={scrub ? { opacity: coverShade } : { opacity: 0 }} />
            </motion.div>
          </motion.div>
        </div>

        {/* mobile: fade the lower half of the cover into the copy */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62svh] bg-gradient-to-t from-ink via-ink/85 to-transparent md:hidden" />

        {/* TEXT */}
        <div className="relative z-10 flex h-full flex-col px-gutter pb-0 pt-[5.5rem] md:justify-between">
          <motion.p
            style={scrub ? { opacity: metaOpacity } : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: reduce ? 0 : 0.3 }}
            className="mono flex items-center gap-3 text-smoke"
          >
            <span aria-hidden className="rec-dot h-1.5 w-1.5 rounded-full bg-ember" />
            <span className="sm:hidden">
              <Kicker text={copy.kickerShort} />
            </span>
            <span className="hidden sm:inline">
              <Kicker text={copy.kicker} />
            </span>
          </motion.p>

          <motion.div
            style={scrub ? { opacity: copyOpacity, y: copyY, pointerEvents: copyEvents } : undefined}
            className="mb-[2.2vh] mt-auto max-w-[26rem] md:mb-[3vh] md:mt-0 md:max-w-[30rem]"
          >
            <MaskText
              as="p"
              immediate
              delay={reduce ? 0 : 1.55}
              stagger={0.07}
              className="display-italic text-[clamp(1.65rem,7.2vw,2.1rem)] leading-[1.08] text-bone md:text-[clamp(2rem,3.1vw,3.4rem)]"
              text={copy.statement}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: reduce ? 0 : 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex flex-col items-start gap-3 sm:max-md:flex-row sm:max-md:items-center sm:max-md:gap-8 lg:flex-row lg:items-center lg:gap-8 md:mt-9"
            >
              <LinkButton
                href={primaryPurchaseAnchor}
                className="w-full sm:w-auto sm:min-w-[15rem]"
                onClick={() => track("hero_cta_click")}
              >
                {copy.ctaPrimary}
              </LinkButton>
              <LinkButton href="#primer-capitulo" variant="ghost" arrow={false} onClick={() => track("hero_chapter_click")}>
                {copy.ctaSecondary}
              </LinkButton>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: reduce ? 0 : 0.9 }}
              className="mono mt-4 !text-[0.72rem] text-smoke md:mt-6"
            >
              <span aria-hidden className="mr-3 inline-block h-px w-5 -translate-y-[0.25em] bg-ember" />
              {copy.proof} <span className="max-sm:hidden">{copy.proofMore}</span>
            </motion.p>
          </motion.div>

          <div>
            <motion.div
              style={scrub ? { opacity: metaOpacity } : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: reduce ? 0 : 0.9 }}
              className="mono mb-[0.5vh] flex justify-between text-bone/70"
            >
              <span>{copy.author}</span>
            </motion.div>

            <h1
              className="flex select-none text-bone [font-size:min(38vw,44svh)] max-md:[@media(max-height:700px)]:[font-size:24vw] lg:[font-size:min(27vw,36svh)] [line-height:1] -mb-[0.02em] translate-y-[5%]"
            >
              <span className="sr-only">HELA, novela thriller noir de Andrés Rodríguez Escobar</span>
              {LETTERS.map((L, i) => (
                <motion.span
                  key={L.ch + i}
                  aria-hidden
                  className="block"
                  style={{ marginLeft: `${L.ml}em`, ...(scrub ? { x: lx[i], y: ly[i], opacity: lo } : {}) }}
                >
                  <span className="block overflow-hidden [padding-block:0.06em] [margin-block:-0.06em]">
                    <motion.span
                      className="block will-change-transform"
                      initial={{ y: "108%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: reduce ? 0 : 1.5, ease: [0.76, 0, 0.24, 1], delay: reduce ? 0 : 0.95 + i * 0.11 }}
                    >
                      <WordmarkGlyph word="hela" letter={L} />
                    </motion.span>
                  </span>
                </motion.span>
              ))}
            </h1>
          </div>
        </div>

        {/* cut to black → chapter one */}
        {scrub && <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-ink" style={{ opacity: sceneFade }} />}
      </div>
    </section>
  );
}
