"use client";

import { books } from "@/config/books";
import { useCopy } from "@/components/Providers";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

/** Roadmap of the saga. Data comes from config/books.ts; statuses are honest. */
export function SagaTimeline() {
  const copy = useCopy().lake;
  return (
    <div className="px-gutter pb-[14svh] pt-[6svh]">
      <ol className="relative grid grid-cols-1 gap-y-10 md:grid-cols-4 md:gap-x-6">
        <span aria-hidden className="absolute left-0 top-[0.35rem] hidden h-px w-full bg-bone/20 md:block" />
        {books.map((b, i) => (
          <Reveal key={b.id} as="li" delay={i * 0.08} className="relative md:pt-9">
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-0 hidden h-[0.7rem] w-[0.7rem] rounded-full border md:block",
                b.status === "featured" ? "border-bone bg-bone" : "border-bone/50 bg-ink",
              )}
            />
            <p className="mono text-smoke">
              {copy.volume} {b.volume}
            </p>
            <p className="display mt-2 text-[clamp(2rem,3.4vw,3.4rem)] !leading-[0.95]">{b.title}</p>
            <p className={cn("mono mt-3 !text-[0.72rem]", b.status === "upcoming" ? "text-ember" : "text-fog")}>
              {b.status === "featured" ? " " : b.status === "upcoming" ? copy.statusUpcoming : copy.statusUndisclosed}
            </p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
