"use client";

import { useCopy } from "@/components/Providers";
import { CoverImage } from "@/components/brand/CoverImage";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { primaryPurchaseAnchor } from "@/config/retailers";
import { sections } from "@/config/site";
import { track } from "@/lib/analytics";

/**
 * A second door to the store, placed right after the lake: the reader has just been
 * pulled through the universe, this is the moment to ask. One line, one button.
 */
export function BuyStrip() {
  const c = useCopy().strip;
  return (
    <section
      id={sections.strip}
      aria-label={c.title}
      className="relative border-y border-bone/10 bg-coal px-gutter py-[9svh]"
    >
      <Reveal className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-14">
        <div className="flex items-center gap-6 md:gap-9">
          <CoverImage kind="hela" sizes="120px" className="w-[4.6rem] shrink-0 shadow-[0_18px_50px_rgba(0,0,0,0.7)] md:w-[6.5rem]" />
          <div>
            <p className="display text-[clamp(2rem,4.6vw,4.4rem)] !leading-[0.95]">{c.title}</p>
            <p className="mono mt-3 text-smoke">
              {c.line.split(" · ").map((part, i, all) => (
                <span key={part} className="whitespace-nowrap">
                  {part}
                  {i < all.length - 1 ? " ·" : ""}{" "}
                </span>
              ))}
            </p>
          </div>
        </div>
        <LinkButton
          href={primaryPurchaseAnchor}
          className="w-full md:w-auto md:min-w-[17rem]"
          onClick={() => track("buy_strip_click")}
        >
          {c.cta}
        </LinkButton>
      </Reveal>
    </section>
  );
}
