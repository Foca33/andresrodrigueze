"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { defaultEdition, editions, enabledLinks, type FormatId } from "@/config/retailers";
import { RetailerButton } from "@/components/RetailerButton";
import { CoverObject } from "@/components/CoverObject";
import { useCopy } from "@/components/Providers";
import { cn } from "@/lib/cn";

/**
 * Format → retailer, in two steps. Retailers per format come from config/retailers.ts;
 * hidden retailers (enabled: false) never render, so adding Kobo / Apple Books later
 * is a data change, not a redesign.
 */
export function EditionSelector() {
  const copy = useCopy().editions;
  const [format, setFormat] = useState<FormatId>(defaultEdition);
  const groupId = useId();
  const edition = editions.find((e) => e.id === format)!;
  const links = enabledLinks(edition);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = editions[(i + dir + editions.length) % editions.length];
    setFormat(next.id);
    document.getElementById(`${groupId}-${next.id}`)?.focus();
  };

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-12">
      {/* the object */}
      <div className="md:sticky md:top-28 md:col-span-5 md:col-start-8 md:row-start-1 md:self-start">
        <CoverObject format={format} />
        <p aria-live="polite" className="mono mt-8 text-center text-smoke">
          {edition.descriptor}
        </p>
      </div>

      {/* the choice */}
      <div className="md:col-span-7 md:row-start-1">
        <div role="radiogroup" aria-label={copy.formatLegend} className="border-t border-bone/20">
          {editions.map((e, i) => {
            const selected = e.id === format;
            return (
              <button
                key={e.id}
                id={`${groupId}-${e.id}`}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setFormat(e.id)}
                onKeyDown={(ev) => onKey(ev, i)}
                className={cn(
                  "group relative flex w-full items-baseline justify-between gap-6 border-b border-bone/20 py-5 text-left transition-colors duration-500 md:py-7",
                  selected ? "text-bone" : "text-bone/55 hover:text-bone/90",
                )}
              >
                <span className="display min-w-0 text-[clamp(2.3rem,5.6vw,5.8rem)] !leading-[0.9]">{e.label}</span>
                <span className="mono w-[7rem] shrink-0 text-right !text-[0.72rem] md:w-[8.5rem]">
                  <span className="block">{e.descriptor}</span>
                  {e.price && <span className="mt-1 block text-smoke">{e.price}</span>}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-px left-0 h-px bg-ember transition-all duration-700 ease-[var(--ease-out-expo)]",
                    selected ? "w-full" : "w-0",
                  )}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          <p className="mono mb-4 text-smoke">{copy.retailerLegend}</p>
          <AnimatePresence mode="wait">
            <motion.ul
              key={format}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid max-w-xl grid-cols-1 gap-3"
            >
              {links.map((l, i) => (
                <li key={l.retailer}>
                  <RetailerButton edition={edition} link={l} primary={i === 0} />
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
          {edition.isbn && (
            <p className="mono mt-6 !text-[0.72rem] text-fog">
              {copy.isbnLabel}: {edition.isbn}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
