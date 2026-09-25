"use client";

import { useEffect, useRef } from "react";
import { useCopy } from "@/components/Providers";
import { PRIVACY_EVENT } from "@/lib/privacy";
import { siteConfig } from "@/config/site";

/**
 * Privacy + legal notice as a native <dialog> (focus trap, ESC and focus return come for free).
 * It lives on the page, so it works everywhere the site is hosted, static export included.
 */
export function PrivacyDialog() {
  const c = useCopy().privacy;
  const ref = useRef<HTMLDialogElement>(null);
  const email = siteConfig.author.email;
  const hasEmail = !email.startsWith("[");

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const open = () => {
      if (!dlg.open) dlg.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    const onClose = () => {
      document.documentElement.style.overflow = "";
    };
    window.addEventListener(PRIVACY_EVENT, open);
    dlg.addEventListener("close", onClose);
    return () => {
      window.removeEventListener(PRIVACY_EVENT, open);
      dlg.removeEventListener("close", onClose);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="privacidad-titulo"
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto max-h-[88svh] w-[min(42rem,calc(100vw-2rem))] overflow-y-auto border border-bone/15 bg-coal p-0 text-bone backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-bone/10 px-6 py-4 md:px-9">
        <h2 id="privacidad-titulo" className="mono text-bone">
          {c.title}
        </h2>
        <button type="button" className="mono -mr-3 px-3 py-3 text-smoke hover:text-bone" onClick={() => ref.current?.close()}>
          {c.close}
        </button>
      </div>
      <div className="space-y-7 px-6 py-8 md:px-9">
        {c.sections.map((s) => (
          <section key={s.h}>
            <h3 className="mono mb-2 text-bone">{s.h}</h3>
            <p className="text-[1.02rem] leading-[1.6] text-smoke">{s.p}</p>
          </section>
        ))}
        <p className="mono text-smoke">
          © {new Date().getFullYear()} {siteConfig.author.name}
          {hasEmail && (
            <>
              {" · "}
              {c.contact}:{" "}
              <a className="underline underline-offset-4 hover:text-bone" href={`mailto:${email}`}>
                {email}
              </a>
            </>
          )}
        </p>
      </div>
    </dialog>
  );
}
