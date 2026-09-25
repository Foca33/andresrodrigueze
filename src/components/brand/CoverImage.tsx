"use client";

import Image from "next/image";
import { useAssets, useCopy } from "@/components/Providers";
import { Sigil } from "./Sigil";
import { cn } from "@/lib/cn";

type Kind = "hela" | "eric";

/** Clearly-marked stand-in used until the real cover file exists in /public/assets. */
function CoverPlaceholder({ kind }: { kind: Kind }) {
  const isHela = kind === "hela";
  return (
    <div
      data-placeholder="cover"
      data-cover={kind}
      className="grain relative isolate aspect-[2/3] w-full overflow-hidden bg-[#070707] ring-1 ring-white/10 [container-type:inline-size]"
      style={{
        backgroundImage:
          "radial-gradient(130% 62% at 50% -6%, rgba(236,230,218,0.20), transparent 62%), radial-gradient(90% 40% at 50% 108%, rgba(200,165,142,0.10), transparent 70%), linear-gradient(180deg,#151413,#050505)",
      }}
    >
      <div className="absolute inset-[5%] border border-bone/15" />
      <div className="mono absolute inset-x-[9%] top-[8%] flex justify-between text-bone/60" style={{ fontSize: "3.1cqw" }}>
        <span>Lago de Fuego</span>
        <span>Vol. {isHela ? "I" : "II"}</span>
      </div>
      <Sigil className="absolute left-1/2 top-[27%] w-[16%] -translate-x-1/2 text-bone/85" />
      <div
        className="display absolute inset-x-0 top-[44%] text-center text-bone"
        style={{ fontSize: isHela ? "27cqw" : "25cqw", letterSpacing: "-0.02em" }}
      >
        {isHela ? "HELA" : "ERIC"}
      </div>
      <div className="mono absolute inset-x-[9%] bottom-[8%] text-center text-bone/70" style={{ fontSize: "3cqw" }}>
        Andrés Rodríguez E.
      </div>
      <div
        className="mono absolute bottom-[3%] left-1/2 -translate-x-1/2 whitespace-nowrap text-ember"
        style={{ fontSize: "2.4cqw", letterSpacing: "0.2em" }}
      >
        Portada provisional
      </div>
    </div>
  );
}

export function CoverImage({
  kind,
  sizes = "(min-width: 1024px) 34vw, 80vw",
  priority = false,
  className,
  alt,
}: {
  kind: Kind;
  sizes?: string;
  priority?: boolean;
  className?: string;
  alt?: string;
}) {
  const assets = useAssets();
  const copy = useCopy();
  const asset = kind === "hela" ? assets.helaCover : assets.ericCover;
  const defaultAlt = kind === "hela" ? copy.hero.coverAlt : copy.eric.coverAlt;

  if (!asset) {
    return (
      <div className={className} role="img" aria-label={alt ?? defaultAlt}>
        <CoverPlaceholder kind={kind} />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
    >
      <Image
        src={asset.src}
        alt={alt ?? defaultAlt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={asset.blur ? "blur" : "empty"}
        blurDataURL={asset.blur}
        className="object-cover"
      />
    </div>
  );
}
