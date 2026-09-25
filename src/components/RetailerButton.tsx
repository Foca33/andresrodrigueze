"use client";

import { LinkButton } from "@/components/ui/Button";
import { retailers, type Edition, type RetailerLink } from "@/config/retailers";
import { isPlaceholderUrl, siteConfig } from "@/config/site";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { useCopy } from "@/components/Providers";

/**
 * One retailer → one obvious action. Always a real <a> opening in a NEW TAB.
 * No cart, no checkout: this site is a discovery layer; the retailer handles payment.
 */
export function RetailerButton({ edition, link, primary }: { edition: Edition; link: RetailerLink; primary?: boolean }) {
  const copy = useCopy().editions;
  const retailer = retailers[link.retailer];
  const label = link.cta ?? copy.cta.replace("{retailer}", retailer.name.toUpperCase());
  const placeholder = isPlaceholderUrl(link.url);

  return (
    <div>
      <LinkButton
        href={link.url}
        external
        variant={primary ? "primary" : "primary"}
        className="w-full"
        data-retailer={link.retailer}
        data-format={edition.id}
        data-placeholder={placeholder || undefined}
        onClick={() => {
          const params = { format: edition.id, retailer: link.retailer, placeholder };
          track(`purchase_click_${edition.id}` as AnalyticsEvent, params);
          track(`purchase_click_${link.retailer}` as AnalyticsEvent, params);
        }}
      >
        {label}
      </LinkButton>
      {placeholder && siteConfig.showPlaceholderNotices && (
        <p className="mono mt-2 !text-[0.72rem] text-ember">{copy.placeholderNote}</p>
      )}
    </div>
  );
}
