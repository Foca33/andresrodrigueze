"use client";

import { tiktokStats } from "@/config/social";
import { formatCompact } from "@/lib/format";
import { useCopy } from "@/components/Providers";
import { Reveal } from "@/components/motion/Reveal";

/** Data-driven: edit numbers in config/social.ts. */
export function SocialStats() {
  const c = useCopy().crime;
  const items: Array<[keyof typeof c.statLabels, string]> = [
    ["followers", formatCompact(tiktokStats.followers)],
    ["totalViews", formatCompact(tiktokStats.totalViews)],
    ["totalLikes", formatCompact(tiktokStats.totalLikes)],
    ["videos", String(tiktokStats.videos)],
    ["topVideoViews", `~${formatCompact(tiktokStats.topVideoViews)}`],
  ];
  return (
    <div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-bone/20 pt-8 md:grid-cols-5">
        {items.map(([key, value], i) => (
          <Reveal key={key} delay={i * 0.07} className="flex min-w-0 flex-col-reverse justify-end">
            <dt className="mono mt-3 text-smoke">{c.statLabels[key]}</dt>
            <dd className="display text-[clamp(2.6rem,5.6vw,5.6rem)] !leading-[0.9]">{value}</dd>
          </Reveal>
        ))}
      </dl>
      <p className="mono mt-8 !text-[0.72rem] text-fog">
        {c.approx}
        {tiktokStats.asOf ? ` · ${tiktokStats.asOf}` : ""}
        <br />
        {c.audienceTotal}
      </p>
    </div>
  );
}
