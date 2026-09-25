"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useCopy } from "@/components/Providers";
import { Wordmark } from "@/components/brand/Wordmark";
import { track } from "@/lib/analytics";
import { pad2 } from "@/lib/format";
import { books } from "@/config/books";
import { primaryPurchaseAnchor } from "@/config/retailers";

const TOTAL = books[0].chapters ?? 37;

export function SiteNav() {
  const copy = useCopy();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollYProgress } = useScroll();
  // The page is 37 chapters long, like the book. A quiet, HELA-specific detail.
  const chapter = useTransform(scrollYProgress, (v) => pad2(Math.min(TOTAL, Math.floor(v * TOTAL) + 1)));

  // active section
  useEffect(() => {
    const navIds = new Set(copy.nav.links.map((l) => l.href.slice(1)));
    // observe every top-level section so leaving a nav section clears the highlight
    const els = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(navIds.has(e.target.id) ? e.target.id : "")),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [copy.nav.links]);

  // lock scroll while the mobile menu is open + ESC to close
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#contenido"
        className="mono fixed left-4 top-4 z-[100] -translate-y-24 bg-bone px-4 py-3 text-ink focus:translate-y-0"
      >
        {copy.nav.skip}
      </a>

      {/* the page is a 37-chapter book: a thin red line reads how far in you are */}
      <motion.div aria-hidden style={{ scaleX: scrollYProgress }} className="fixed left-0 top-0 z-[55] h-[2px] w-full origin-left bg-ember" />

      <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <nav aria-label="Principal" className="flex items-center justify-between px-gutter py-5">
          <a href="#hela" className="flex items-center gap-3" aria-label="HELA — inicio">
            <Wordmark word="hela" className="text-[0.95rem]" />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {copy.nav.links.slice(1).map((l) => {
              const on = active === l.href.slice(1);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={on ? "true" : undefined}
                    className={`mono relative py-1 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                  >
                    {l.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ${on ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-5">
            <span aria-hidden className="mono hidden tabular-nums opacity-60 xl:inline">
              Cap. <motion.span>{chapter}</motion.span>/{TOTAL}
            </span>
            <a
              href={primaryPurchaseAnchor}
              onClick={() => track("nav_buy_click")}
              className="mono hidden border border-current px-4 py-2 transition-opacity hover:opacity-70 md:inline-block"
            >
              {copy.nav.buy}
            </a>
            <button
              type="button"
              className="mono -mr-3 px-3 py-3.5 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-movil"
              onClick={() => setOpen(true)}
            >
              {copy.nav.menu}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label={copy.nav.menu}
            className="fixed inset-0 z-[60] flex flex-col bg-ink px-gutter pb-8 pt-5"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <Wordmark word="hela" className="text-[0.95rem]" />
              </span>
              <button type="button" className="mono -mr-3 px-3 py-3.5" onClick={() => setOpen(false)} autoFocus>
                {copy.nav.close}
              </button>
            </div>
            <ul className="mt-12 flex flex-1 flex-col justify-center gap-1">
              {copy.nav.links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display block py-2 text-[13vw] leading-[0.95] sm:text-[10vw]"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.05 }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <a
              href={primaryPurchaseAnchor}
              onClick={() => setOpen(false)}
              className="mono bg-bone px-6 py-5 text-center font-medium text-ink"
            >
              {copy.nav.mobileBuy}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
