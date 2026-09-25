"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useSceneProgress } from "@/components/motion/useSceneProgress";
import { useCopy } from "@/components/Providers";
import { LeadForm } from "@/components/LeadForm";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { Sigil } from "@/components/brand/Sigil";
import { sections, numbered } from "@/config/site";
import { useReduced } from "@/components/motion/useReduced";
import { Dashed } from "@/components/ui/Dashed";
import { PrivacyLink } from "@/components/PrivacyLink";
import { ShareButton } from "@/components/ShareButton";

/**
 * The threshold. The page descends from paper into black (a long gradient),
 * a single line falls to the horizon, and the form sits at the edge of the lake.
 */
export function NewsletterCTA() {
  const copy = useCopy();
  const c = copy.newsletter;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const scrollYProgress = useSceneProgress(ref, ["start end", "center center"]);
  const lineScale = useTransform(scrollYProgress, [0.05, 0.9], [0, 1]);
  const sigilY = useTransform(scrollYProgress, [0.4, 1], ["-10vh", "0vh"]);
  const sigilOpacity = useTransform(scrollYProgress, [0.5, 0.95], [0, 1]);

  return (
    <section id={sections.newsletter} ref={ref} aria-labelledby="entrar-titulo" className="grain relative overflow-hidden bg-ink">
      {/* descent: bone → black */}
      <div aria-hidden className="h-[32svh] bg-gradient-to-b from-bone via-[#3a3833] to-ink" />

      <div className="relative px-gutter pb-[18svh] pt-[6svh]">
        {/* the falling line */}
        <motion.span
          aria-hidden
          style={reduce ? { scaleY: 1 } : { scaleY: lineScale }}
          className="absolute left-1/2 top-[-32svh] h-[52svh] w-px origin-top bg-gradient-to-b from-transparent via-bone/50 to-bone/10"
        />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
          <motion.div style={reduce ? undefined : { y: sigilY, opacity: sigilOpacity }} className="mb-12 text-bone">
            <Sigil className="h-14 w-14 md:h-20 md:w-20" />
          </motion.div>

          <p className="mono mb-8 text-smoke"><Dashed text={numbered("newsletter", c.label)} /></p>
          <MaskText
            as="h2" redStop
            id="entrar-titulo"
            text={c.title}
            className="display text-[clamp(3.4rem,12.4vw,13rem)] !leading-[0.86]"
            stagger={0.12}
          />

          <div className="mt-[9svh] grid w-full grid-cols-1 gap-14 text-left md:grid-cols-12 md:gap-x-16">
            <Reveal className="md:col-span-5">
              <p className="mono mb-5 text-smoke">{c.lead}</p>
              <ul className="border-t border-bone/20">
                {c.items.map((t, i) => (
                  <li key={t} className="flex items-baseline gap-4 border-b border-bone/20 py-3.5 text-[1.15rem]">
                    <span className="mono !text-[0.72rem] text-fog">{String(i + 1).padStart(2, "0")}</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.12} className="md:col-span-6 md:col-start-7 md:self-end">
              <LeadForm
                source="newsletter"
                event="newsletter_signup"
                after={<ShareButton location="newsletter-success" />}
                strings={{
                  email: c.email,
                  cta: c.cta,
                  sending: c.sending,
                  success: c.success,
                  successSimulated: c.successSimulated,
                  error: c.error,
                  invalid: c.invalid,
                }}
              />
              <p className="mono mt-2 !text-[0.72rem] text-fog">
                {c.fine} <PrivacyLink location="newsletter">{copy.privacy.consent}</PrivacyLink>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
