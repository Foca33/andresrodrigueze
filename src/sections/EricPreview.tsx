"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSceneProgress } from "@/components/motion/useSceneProgress";
import { useCopy } from "@/components/Providers";
import { CoverImage } from "@/components/brand/CoverImage";
import { LeadForm } from "@/components/LeadForm";
import { Reveal } from "@/components/motion/Reveal";
import { sections, numbered } from "@/config/site";
import { useReduced } from "@/components/motion/useReduced";
import { Dashed } from "@/components/ui/Dashed";
import { PrivacyLink } from "@/components/PrivacyLink";
import { Wordmark } from "@/components/brand/Wordmark";

/**
 * ERIC — the sibling. Same cover treatment, same lamp, mirrored composition:
 * where HELA's cover sat right, ERIC's sits left. Layers move at different speeds.
 */
export function EricPreview() {
  const copy = useCopy();
  const c = copy.eric;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const scrollYProgress = useSceneProgress(ref, ["start end", "end start"]);
  const coverY = useTransform(scrollYProgress, [0, 1], ["9vh", "-9vh"]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["-4vh", "8vh"]);
  const wordX = useTransform(scrollYProgress, [0, 1], ["6vw", "-6vw"]);

  return (
    <section
      id={sections.eric}
      ref={ref}
      aria-labelledby="eric-titulo"
      className="grain relative min-h-svh overflow-hidden bg-ink px-gutter py-[14svh]"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(55% 55% at 26% 48%, rgba(236,230,218,0.08), transparent 70%)" }}
      />
      <p className="mono relative z-10 mb-[8svh] text-smoke"><Dashed text={numbered("eric", c.label)} /></p>

      <div className="relative grid grid-cols-1 items-center gap-y-16 md:grid-cols-12">
        {/* giant word behind + across the cover */}
        <motion.div
          aria-hidden
          style={reduce ? undefined : { y: wordY, x: wordX }}
          className="pointer-events-none absolute -top-[2%] left-[8%] z-0 select-none text-[44vw] leading-none text-bone/[0.06] md:left-[30%] md:top-1/2 md:-translate-y-1/2 md:text-[30vw]"
        >
          <Wordmark word="eric" />
        </motion.div>

        <motion.div
          style={reduce ? undefined : { y: coverY }}
          className="relative z-10 mx-auto w-[min(66vw,42svh)] md:col-span-4 md:col-start-2 md:mx-0 md:w-[min(30vw,54svh)]"
        >
          <Reveal y={40}>
            <div className="shadow-[0_40px_120px_rgba(0,0,0,0.75)]">
              <CoverImage kind="eric" sizes="(min-width: 768px) 30vw, 66vw" />
            </div>
          </Reveal>
        </motion.div>

        <div className="relative z-10 md:col-span-5 md:col-start-8">
          <p className="mono mb-5 flex items-center gap-3 text-smoke">{c.series}</p>
          <Reveal y={30}>
            <h2 id="eric-titulo" aria-label={c.title} className="text-[clamp(4.6rem,15vw,15rem)] leading-none">
              <Wordmark word="eric" />
            </h2>
          </Reveal>
          <div className="mono mt-6 inline-flex items-center gap-3 border border-ember/70 px-4 py-2 text-ember">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ember" />
            {c.status}
          </div>
          <Reveal className="mt-10 max-w-md">
            <p className="display-italic text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.15]">{c.line}</p>
          </Reveal>
          <Reveal className="mt-10 max-w-md" delay={0.1}>
            <p className="mono mb-2 text-smoke">{c.cta}</p>
            <LeadForm
              layout="inline"
              source="eric"
              event="eric_interest"
              strings={{
                email: c.email,
                cta: c.send,
                sending: "…",
                success: c.ok,
                successSimulated: "Registrado en modo de prueba: el envío real aún no está conectado.",
                error: "No pudimos registrar tu correo. Inténtalo de nuevo.",
                invalid: "Escribe un correo válido.",
              }}
            />
            <p className="mono mt-3 !text-[0.72rem] text-fog">
              <PrivacyLink location="eric">{copy.privacy.consent}</PrivacyLink>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
