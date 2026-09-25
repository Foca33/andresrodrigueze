"use client";

import { useCopy } from "@/components/Providers";
import { SocialLink } from "@/components/SocialLink";
import { Sigil } from "@/components/brand/Sigil";
import { Wordmark } from "@/components/brand/Wordmark";
import { editions } from "@/config/retailers";
import { isPlaceholderUrl, siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";
import { PrivacyLink } from "@/components/PrivacyLink";
import { ShareButton } from "@/components/ShareButton";

const firstLink = (retailer: "amazon" | "buscalibre") =>
  editions.flatMap((e) => e.links).find((l) => l.retailer === retailer && l.enabled);

/** Minimal. The page ends in darkness. */
export function Footer() {
  const copyAll = useCopy();
  const c = copyAll.footer;
  const amazon = firstLink("amazon");
  const buscalibre = firstLink("buscalibre");
  const link = "inline-block border-b border-transparent py-2.5 text-bone/70 transition-colors hover:border-bone hover:text-bone";

  return (
    <footer className="bg-[#030303] px-gutter pb-10 pt-[12svh]">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Sigil className="mb-8 h-8 w-8 text-bone/80" />
          <p className="text-[clamp(2.4rem,5vw,5rem)] leading-none text-bone">
            <Wordmark word="hela" label="HELA" />
          </p>
          <p className="mono mt-4 text-smoke">{c.line}</p>
          <p className="mono text-smoke">{c.author}</p>
        </div>

        <nav aria-label="Enlaces" className="md:col-span-4 md:col-start-7">
          <ul className="mono grid grid-cols-2 gap-x-6 gap-y-0">
            {amazon && (
              <li>
                <a
                  href={amazon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                  title={siteConfig.showPlaceholderNotices && isPlaceholderUrl(amazon.url) ? "Enlace provisional" : undefined}
                  onClick={() => track("purchase_click_amazon", { location: "footer" })}
                >
                  Amazon
                </a>
              </li>
            )}
            {buscalibre && (
              <li>
                <a
                  href={buscalibre.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                  title={siteConfig.showPlaceholderNotices && isPlaceholderUrl(buscalibre.url) ? "Enlace provisional" : undefined}
                  onClick={() => track("purchase_click_buscalibre", { location: "footer" })}
                >
                  Buscalibre
                </a>
              </li>
            )}
            {(["tiktok", "instagram", "goodreads", "email"] as const).map((id) => (
              <li key={id}>
                <SocialLink id={id} className={link} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="mono md:col-span-2 md:col-start-11">
          <ul className="grid gap-1">
            <li>
              <PrivacyLink location="footer" className="inline-block py-2.5 text-left text-bone/70 hover:text-bone">
                {c.privacy}
              </PrivacyLink>
            </li>
            <li>
              <ShareButton location="footer" label={copyAll.share.label} className="!border-transparent !py-2.5 !text-bone/70 hover:!text-bone [&_svg]:hidden" />
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-[14svh] flex flex-col justify-between gap-3 border-t border-bone/10 pt-6 text-fog md:flex-row">
        <p className="mono !text-[0.72rem]">
          © {new Date().getFullYear()} {siteConfig.author.name}. {c.rights}
        </p>
        <p className="mono !text-[0.72rem] md:max-w-md md:text-right">{c.fiction}</p>
      </div>
    </footer>
  );
}
