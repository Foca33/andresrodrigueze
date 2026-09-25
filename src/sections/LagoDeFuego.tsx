"use client";

import { useCopy } from "@/components/Providers";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { CardinalHeresySection } from "./CardinalHeresySection";
import { SagaTimeline } from "@/components/SagaTimeline";
import { Sigil } from "@/components/brand/Sigil";
import { books, concept } from "@/config/books";
import { sections, siteConfig, numbered } from "@/config/site";
import { cn } from "@/lib/cn";
import { useReduced } from "@/components/motion/useReduced";
import { Dashed } from "@/components/ui/Dashed";

/** Title card: a scene change. Then the four-beat sequence, then the roadmap. */
function TitleCard() {
  const c = useCopy().lake;
  return (
    <div className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-ink px-gutter pb-[8svh] pt-[16svh]">
      <p className="mono text-smoke">
        <Dashed text={numbered("lake", c.label)} />
      </p>
      <div>
        <h2 className="sr-only">Lago de Fuego</h2>
        <div aria-hidden>
        <MaskText as="span" text="Lago de" className="display block text-[clamp(4rem,19vw,20rem)] !leading-[0.84]" stagger={0.12} />
        <div className="flex items-end justify-between gap-6">
          <MaskText as="span" text="Fuego" delay={0.25} className="display block text-[clamp(4rem,19vw,20rem)] !leading-[0.84]" stagger={0.12} />
          <Reveal delay={0.9} className="pb-[2.5vw]">
            <Sigil className="h-[clamp(2.5rem,6vw,6rem)] w-[clamp(2.5rem,6vw,6rem)] text-bone/80" />
          </Reveal>
        </div>
        </div>
        <p className="sr-only">{c.ariaSummary}</p>
      </div>
      <p className="mono self-end text-smoke">{concept.name}</p>
    </div>
  );
}

/** Reduced-motion version: same content, no choreography. */
function StaticLake() {
  const c = useCopy().lake;
  return (
    <div className="bg-ink px-gutter pb-[10svh]">
      <ol className="grid gap-y-16 md:grid-cols-2 md:gap-x-16">
        {c.stages.map((s, i) => (
          <li key={s.id}>
            <p className="display text-[clamp(2.4rem,6vw,5.6rem)] !leading-[0.9]">{s.text}</p>
            {i === 1 && <p className="mt-4 max-w-md text-smoke">{c.stageNotes.two}</p>}
            {i === 2 && <p className="mt-4 max-w-md text-smoke">{c.stageNotes.three}</p>}
            {i === 3 && <p className="mt-4 max-w-md text-smoke">{c.stageNotes.four}</p>}
          </li>
        ))}
      </ol>
      <ul className="mt-20 grid max-w-3xl gap-8">
        {books.map((b) => (
          <li key={b.id} className="grid grid-cols-[auto_1fr] items-baseline gap-x-8 border-t border-bone/20 pt-5">
            <p className="display text-[clamp(2.4rem,7vw,5.6rem)] !leading-[0.9]">
              {siteConfig.revealInitials ? (
                <>
                  <span className="text-bone">{b.title[0]}</span>
                  <span className="text-bone/40">{b.title.slice(1)}</span>
                </>
              ) : (
                b.title
              )}
            </p>
            <p className={cn("text-[1.1rem]", b.heresy ? "text-bone/90" : "italic text-smoke")}>{b.heresy ?? c.undisclosed}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LagoDeFuego() {
  const reduce = useReduced();
  return (
    <section id={sections.lake} aria-label="Lago de Fuego" className="relative bg-ink">
      <TitleCard />
      {reduce ? <StaticLake /> : <CardinalHeresySection />}
      <SagaTimeline />
    </section>
  );
}
