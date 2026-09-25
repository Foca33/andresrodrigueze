"use client";

import { useCopy } from "@/components/Providers";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { placeholderSlots, testimonials } from "@/config/testimonials";
import { sections, numbered } from "@/config/site";
import { cn } from "@/lib/cn";
import { Dashed } from "@/components/ui/Dashed";

/** Reader response. Editorial quotations, no stars. Placeholder slots are unmistakable. */
export function Testimonials() {
  const c = useCopy().reviews;
  const real = testimonials.length > 0;
  const slots = real
    ? testimonials
    : Array.from({ length: placeholderSlots }, () => ({ quote: c.placeholderQuote, author: c.placeholderAuthor, source: "" }));

  // asymmetric placement so it never reads as "three cards"
  const spans = ["md:col-span-7 md:col-start-1", "md:col-span-5 md:col-start-8 md:mt-[14svh]", "md:col-span-6 md:col-start-4"];

  return (
    <section id={sections.reviews} aria-labelledby="lectores-titulo" className="relative bg-ink px-gutter py-[16svh]">
      <p className="mono mb-[7svh] text-smoke"><Dashed text={numbered("reviews", c.label)} /></p>
      <MaskText
        as="h2" redStop
        id="lectores-titulo"
        text={c.title}
        className="display mb-[10svh] block text-[clamp(3rem,9.6vw,10rem)] !leading-[0.86]"
        stagger={0.09}
      />

      <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-12">
        {slots.map((t, i) => (
          <Reveal
            key={i}
            as="figure"
            delay={i * 0.1}
            className={cn(
              spans[i % spans.length],
              !real && "border border-dashed border-bone/25 p-7 md:p-10",
            )}
          >
            {!real && (
              <p className="mono mb-6 flex items-center gap-3 text-ember" data-placeholder="testimonial">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ember" />
                {c.placeholderTag}
              </p>
            )}
            <blockquote
              className={cn(
                "display-italic leading-[1.1]",
                i === 0 ? "text-[clamp(2rem,4.2vw,4.2rem)]" : "text-[clamp(1.5rem,2.6vw,2.6rem)]",
                !real && "text-bone/40",
              )}
            >
              {real ? `“${t.quote}”` : t.quote}
            </blockquote>
            <figcaption className={cn("mono mt-6", real ? "text-smoke" : "text-fog")}>
              {t.author}
              {"source" in t && t.source ? ` · ${t.source}` : ""}
            </figcaption>
          </Reveal>
        ))}
      </div>

      {!real && <p className="mono mt-[9svh] max-w-md !text-[0.72rem] text-fog">{c.note}</p>}
    </section>
  );
}
