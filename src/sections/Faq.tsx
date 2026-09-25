"use client";

import { useCopy } from "@/components/Providers";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { Dashed } from "@/components/ui/Dashed";
import { LinkButton } from "@/components/ui/Button";
import { PrivacyLink } from "@/components/PrivacyLink";
import { resolveFaq } from "@/content/faq";
import { primaryPurchaseAnchor } from "@/config/retailers";
import { numbered, sections } from "@/config/site";
import { track } from "@/lib/analytics";

/**
 * The objections a cold TikTok visitor has before paying: is it for me, how long, how strong,
 * where do I buy, can I try it first. Native <details> = accessible, no JS needed to read.
 */
export function Faq() {
  const copy = useCopy();
  const c = copy.faq;
  const items = resolveFaq(copy);

  return (
    <section id={sections.faq} aria-labelledby="faq-titulo" className="relative bg-ink px-gutter py-[14svh]">
      <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-10">
        <div className="md:col-span-5">
          <p className="mono mb-[7svh] text-smoke">
            <Dashed text={numbered("faq", c.label)} />
          </p>
          <MaskText
            as="h2"
            redStop
            id="faq-titulo"
            text={c.title}
            className="display text-[clamp(3rem,7.6vw,8rem)] !leading-[0.9]"
            stagger={0.09}
          />
        </div>

        <div className="md:col-span-7 md:pt-[calc(7svh+1.5rem)]">
          <ul className="border-t border-bone/20">
            {items.map((it, i) => (
              <li key={it.q} className="border-b border-bone/20">
                <details
                  name="faq"
                  className="group"
                  onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && track("faq_open", { question: i + 1 })}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.28rem] leading-[1.25] text-bone marker:hidden md:py-6 md:text-[1.4rem] [&::-webkit-details-marker]:hidden">
                    <span>{it.q}</span>
                    <span aria-hidden className="relative h-4 w-4 shrink-0 text-smoke transition-colors group-open:text-ember">
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-500 group-open:scale-y-0" />
                    </span>
                  </summary>
                  <div className="max-w-xl pb-7 text-[1.1rem] leading-[1.6] text-smoke">
                    <p>{it.a}</p>
                    {it.link && (
                      <a
                        href={it.link.href}
                        className="mono mt-4 inline-block border-b border-bone/30 py-2 text-bone/85 transition-colors hover:border-bone hover:text-bone"
                      >
                        {it.link.label}
                      </a>
                    )}
                  </div>
                </details>
              </li>
            ))}
          </ul>

          <Reveal className="mt-12 flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-8">
            <p className="display text-[clamp(1.8rem,3vw,2.6rem)]">{c.closing}</p>
            <LinkButton
              href={primaryPurchaseAnchor}
              className="w-full md:w-auto md:min-w-[16rem]"
              onClick={() => track("faq_buy_click")}
            >
              {c.closingCta}
            </LinkButton>
          </Reveal>
          <p className="mono mt-8 !text-[0.72rem] text-fog">
            <PrivacyLink location="faq">{copy.privacy.link}</PrivacyLink>
          </p>
        </div>
      </div>
    </section>
  );
}
