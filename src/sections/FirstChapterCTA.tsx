"use client";

import { useCopy } from "@/components/Providers";
import { LeadForm } from "@/components/LeadForm";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { sections, numbered } from "@/config/site";
import { Dashed } from "@/components/ui/Dashed";
import { PrivacyLink } from "@/components/PrivacyLink";
import { ShareButton } from "@/components/ShareButton";
import { LinkButton } from "@/components/ui/Button";
import { primaryPurchaseAnchor } from "@/config/retailers";

/** Release beat: the page turns to paper. The first line of the book is the bait. */
export function FirstChapterCTA() {
  const copy = useCopy();
  const c = copy.chapter;

  return (
    <section
      id={sections.chapter}
      aria-labelledby="capitulo-titulo"
      className="on-paper relative overflow-hidden bg-paper px-gutter py-[16svh] text-ink"
    >
      <div className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-10">
        <p className="mono text-ink/60 md:col-span-12"><Dashed text={numbered("chapter", c.label)} paper /></p>

        <div className="md:col-span-7">
          <MaskText
            as="h2" redStop="deep"
            id="capitulo-titulo"
            text={c.title}
            className="display text-[clamp(3rem,8.4vw,9rem)] !leading-[0.94]"
            stagger={0.08}
          />
          <Reveal className="mt-12 max-w-xl">
            <p className="text-[1.2rem] leading-[1.55] text-ink/75">{c.body}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12 max-w-xl">
            <LeadForm
              tone="paper"
              source="first-chapter"
              event="first_chapter_click"
              after={
                <div className="flex flex-col items-start gap-5">
                  <LinkButton href={primaryPurchaseAnchor} variant="paper" className="w-full sm:w-auto sm:min-w-[15rem]">
                    {copy.hero.ctaPrimary}
                  </LinkButton>
                  <div className="flex flex-col items-start gap-2">
                    <p className="mono !text-[0.72rem] text-ink/60">{copy.share.lead}</p>
                    <ShareButton location="first-chapter-success" className="border-ink/30 text-ink/80 hover:border-ink hover:text-ink" />
                  </div>
                </div>
              }
              strings={{
                email: c.email,
                firstName: c.firstName,
                cta: c.cta,
                sending: c.sending,
                success: c.success,
                successNote: c.successNote,
                successSimulated: c.successSimulated,
                error: c.error,
                invalid: c.invalid,
              }}
            />
            <p className="mono mt-2 !text-[0.72rem] text-ink/70">
              {c.fine} <PrivacyLink location="first-chapter">{copy.privacy.consent}</PrivacyLink>
            </p>
          </Reveal>
        </div>

        {/* the page: first line, faded out like the edge of a sheet */}
        <Reveal as="figure" className="md:col-span-5 md:pt-[6svh]">
          <div className="relative border-l border-ink/25 pl-7 md:pl-10">
            <blockquote className="display-italic text-[clamp(1.9rem,3.6vw,3.6rem)] leading-[1.08]">
              “{c.teaserLine}”
            </blockquote>
            <figcaption className="mono mt-6 text-ink/70">{c.teaserSource}</figcaption>
            <div aria-hidden className="mt-10 space-y-3">
              {[92, 100, 84, 96, 60].map((w, i) => (
                <div
                  key={i}
                  className="h-[0.5em] rounded-[1px] bg-ink"
                  style={{ width: `${w}%`, opacity: Math.max(0.03, 0.16 - i * 0.035) }}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
