"use client";

import { useCopy } from "@/components/Providers";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { EditionSelector } from "@/components/EditionSelector";
import { sections, numbered } from "@/config/site";
import { Dashed } from "@/components/ui/Dashed";

export function Editions() {
  const c = useCopy().editions;

  return (
    <section id={sections.editions} aria-labelledby="ediciones-titulo" className="relative bg-ink px-gutter py-[16svh]">
      <div className="mb-[9svh] grid grid-cols-1 gap-8 md:grid-cols-12">
        <p className="mono text-smoke md:col-span-12"><Dashed text={numbered("editions", c.label)} /></p>
        <MaskText
          as="h2"
          redStop
          id="ediciones-titulo"
          text={c.title}
          className="display text-[clamp(3.2rem,11.5vw,12rem)] leading-[0.86] md:col-span-9"
          stagger={0.09}
        />
        <Reveal className="max-w-sm self-end text-[1.1rem] leading-[1.5] text-smoke md:col-span-3 md:col-start-10">
          {c.lead}
        </Reveal>
      </div>
      <div id="ediciones-selector">
        <EditionSelector />
      </div>
    </section>
  );
}
